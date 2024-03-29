import logging
from typing import Union

from cachetools import TTLCache, cached
from django.conf import settings
from django.http import Http404
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from praw import Reddit
from praw.models import Submission as PrawSubmission
from praw.models import Subreddit as PrawSubreddit
from prawcore.exceptions import NotFound as PrawNotFound
from prawcore.exceptions import Redirect as PrawRedirect
from prawcore.exceptions import ResponseException as PrawResException
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from api import queries
from api.configs import (
    DEFAULT_POSTS_PER_SUBREDDIT_HOME,
    MAX_NUM_POSTS_PER_SUBREDDIT,
    MAX_SUBREDDIT_UPDATE_GAP,
)
from api.models import Subreddit, SubredditPost
from api.serializers import (
    RedditPostSerializer,
    SubredditPostSerializer,
    SubredditSerializer,
)

from .utils import get_augmented_post_details

reddit: Reddit = Reddit(**settings.REDDIT_APP_SETTINGS)
logger = logging.getLogger(__name__)


@cached(cache=TTLCache(maxsize=500, ttl=10))
def get_subreddit_top_posts(
    subreddit_name: str, time_filter: str, num_posts: int
) -> tuple[str, list[dict]]:
    # Query database first
    posts_up_to_date = True

    filter_params = {
        "subreddit__display_name__iexact": subreddit_name,
        f"top_{time_filter}_order__lte": MAX_NUM_POSTS_PER_SUBREDDIT,
    }
    subreddit_posts = SubredditPost.objects.filter(**filter_params).order_by(
        f"top_{time_filter}_order"
    )

    if subreddit_posts and subreddit_posts.count() >= num_posts:
        # Check if all posts were updated within the `max_update_gap` time
        display_name_prefixed = ""
        for post in subreddit_posts:
            display_name_prefixed = post.subreddit.display_name_prefixed
            if (timezone.now() - post.data_updated_timestamp_utc) > MAX_SUBREDDIT_UPDATE_GAP:
                posts_up_to_date = False
                break
        if posts_up_to_date:
            serialized_posts = SubredditPostSerializer(subreddit_posts, many=True).data
            logger.info(f"<{subreddit_name}> posts are up to date in db, returned db results")
            posts = []
            for post_details in serialized_posts[:num_posts]:
                posts.append(get_augmented_post_details(post_details, display_name_prefixed))
            return display_name_prefixed, posts

    # Call praw API if not in database or posts data is outdated, then update the database records
    logger.info(
        f"<{subreddit_name}> posts are not available or out of date in db, "
        f"query reddit API and cache to db"
    )
    praw_subreddit: PrawSubreddit = reddit.subreddit(subreddit_name)
    try:
        serialized_posts = queries.update_or_insert_subreddit_posts(
            subreddit_posts, praw_subreddit, time_filter
        )
    except PrawResException as err:
        logger.error(f"prawcore.exceptions.ResponseException: {err}")
        logger.info("Due to response issues from Reddit, using outdated posts for now")
        serialized_posts = SubredditPostSerializer(subreddit_posts, many=True).data

    posts = []
    for post_details in serialized_posts[:num_posts]:
        posts.append(get_augmented_post_details(post_details, praw_subreddit.display_name_prefixed))
    return praw_subreddit.display_name_prefixed, posts


class HomePagePostsList(APIView):
    @method_decorator(cache_page(2 * 60))
    def get(self, request: Request) -> Response:
        # Example GET request: /api/reddit/posts/homepage?time_filter=day&posts_per_subreddit=3
        posts_per_subreddit: int = int(
            request.query_params.get("posts_per_subreddit", DEFAULT_POSTS_PER_SUBREDDIT_HOME)
        )
        time_filter: str = request.query_params["time_filter"]
        subreddits: list[str] = request.query_params.getlist("subreddits")
        if not subreddits:
            return Response(subreddits, status=status.HTTP_204_NO_CONTENT)

        response: dict[str, list[dict]] = {}
        for subreddit in subreddits:
            display_name_prefixed, posts = get_subreddit_top_posts(
                subreddit, time_filter, posts_per_subreddit
            )
            response[display_name_prefixed] = posts
            queries.update_subreddit_last_viewed(subreddit)

        if not response:
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        return Response(response)


class SubredditTopPostsList(APIView):
    @method_decorator(cache_page(2 * 60))
    def get(self, request: Request, subreddit: str) -> Response:
        # Example GET request: /api/reddit/subreddits/news/top-posts?time_filter=day&n=2
        n: int = int(request.query_params["n"])
        time_filter: str = request.query_params["time_filter"]
        try:
            display_name_prefixed, posts = get_subreddit_top_posts(subreddit, time_filter, n)
            response: dict[str, Union[str, list[dict]]] = {
                "subreddit_name": display_name_prefixed,
                "posts": posts,
            }
            return Response(response)
        except PrawRedirect:
            print(f"prawcore.exceptions.Redirect: Subreddit <{subreddit}> not found - return 404")
            raise Http404


class RedditPostDetail(APIView):
    """View to return a single Reddit Post instance."""

    def get(self, request: Request, post_id: str) -> Response:
        """Returns a single Reddit Post Instance. Includes a limited number of top comments.

        Example GET request: /api/reddit/posts/<post_id>
        * Response includes subreddit name
        """
        try:
            post: PrawSubmission = reddit.submission(id=post_id)
            post.comment_sort = "top"
            post.comment_limit = 8
            serialized_post: RedditPostSerializer = RedditPostSerializer(post)
            subreddit_name = queries.get_subreddit_prefixed_name_of_post(post_id, post)
            return Response(get_augmented_post_details(serialized_post.data, subreddit_name))
        except PrawNotFound:
            print(f"prawcore.exceptions.NotFound: Post <{post_id}> does not exist - return 404")
            raise Http404


class SubredditList(APIView):
    """View to list of all available Subreddits excluding current user's subreddits.

    Mainly used to provide choices for autocomplete.
    * Requires JWT authentication through request header.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        """Returns a list of Subreddit objects. Excludes request user's subreddits.

        Example request: GET /api/reddit/subreddits/
        """
        user = request.user
        user_subs = user.user_subscriptions.values_list("subreddit", flat=True)
        subreddits = Subreddit.objects.exclude(subreddit_id__in=user_subs).values("display_name")
        serializer = SubredditSerializer(subreddits, many=True)
        return Response(serializer.data)
