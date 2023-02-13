import logging
import os

from cachetools import TTLCache, cached
from django.conf import settings
from django.contrib.auth.models import update_last_login
from praw import Reddit as PrawReddit
from rest_framework_simplejwt.tokens import RefreshToken
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from api import configs, queries
from users.models import User

logger = logging.getLogger(__name__)
RESET_PASSWORD_TEMPLATE_ID = "d-12b7bc8ebe6c4296a937d682f5bb6fed"


def generate_user_access_token(user: User) -> str:
    jwt_refresh_token = RefreshToken.for_user(user)
    # Custom private claims (also in user serializer)
    jwt_refresh_token[f"{settings.NAMESPACE}/username"] = user.username
    update_last_login(None, user)
    return str(jwt_refresh_token.access_token)


@cached(cache=TTLCache(maxsize=50, ttl=2))
def get_user_subscriptions(user: User, praw_reddit: PrawReddit) -> list[str]:
    if user.is_anonymous:
        subscriptions: list[str] = []
        for subreddit_name in configs.DEFAULT_SUBSCRIPTIONS:
            subreddit = queries.get_subreddit(subreddit_name, praw_reddit=praw_reddit)
            subscriptions.append(subreddit.display_name)
        return subscriptions

    user_sub_objs = user.user_subscriptions.all()
    user_subscriptions: list[str] = [user_sub.subreddit.display_name for user_sub in user_sub_objs]

    return user_subscriptions


def send_reset_password_email(reset_password_url: str, to_email: str) -> bool:
    """Sends an email using SendGrid's Dynamic Template.

    Args:
        reset_password_url (str): Contains 'subject' and 'html_content' fields.
        to_email (str): The email address that will receive the message.

    Returns:
        None
    """
    if settings.DEV_ENVIRONMENT:
        to_email = os.environ["DEV_DEFAULT_EMAIL"]

    message = Mail(from_email="support@snoosdigest.com", to_emails=to_email)
    message.dynamic_template_data = {"reset_password_url": reset_password_url}
    message.template_id = RESET_PASSWORD_TEMPLATE_ID

    try:
        sg = SendGridAPIClient(os.environ["SENDGRID_API_KEY"])
        response = sg.send(message)
        logger.info(f"Email was sent to {to_email}, status_code={response.status_code}")
    except Exception as err:
        logger.error(f"Exception: {err}")
        return False
    return True
