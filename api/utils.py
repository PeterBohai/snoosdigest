from typing import Any

from django.conf import settings

from .configs import APP_NAME


def normalize_text_content(text: str) -> str:
    text = text.replace("&#x200B;", "")
    return text.strip()


def generate_full_reddit_link(link_path: str) -> str:
    return f"https://www.reddit.com{link_path.strip()}".strip()


def generate_reddit_link_from_id(reddit_id: str) -> str:
    return f"https://redd.it/{reddit_id.strip()}".strip()


def get_augmented_post_details(post: dict[str, Any], subreddit_name: str) -> dict[str, Any]:
    """Returns post details with extra fields. Primarily for friendlier frontend consumption."""
    return {
        **post,
        f"{settings.NAMESPACE}_app": APP_NAME,
        "subreddit_name": subreddit_name,
        "created_utc": post.get("created_unix_timestamp") or post.get("created_utc"),
    }
