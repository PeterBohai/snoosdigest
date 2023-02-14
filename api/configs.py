import os
from datetime import timedelta

APP_NAME = "reddit"
MAX_NUM_POSTS_PER_SUBREDDIT: int = 5
DEFAULT_POSTS_PER_SUBREDDIT_HOME: int = 2
MAX_SUBREDDIT_UPDATE_GAP: timedelta = timedelta(
    minutes=int(os.environ.get("MAX_SUBREDDIT_UPDATE_GAP", 10))
)
DEFAULT_SUBSCRIPTIONS: list = [
    "news",
    "personalfinance",
    "investing",
]
UPDATE_SOURCE: str = "django-snoosdigest"
