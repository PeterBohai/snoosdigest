import praw
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response

from api.serializers import RedditPostSerializer


class SubredditTopPostsList(APIView):
    def get(self, request, subreddit):
        reddit = praw.Reddit(**settings.REDDIT_APP_SETTINGS)

        n = int(request.query_params['n'])
        time_filter = request.query_params['time_filter']

        top_posts = list(reddit.subreddit(subreddit).top(time_filter, limit=n))
        serialized_posts = RedditPostSerializer(top_posts, many=True)
        return Response(serialized_posts.data)
