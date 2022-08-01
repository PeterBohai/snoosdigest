import logging

from praw import Reddit
from praw.models import Subreddit as PrawSubreddit
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.db.utils import IntegrityError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status

from users.models import User
from users.serializers import SnoosDigestTokenObtainPairSerializer, UserSerializer, UserSubscriptionSerializer
from users import utils

from api.models import Subreddit
from api import queries

reddit: Reddit = Reddit(**settings.REDDIT_APP_SETTINGS)
logger = logging.getLogger(__name__)


def get_user_subreddit_watchlist() -> list[str]:
    return ['news', 'personalfinance', 'investing']


class UserSubredditSubscriptions(APIView):
    def get(self, request: Request) -> Response:
        """Example GET request: /api/users/subscriptions"""
        user = request.user
        user_subscriptions: list[str] = utils.get_user_subscriptions(user)
        return Response([f'r/{sub_name}' for sub_name in user_subscriptions])

    def post(self, request: Request) -> Response:
        """Example POST request: /api/users/subscriptions --data subreddit=bogleheads"""

        user: User = request.user
        if user.is_anonymous:
            return Response('User must be logged in to add subscriptions', status=status.HTTP_400_BAD_REQUEST)

        subreddit_input: str = request.data['subreddit']
        # Look up for the subreddit in the DB
        try:
            subreddit: Subreddit = Subreddit.objects.get(display_name__iexact=subreddit_input.lower())
            if user.user_subscriptions.filter(subreddit=subreddit).exists():
                return Response('Already subscribed', status=status.HTTP_400_BAD_REQUEST)
        except Subreddit.DoesNotExist:
            # If it does not exist in the DB, query reddit API
            praw_subreddit: PrawSubreddit = reddit.subreddit(subreddit_input.lower())

            # If it does not event exist in reddit API, return error response
            if not hasattr(praw_subreddit, 'id') or not hasattr(praw_subreddit, 'created'):
                return Response(f'{subreddit_input} is not a valid subreddit', status=status.HTTP_400_BAD_REQUEST)

            # Store the "new" valid subreddit in the DB
            subreddit: Subreddit = queries.insert_subreddit_data(praw_subreddit)

        serializer = UserSubscriptionSerializer(data={
            'user': user.id,
            'subreddit': subreddit.subreddit_id,
        })
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response('Bad request', status=status.HTTP_400_BAD_REQUEST)


class SnoosDigestTokenObtainPairView(TokenObtainPairView):
    serializer_class = SnoosDigestTokenObtainPairSerializer


class UserProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)


class UserRegister(APIView):
    def post(self, request: Request) -> Response:
        data = request.data

        try:
            new_user = User.objects.create(
                username=data['email'],
                email=data['email'],
                password=make_password(data['password'])
            )
            serializer = UserSerializer(new_user)
            return Response({
                **serializer.data,
                'access': utils.generate_user_access_token(new_user)
            })

        except IntegrityError as err:
            # Duplicate username detected
            logger.warning(f'django.db.utils.IntegrityError: {err}')

            return Response({
                'detail': 'Username already exists'
            }, status=status.HTTP_400_BAD_REQUEST)

