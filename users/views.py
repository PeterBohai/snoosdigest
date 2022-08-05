import logging

import prawcore
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

from users.models import User, UserSubscription
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
        """Example POST request: /api/users/subscriptions --data {subreddit: bogleheads}"""

        user: User = request.user
        if user.is_anonymous:
            return Response('User must be logged in to add subscriptions', status=status.HTTP_401_UNAUTHORIZED)

        subreddit_input: str = request.data['subreddit']
        # Look for the subreddit in the DB
        try:
            subreddit: Subreddit = Subreddit.objects.get(display_name__iexact=subreddit_input.lower())
            if user.user_subscriptions.filter(subreddit=subreddit).exists():
                return Response('Already subscribed', status=status.HTTP_400_BAD_REQUEST)

        except Subreddit.DoesNotExist:
            # If it does not exist in the DB, query reddit API
            try:
                matched_subreddits: list[PrawSubreddit] = reddit.subreddits.search_by_name(subreddit_input.lower(), exact=True)
                if len(matched_subreddits) != 1:
                    return Response('Multiple potential subreddits found, please be more specific', status=status.HTTP_400_BAD_REQUEST)

                praw_subreddit: PrawSubreddit = matched_subreddits[0]
                # If it does not event exist in reddit API, return error response
                if not hasattr(praw_subreddit, 'id') or not hasattr(praw_subreddit, 'created'):
                    logger.error(f'{praw_subreddit} does not have "id" or "created" attributes')
                    return Response(f'"{subreddit_input}" is not a valid subreddit, please try again', status=status.HTTP_400_BAD_REQUEST)
            except prawcore.NotFound as err:
                logger.error(f'prawcore.NotFound Exception: {err}')
                return Response(f'"{subreddit_input}" is not a valid subreddit, please try again', status=status.HTTP_400_BAD_REQUEST)

            # Store the "new" valid subreddit in the DB
            subreddit: Subreddit = queries.insert_subreddit_data(praw_subreddit)

        serializer = UserSubscriptionSerializer(data={
            'user': user.id,
            'subreddit': subreddit.subreddit_id,
        })
        if serializer.is_valid():
            serializer.save()
            response = {
                'created': serializer.data,
                'subreddit_display_name_prefixed': subreddit.display_name_prefixed
            }
            return Response(response, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response('Bad request', status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request: Request) -> Response:
        """Example DELETE request: /api/users/subscriptions --data {subreddit: bogleheads}"""
        user: User = request.user
        if user.is_anonymous:
            return Response('User must be logged in to delete subscriptions', status=status.HTTP_401_UNAUTHORIZED)

        subreddit_input: str = request.data.get('subreddit', '')

        try:
            user_subscription: UserSubscription = user.user_subscriptions.get(subreddit__display_name__iexact=subreddit_input.lower())
            user_subscription.delete()
            return Response(f'<{subreddit_input}> was deleted from user subscriptions',
                            status=status.HTTP_200_OK)
        except UserSubscription.DoesNotExist:
            return Response(f'The requested subscription <{subreddit_input}> does not exist',
                            status=status.HTTP_400_BAD_REQUEST)
        except UserSubscription.MultipleObjectsReturned:
            return Response(f'There are multiple results for <{subreddit_input}> for the user ',
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)



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

