from typing import Union
from datetime import datetime, timezone
import logging

from praw import Reddit
from praw.models import Subreddit as PrawSubreddit, Submission as PrawSubmission
from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from cachetools import cached, TTLCache

from api.serializers import RedditPostSerializer, SubredditPostSerializer
from api.models import SubredditPost
from api.consts import MAX_NUM_POSTS_PER_SUBREDDIT, MAX_SUBREDDIT_UPDATE_GAP
from api import queries
from users.utils import get_user_subscriptions

reddit: Reddit = Reddit(**settings.REDDIT_APP_SETTINGS)
logger = logging.getLogger(__name__)


@cached(cache=TTLCache(maxsize=500, ttl=10))
def get_subreddit_top_posts(
    subreddit_name: str, time_filter: str, num_posts: int
) -> tuple[str, list[dict]]:
    # Query database first
    posts_up_to_date = True

    filter_params = {
        'subreddit__display_name__iexact': subreddit_name,
        f'top_{time_filter}_order__lte': MAX_NUM_POSTS_PER_SUBREDDIT,
    }
    subreddit_posts = SubredditPost.objects.filter(**filter_params).order_by(
        f'top_{time_filter}_order'
    )

    if subreddit_posts and subreddit_posts.count() >= num_posts:
        # Check if all posts were updated within the `max_update_gap` time
        display_name_prefixed = ''
        for post in subreddit_posts:
            display_name_prefixed = post.subreddit.display_name_prefixed
            if (
                datetime.now(tz=timezone.utc) - post.data_updated_timestamp_utc
            ) > MAX_SUBREDDIT_UPDATE_GAP:
                posts_up_to_date = False
                break
        if posts_up_to_date:
            serialized_posts = SubredditPostSerializer(subreddit_posts, many=True).data
            logger.info(
                f'<{subreddit_name}> posts are available and up to date in db, returned db results'
            )
            return display_name_prefixed, serialized_posts[:num_posts]

    # Call praw API if not in database or posts data is outdated, then update the database records
    logger.info(
        f'<{subreddit_name}> posts are not available or out of date in db, query reddit API and cache to db'
    )
    praw_subreddit: PrawSubreddit = reddit.subreddit(subreddit_name)
    serialized_posts = queries.update_or_insert_subreddit_posts(
        subreddit_posts, praw_subreddit, time_filter
    )

    return praw_subreddit.display_name_prefixed, serialized_posts[:num_posts]


class HomePagePostsList(APIView):
    def get(self, request: Request) -> Response:
        # Example GET request: /api/posts/homepage?time_filter=day&posts_per_subreddit=3
        posts_per_subreddit: int = int(request.query_params.get('posts_per_subreddit', 2))
        time_filter: str = request.query_params['time_filter']
        user = request.user
        subreddits: list[str] = get_user_subscriptions(user, reddit)

        response: dict[str, list[dict]] = {}
        for subreddit in subreddits:
            display_name_prefixed, posts = get_subreddit_top_posts(
                subreddit, time_filter, posts_per_subreddit
            )
            response[display_name_prefixed] = posts

        if not subreddits and not response:
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        return Response(response)


class SubredditTopPostsList(APIView):
    def get(self, request: Request, subreddit: str) -> Response:
        # Example GET request: /api/subreddits/news/top-posts?time_filter=day&n=2
        n: int = int(request.query_params['n'])
        time_filter: str = request.query_params['time_filter']

        display_name_prefixed, posts = get_subreddit_top_posts(subreddit, time_filter, n)

        response: dict[str, Union[str, list[dict]]] = {
            'subreddit_name': display_name_prefixed,
            'posts': posts,
        }

        return Response(response)


class RedditPostDetail(APIView):
    def get(self, request: Request, post_id: str) -> Response:
        # Example GET request: /api/posts/ukq48t
        post: PrawSubmission = reddit.submission(id=post_id)

        post.comment_sort = 'top'
        post.comment_limit = 8

        serialized_post: RedditPostSerializer = RedditPostSerializer(post)
        return Response(serialized_post.data)
