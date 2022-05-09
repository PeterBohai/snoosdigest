import praw
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response

from api.serializers import RedditPostPreviewSerializer, RedditPostSerializer

reddit = praw.Reddit(**settings.REDDIT_APP_SETTINGS)


def get_user_subreddit_watchlist():
    return ['news', 'personalfinance', 'investing']


class UserSubredditWatchList(APIView):
    def get(self, request):
        # Example GET request: /api/user/watchlist
        subreddits = get_user_subreddit_watchlist()
        return Response([f'r/{subreddit}' for subreddit in subreddits])


class HomePagePostsList(APIView):
    def get(self, request):
        # Example GET request: /api/posts/homepage?time_filter=day
        posts_per_subreddit = request.query_params.get('posts_per_subreddit')
        if not posts_per_subreddit:
            posts_per_subreddit = 2

        time_filter = request.query_params['time_filter']
        subreddits = get_user_subreddit_watchlist()

        response = {}
        for subreddit in subreddits:
            praw_subreddit = reddit.subreddit(subreddit)
            top_posts = list(praw_subreddit.top(time_filter, limit=posts_per_subreddit))
            response[praw_subreddit.display_name_prefixed] = RedditPostPreviewSerializer(top_posts, many=True).data

        return Response(response)


class SubredditTopPostsList(APIView):
    def get(self, request, subreddit):
        # Example GET request: /api/subreddits/news/top-posts?time_filter=day&n=2
        n = int(request.query_params['n'])
        time_filter = request.query_params['time_filter']

        praw_subreddit = reddit.subreddit(subreddit)
        top_posts = list(praw_subreddit.top(time_filter, limit=n))

        response = {
            'subreddit_name': praw_subreddit.display_name_prefixed
        }
        serialized_posts = RedditPostPreviewSerializer(top_posts, many=True)
        response['posts'] = serialized_posts.data

        return Response(response)


class RedditPostDetail(APIView):
    def get(self, request, post_id):
        # Example GET request: /api/posts/ukq48t
        post = reddit.submission(id=post_id)

        post.comment_sort = 'top'
        post.comment_limit = 8

        serialized_post = RedditPostSerializer(post)
        return Response(serialized_post.data)
