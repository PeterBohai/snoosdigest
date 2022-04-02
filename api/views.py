import praw
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response

from api.serializers import RedditPostPreviewSerializer, RedditPostSerializer

reddit = praw.Reddit(**settings.REDDIT_APP_SETTINGS)


class SubredditTopPostsList(APIView):
    def get(self, request, subreddit):
        n = int(request.query_params['n'])
        time_filter = request.query_params['time_filter']

        top_posts = list(reddit.subreddit(subreddit).top(time_filter, limit=n))
        serialized_posts = RedditPostPreviewSerializer(top_posts, many=True)
        return Response(serialized_posts.data)


class RedditPostDetail(APIView):
    def get(self, request, post_id):
        post = reddit.submission(id=post_id)

        post.comment_sort = 'top'
        post.comment_limit = 16

        serialized_post = RedditPostSerializer(post)
        return Response(serialized_post.data)
