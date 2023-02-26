from typing import Any
from unittest.mock import patch

from django.urls import reverse
from django.utils.http import urlencode
from rest_framework.response import Response
from rest_framework.test import APIClient

from api.models import Subreddit


def mock_get_subreddit_top_posts_return_val(name: str, _: Any, num: int) -> tuple[str, list[dict]]:
    return f"r/{name}", [{} for _ in range(num)]


def mock_get_subreddit_return_value(name: str, **_: Any) -> Subreddit:
    return Subreddit(display_name=name)


def test_get_home_page_posts_view_returns_204_if_no_subreddits_given(
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
    assert response.status_code == 204


def test_get_home_page_posts_view_returns_200_for_list_of_subreddits(
    api_client: APIClient,
) -> None:
    with patch("api.views.get_subreddit_top_posts") as mock_get_subreddit_top_posts, patch(
        "api.queries.get_subreddit"
    ) as mock_get_subreddit, patch("api.queries.update_subreddit_last_viewed"):
        mock_get_subreddit.side_effect = mock_get_subreddit_return_value
        mock_get_subreddit_top_posts.side_effect = mock_get_subreddit_top_posts_return_val
        query_params = urlencode(
            {"time_filter": "day", "subreddits": ["news", "Bogleheads"]}, doseq=True
        )
        response: Response = api_client.get(f"{reverse('api:home_page_posts')}?{query_params}")
    assert response.status_code == 200
    assert list(response.data.keys()) == ["r/news", "r/Bogleheads"]


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
