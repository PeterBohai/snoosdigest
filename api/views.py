import os

import praw
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response


# Create your views here.
class SubredditTopPostsList(APIView):
    def get(self, request, subreddit):
        reddit = praw.Reddit(**settings.REDDIT_APP_SETTINGS)

        n = int(request.query_params['n'])
        time_filter = request.query_params['time_filter']

        response = []
        for post in reddit.subreddit(subreddit).top(time_filter, limit=n):
            response.append({
                'title': post.title,
                'upvotes': post.score,
                'upvote_ratio': post.upvote_ratio,
                'num_comments': post.num_comments,
                'url': post.url,
                'body': post.selftext,
            })
        return Response(response)
