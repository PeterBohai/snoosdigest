from cachetools import TTLCache, cached
from django.conf import settings
from praw import Reddit as PrawReddit
from rest_framework_simplejwt.tokens import RefreshToken

from api import consts, queries
from users.models import User


def generate_user_access_token(user: User) -> str:
    jwt_refresh_token = RefreshToken.for_user(user)
    # Custom private claims (also in user serializer)
    jwt_refresh_token[f'{settings.NAMESPACE}/username'] = user.username
    return str(jwt_refresh_token.access_token)


@cached(cache=TTLCache(maxsize=50, ttl=2))
def get_user_subscriptions(user: User, praw_reddit: PrawReddit) -> list[str]:

    if user.is_anonymous:
        subscriptions: list[str] = []
        for subreddit_name in consts.DEFAULT_SUBSCRIPTIONS:
            subreddit = queries.get_subreddit(subreddit_name, praw_reddit)
            subscriptions.append(subreddit.display_name)
        return subscriptions

    user_sub_objs = user.user_subscriptions.all()
    user_subscriptions: list[str] = [user_sub.subreddit.display_name for user_sub in user_sub_objs]

    return user_subscriptions
