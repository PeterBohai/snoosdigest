"""This module contains a number of configurations that can be referenced by other modules."""

APP_NAME: str = "hackernews"
API_BASE_URL: str = "https://hacker-news.firebaseio.com/v0"
SORT_TYPES: set = {"best", "top", "ask"}  # Supported hackernews types
MAX_POSTS: int = 20
MAX_COMMENTS: int = 10
