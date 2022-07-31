import logging

from praw import Reddit
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
from users.serializers import SnoosDigestTokenObtainPairSerializer, UserSerializer
from users import utils

reddit: Reddit = Reddit(**settings.REDDIT_APP_SETTINGS)
logger = logging.getLogger(__name__)


def get_user_subreddit_watchlist() -> list[str]:
    return ['news', 'personalfinance', 'investing']


class UserSubredditSubscriptions(APIView):
    def get(self, request: Request) -> Response:
        # Example GET request: /api/users/subscriptions
        user = request.user
        user_subscriptions: list[str] = utils.get_user_subscriptions(user)
        return Response([f'r/{sub_name}' for sub_name in user_subscriptions])


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

