import logging

from django.conf import settings
from django.db.utils import IntegrityError
from django.utils import timezone
from praw import Reddit
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from api import configs, queries
from api.models import Subreddit
from users import utils
from users.models import PasswordResetRequest, User, UserSubscription
from users.serializers import (
    SnoosDigestTokenObtainPairSerializer,
    UserSerializer,
    UserSubscriptionSerializer,
)

reddit: Reddit = Reddit(**settings.REDDIT_APP_SETTINGS)
logger = logging.getLogger(__name__)


class UserSubredditSubscriptions(APIView):
    def get(self, request: Request) -> Response:
        """Example GET request: /api/users/subscriptions
        If the Authorization token sent is incorrect, a 401 unauthorized Response is sent back.
        """
        user = request.user
        user_subscriptions: list[str] = utils.get_user_subscriptions(user, reddit)
        return Response([f"r/{sub_name}" for sub_name in user_subscriptions])

    def post(self, request: Request) -> Response:
        """Example POST request: /api/users/subscriptions --data {subreddit: bogleheads}"""
        user: User = request.user
        if user.is_anonymous:
            error_msg: str = "User must be logged in to add subscriptions"
            logger.error(f"Response(status=400, {error_msg})")
            return Response(error_msg, status=status.HTTP_401_UNAUTHORIZED)

        subreddit_input: str = request.data["subreddit"]

        try:
            subreddit: Subreddit = queries.get_subreddit(subreddit_input, praw_reddit=reddit)
        except ValueError as err:
            logger.error(f"Response(status=400, {err})")
            return Response(str(err), status=status.HTTP_400_BAD_REQUEST)

        if user.user_subscriptions.filter(subreddit=subreddit).exists():
            error_msg = "Already subscribed"
            logger.error(f"Response(status=400, {error_msg})")
            return Response(error_msg, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserSubscriptionSerializer(
            data={
                "user": user.id,
                "subreddit": subreddit.subreddit_id,
            }
        )
        if not serializer.is_valid():
            logger.error(f"Response(status=400, Bad request: {serializer.errors})")
            return Response("Bad request", status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        response = {
            "created": serializer.data,
            "subreddit_display_name_prefixed": subreddit.display_name_prefixed,
        }
        return Response(response, status=status.HTTP_201_CREATED)

    def delete(self, request: Request) -> Response:
        """Example DELETE request: /api/users/subscriptions --data {subreddit: bogleheads}"""
        user: User = request.user
        if user.is_anonymous:
            return Response(
                "User must be logged in to delete subscriptions",
                status=status.HTTP_401_UNAUTHORIZED,
            )

        subreddit_input: str = request.data.get("subreddit", "")

        try:
            user_subscription: UserSubscription = user.user_subscriptions.get(
                subreddit__display_name__iexact=subreddit_input.lower()
            )
            user_subscription.delete()
            return Response(
                f"<{subreddit_input}> was deleted from user subscriptions",
                status=status.HTTP_200_OK,
            )
        except UserSubscription.DoesNotExist:
            return Response(
                f"The requested subscription <{subreddit_input}> does not exist",
                status=status.HTTP_400_BAD_REQUEST,
            )
        except UserSubscription.MultipleObjectsReturned:
            return Response(
                f"There are multiple results for <{subreddit_input}> for the user ",
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

    def put(self, request: Request) -> Response:
        """Example PUT request: /api/users/profile
        --data {first_name: "John", first_name: "Doe"}
        """
        user = request.user
        serializer = UserSerializer(
            user,
            data={
                "username": user.username,
                **request.data,
            },
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request: Request) -> Response:
        """Example DELETE request: /api/users/profile"""
        user = request.user
        user.delete()
        print(f"DELETED user <{user.email}>")
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserRegister(APIView):
    def post(self, request: Request) -> Response:
        data = request.data

        try:
            new_user = User.objects.create_user(
                first_name=data["firstName"],
                last_name=data["lastName"],
                username=data["email"],
                email=data["email"],
                password=data["password"],
            )

            # Assign the default subscriptions to the new user
            for subreddit_name in configs.DEFAULT_SUBSCRIPTIONS:
                try:
                    subreddit: Subreddit = queries.get_subreddit(subreddit_name, praw_reddit=reddit)
                except ValueError:
                    logger.info(
                        f"An error occurred with trying to access the default subreddit "
                        f"<{subreddit_name}>"
                    )
                    continue
                serializer = UserSubscriptionSerializer(
                    data={
                        "user": new_user.id,
                        "subreddit": subreddit.subreddit_id,
                    }
                )
                if not serializer.is_valid():
                    logger.error(f"serializer is not valid: {serializer.errors}")
                    continue
                serializer.save()

            return Response(
                {
                    "username": new_user.username,
                    "access": utils.generate_user_access_token(new_user),
                }
            )

        except IntegrityError as err:
            # Duplicate username detected
            logger.warning(f"django.db.utils.IntegrityError: {err}")

            return Response(
                {"detail": "An account with that email already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class UserUpdatePassword(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        """Example POST request: /api/users/update-password
        --data {
            oldPassword: "currentpass",
            newPassword: "myseceretpass1!",
            newPasswordConfirmation: "myseceretpass1!"
        }
        """
        user: User = request.user

        if not user.check_password(request.data["oldPassword"]):
            return Response(
                {"oldPassword": "Old password is incorrect"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if request.data["newPassword"] != request.data["newPasswordConfirmation"]:
            return Response(
                {"newPasswordConfirmation": "Confirmation password did not match the new password"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if request.data["oldPassword"] == request.data["newPassword"]:
            return Response(
                {"newPassword": "New password cannot be the same as the old password"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(request.data["newPassword"])
        user.save()
        return Response("Password has been updated successfully")


class UserResetPasswordRequest(APIView):
    def post(self, request: Request) -> Response:
        """Example POST request: /api/users/reset-password
        --data { email: "example@email.com" }
        """
        requested_email = request.data["email"]

        try:
            user = User.objects.get(email=requested_email)
        except User.DoesNotExist:
            logger.info(f"User ({requested_email}) does not exist")
            return Response("User does not exist", status=status.HTTP_400_BAD_REQUEST)

        # Check if request already exists and not expired
        try:
            existing_reset = PasswordResetRequest.objects.get(user=user, used=False)
            curr_time = timezone.now()
            if curr_time < existing_reset.expire_time:
                logger.info(f"The current reset request for {requested_email} has not expired yet")
                return Response(f"An email has already been sent to {requested_email}")

            # Request has expired. Delete the current one so a new request can be created
            logger.info("The current reset request has expired")
            existing_reset.delete()
        except PasswordResetRequest.DoesNotExist:
            logger.info("No reset request exists")

        new_password_request = PasswordResetRequest(user_id=user.id)
        new_password_request.save()
        logger.info(f"Created new PasswordResetRequest for {requested_email}")

        # Create reset password URL and send email via SendGrid
        host_name = request.build_absolute_uri("/")
        confirm_link = (
            f"{host_name}reset-password-confirmation/{user.id}/{new_password_request.reset_token}"
        )
        sent_email: bool = utils.send_reset_password_email(confirm_link, requested_email)
        if not sent_email:
            logger.error("There was an issue with sending the reset password email")
            return Response(
                "There was an issue with sending the reset password email",
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        logger.info(f"Sent email with reset url {confirm_link}")
        return Response(f"Request sent to {requested_email}, please check your email")


class UserResetPasswordConfirm(APIView):
    def post(self, request: Request) -> Response:
        """Example POST request: /api/users/reset-password-confirmation
        --data {
            userID: "12",
            resetToken: "326jbadsk-nasnjijw2-das",
            newPassword: "myseceretpass1!",
            newPasswordConfirmation: "myseceretpass1!"
        }
        """
        user_id = request.data["userID"]
        reset_token = request.data["resetToken"]
        try:
            password_request: PasswordResetRequest = PasswordResetRequest.objects.get(
                user_id=user_id, reset_token=reset_token, used=False
            )
        except PasswordResetRequest.DoesNotExist:
            logger.error(f"PasswordResetRequest.DoesNotExist for ({user_id}, {reset_token})")
            return Response(
                {"newPasswordConfirmation": "Invalid user and/or password reset token"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except PasswordResetRequest.MultipleObjectsReturned:
            logger.error(
                f"PasswordResetRequest.MultipleObjectsReturned for ({user_id}, {reset_token})"
            )
            return Response(
                {
                    "newPasswordConfirmation": "An error occurred while attempting to "
                    "reset your password"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        if timezone.now() > password_request.expire_time:
            logger.error(f"Reset password request has expired for ({user_id}, {reset_token})")
            return Response(
                {
                    "newPasswordConfirmation": "This password reset request has expired. "
                    "Please request a new reset link."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if request.data["newPassword"] != request.data["newPasswordConfirmation"]:
            return Response(
                {"newPasswordConfirmation": "Confirmation password did not match the new password"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user: User = password_request.user
        user.set_password(request.data["newPassword"])
        user.save()
        password_request.used = True
        password_request.save()
        return Response("Password has been reset successfully")
