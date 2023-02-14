from typing import Any
from unittest.mock import patch

from django.urls import reverse
from django.utils.http import urlencode
from rest_framework.response import Response
from rest_framework.test import APIClient

from api import configs
from api.models import Subreddit


def mock_get_subreddit_top_posts_return_val(name: str, _: Any, num: int) -> tuple[str, list[dict]]:
    return f"r/{name}", [{} for _ in range(num)]


def mock_get_subreddit_return_value(name: str, **_: Any) -> Subreddit:
    return Subreddit(display_name=name)


def test_unauthenticated_home_page_posts_view_returns_default_subscriptions(
    api_client: APIClient,
) -> None:
    with patch("api.views.get_subreddit_top_posts") as mock_get_subreddit_top_posts, patch(
        "api.queries.get_subreddit"
    ) as mock_get_subreddit, patch("api.queries.update_subreddit_last_viewed"):
        mock_get_subreddit.side_effect = mock_get_subreddit_return_value
        mock_get_subreddit_top_posts.side_effect = mock_get_subreddit_top_posts_return_val
        response: Response = api_client.get(
            f"{reverse('api:home_page_posts')}?{urlencode({'time_filter': 'day'})}"
        )
    assert response.status_code == 200
    assert type(response.data) is dict
    assert len(response.data) == len(configs.DEFAULT_SUBSCRIPTIONS)
    assert list(response.data.keys()) == [f"r/{name}" for name in configs.DEFAULT_SUBSCRIPTIONS]
    assert type(list(response.data.values())[0]) is list
    assert len(list(response.data.values())[0]) == configs.DEFAULT_POSTS_PER_SUBREDDIT_HOME


def test_subreddit_posts_top_view_returns_correct_schema(api_client: APIClient) -> None:
    with patch("api.views.get_subreddit_top_posts") as mock_get_subreddit_top_posts:
        mock_get_subreddit_top_posts.side_effect = mock_get_subreddit_top_posts_return_val
        response: Response = api_client.get(
            f"{reverse('api:subreddit_posts_top', kwargs={'subreddit': 'news'})}?"
            f"{urlencode({'time_filter': 'day', 'n': 5})}"
        )
    assert response.status_code == 200
    assert type(response.data) is dict
    assert response.data == {"subreddit_name": "r/news", "posts": [{}, {}, {}, {}, {}]}
