from rest_framework_simplejwt.tokens import RefreshToken
from users.models import User


def normalize_text_content(text: str) -> str:
    text = text.replace('&#x200B;', '')
    return text.strip()


def generate_full_reddit_link(link_path: str) -> str:
    return f'https://www.reddit.com{link_path}'.strip()


def generate_reddit_link_from_id(reddit_id: str) -> str:
    return f'https://redd.it/{reddit_id}'.strip()


def generate_user_access_token(user: User) -> str:
    jwt_refresh_token = RefreshToken.for_user(user)
    return str(jwt_refresh_token.access_token)
