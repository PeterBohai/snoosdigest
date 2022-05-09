from typing import Union

from praw import Reddit
from praw.models import Subreddit, Submission
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request

from api.serializers import RedditPostPreviewSerializer, RedditPostSerializer

reddit: Reddit = Reddit(**settings.REDDIT_APP_SETTINGS)


def get_user_subreddit_watchlist() -> list[str]:
    return ['news', 'personalfinance', 'investing']


class UserSubredditWatchList(APIView):
    def get(self, request: Request) -> Response:
        # Example GET request: /api/user/watchlist
        subreddits: list[str] = get_user_subreddit_watchlist()
        return Response([f'r/{subreddit}' for subreddit in subreddits])


class HomePagePostsList(APIView):
    def get(self, request: Request) -> Response:
        # Example GET request: /api/posts/homepage?time_filter=day&posts_per_subreddit=3
        posts_per_subreddit: int = int(request.query_params.get('posts_per_subreddit', 2))

        time_filter: str = request.query_params['time_filter']
        subreddits: list[str] = get_user_subreddit_watchlist()

        response: dict[str, list[dict]] = {}
        for subreddit in subreddits:
            praw_subreddit: Subreddit = reddit.subreddit(subreddit)
            top_posts: list[Submission] = list(praw_subreddit.top(time_filter, limit=posts_per_subreddit))

            response[praw_subreddit.display_name_prefixed] = RedditPostPreviewSerializer(top_posts, many=True).data

        return Response(response)


class SubredditTopPostsList(APIView):
    def get(self, request: Request, subreddit: str) -> Response:
        # Example GET request: /api/subreddits/news/top-posts?time_filter=day&n=2
        n: int = int(request.query_params['n'])
        time_filter: str = request.query_params['time_filter']

        praw_subreddit: Subreddit = reddit.subreddit(subreddit)
        top_posts: list[Submission] = list(praw_subreddit.top(time_filter, limit=n))

        response: dict[str, Union[str, list[dict]]] = {
            'subreddit_name': praw_subreddit.display_name_prefixed,
            'posts': RedditPostPreviewSerializer(top_posts, many=True).data
        }

        return Response(response)


class RedditPostDetail(APIView):
    def get(self, request: Request, post_id: str) -> Response:
        # Example GET request: /api/posts/ukq48t
        post: Submission = reddit.submission(id=post_id)

        post.comment_sort = 'top'
        post.comment_limit = 8

        serialized_post: RedditPostSerializer = RedditPostSerializer(post)
        return Response(serialized_post.data)
