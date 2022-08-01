from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken

from users.models import User


def generate_user_access_token(user: User) -> str:
    jwt_refresh_token = RefreshToken.for_user(user)
    # Custom private claims (also in user serializer)
    jwt_refresh_token[f'{settings.NAMESPACE}/username'] = user.username
    return str(jwt_refresh_token.access_token)


def get_user_subscriptions(user: User) -> list[str]:

    if user.is_anonymous:
        return ['news', 'personalfinance', 'investing']

    user_sub_objs = user.user_subscriptions.all()
    user_subscriptions: list[str] = [user_sub.subreddit.display_name for user_sub in user_sub_objs]

    return user_subscriptions
