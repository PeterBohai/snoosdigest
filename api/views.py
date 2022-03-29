from rest_framework.views import APIView
from rest_framework.response import Response


# Create your views here.
class SubredditPostsTop(APIView):
    def get(self, request, subreddit):
        n = request.query_params['n']
        return Response({'subreddit': subreddit, 'n': n})
