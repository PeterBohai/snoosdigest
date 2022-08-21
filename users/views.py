import logging

from django.conf import settings
from django.db.utils import IntegrityError
from praw import Reddit
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from api import consts, queries
from api.models import Subreddit
from users import utils
from users.models import User, UserSubscription
from users.serializers import (
    SnoosDigestTokenObtainPairSerializer,
    UserSerializer,
    UserSubscriptionSerializer,
)

reddit: Reddit = Reddit(**settings.REDDIT_APP_SETTINGS)
logger = logging.getLogger(__name__)


class UserSubredditSubscriptions(APIView):
    def get(self, request: Request) -> Response:
        """Example GET request: /api/users/subscriptions"""
        user = request.user
        user_subscriptions: list[str] = utils.get_user_subscriptions(user, reddit)
        return Response([f'r/{sub_name}' for sub_name in user_subscriptions])

    def post(self, request: Request) -> Response:
        """Example POST request: /api/users/subscriptions --data {subreddit: bogleheads}"""
        user: User = request.user
        if user.is_anonymous:
            error_msg: str = 'User must be logged in to add subscriptions'
            logger.error(f'Response(status=400, {error_msg})')
            return Response(error_msg, status=status.HTTP_401_UNAUTHORIZED)

        subreddit_input: str = request.data['subreddit']

        try:
            subreddit: Subreddit = queries.get_subreddit(subreddit_input, reddit)
        except ValueError as err:
            logger.error(f'Response(status=400, {err})')
            return Response(str(err), status=status.HTTP_400_BAD_REQUEST)

        if user.user_subscriptions.filter(subreddit=subreddit).exists():
            error_msg = 'Already subscribed'
            logger.error(f'Response(status=400, {error_msg})')
            return Response(error_msg, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserSubscriptionSerializer(
            data={
                'user': user.id,
                'subreddit': subreddit.subreddit_id,
            }
        )
        if not serializer.is_valid():
            logger.error(f'Response(status=400, Bad request: {serializer.errors})')
            return Response('Bad request', status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        response = {
            'created': serializer.data,
            'subreddit_display_name_prefixed': subreddit.display_name_prefixed,
        }
        return Response(response, status=status.HTTP_201_CREATED)

    def delete(self, request: Request) -> Response:
        """Example DELETE request: /api/users/subscriptions --data {subreddit: bogleheads}"""
        user: User = request.user
        if user.is_anonymous:
            return Response(
                'User must be logged in to delete subscriptions',
                status=status.HTTP_401_UNAUTHORIZED,
            )

        subreddit_input: str = request.data.get('subreddit', '')

        try:
            user_subscription: UserSubscription = user.user_subscriptions.get(
                subreddit__display_name__iexact=subreddit_input.lower()
            )
            user_subscription.delete()
            return Response(
                f'<{subreddit_input}> was deleted from user subscriptions',
                status=status.HTTP_200_OK,
            )
        except UserSubscription.DoesNotExist:
            return Response(
                f'The requested subscription <{subreddit_input}> does not exist',
                status=status.HTTP_400_BAD_REQUEST,
            )
        except UserSubscription.MultipleObjectsReturned:
            return Response(
                f'There are multiple results for <{subreddit_input}> for the user ',
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UserLogin(TokenObtainPairView):
    serializer_class = SnoosDigestTokenObtainPairSerializer


class UserProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)


class UserRegister(APIView):
    def post(self, request: Request) -> Response:
        data = request.data

        try:
            new_user = User.objects.create_user(
                first_name=data['firstName'],
                last_name=data['lastName'],
                username=data['email'],
                email=data['email'],
                password=data['password'],
            )

            # Assign the default subscriptions to the new user
            for subreddit_name in consts.DEFAULT_SUBSCRIPTIONS:
                try:
                    subreddit: Subreddit = queries.get_subreddit(subreddit_name, reddit)
                except ValueError:
                    logger.info(
                        f'An error occurred with trying to access the default subreddit '
                        f'<{subreddit_name}>'
                    )
                    continue
                serializer = UserSubscriptionSerializer(
                    data={
                        'user': new_user.id,
                        'subreddit': subreddit.subreddit_id,
                    }
                )
                if not serializer.is_valid():
                    logger.error(f'serializer is not valid: {serializer.errors}')
                    continue
                serializer.save()

            return Response(
                {
                    'username': new_user.username,
                    'access': utils.generate_user_access_token(new_user),
                }
            )

        except IntegrityError as err:
            # Duplicate username detected
            logger.warning(f'django.db.utils.IntegrityError: {err}')

            return Response(
                {'detail': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST
            )


class UserUpdatePassword(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        """Example POST request: /api/users/update-password
        --data {
            old_password: "currentpass",
            new_password: "myseceretpass1!",
            new_password_confirmation: "myseceretpass1!"
        }
        """
        user: User = request.user

        if not user.check_password(request.data['old_password']):
            return Response(
                'Old password is incorrect',
                status=status.HTTP_400_BAD_REQUEST,
            )

        if request.data['new_password'] != request.data['new_password_confirmation']:
            return Response(
                'Confirmation password did not match the new password',
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(request.data['new_password'])
        user.save()
        return Response('Password has been updated successfully')
