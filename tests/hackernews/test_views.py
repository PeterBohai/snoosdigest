from unittest.mock import Mock, patch

from django.urls import reverse
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.test import APIClient

from hackernews.configs import MAX_POSTS, SORT_TYPES


def test_get_posts_returns_400_on_bad_sort_type(api_client: APIClient) -> None:
    res: Response = api_client.get(f"{reverse('hackernews:posts')}?sort_type=bad")

    assert res.status_code == HTTP_400_BAD_REQUEST
    # Check that we return the supported types. Ensures the error message is useful.
    assert ", ".join(SORT_TYPES) in res.data


def test_get_posts_returns_200_for_valid_path(
    api_client: APIClient, hackernews_json_res: dict
) -> None:
    with patch("requests.get") as mock_get, patch(
        "hackernews.utils.get_item_details"
    ) as mock_get_item_details:
        mock_get.return_value = Mock(
            status_code=200,
            json=lambda: [
                1234,
                5678,
            ],
        )
        mock_get_item_details.return_value = hackernews_json_res
        res: Response = api_client.get(f"{reverse('hackernews:posts')}?sort_type=best")
    assert res.status_code == HTTP_200_OK
    assert type(res.data) is list
    assert len(res.data) <= MAX_POSTS


def test_get_post_detail_returns_200_for_valid_id(
    api_client: APIClient, hackernews_json_res: dict
) -> None:
    with patch("requests.get") as mock_get:
        mock_get.return_value = Mock(status_code=200, json=lambda: hackernews_json_res)
        res: Response = api_client.get(reverse("hackernews:post_detail", kwargs={"post_id": 8863}))

    assert res.status_code == 200
    assert res.data == {
        "snoosdigest_app": "hackernews",
        "hackernews_id": 8863,
        "title": "My YC app: Dropbox - Throw away your USB drive",
        "author_name": "dhouston",
        "upvotes": 104,
        "num_comments": 71,
        "body": "http://www.getdropbox.com/u/2/screencast.html",
        "body_url": "http://www.getdropbox.com/u/2/screencast.html",
        "hackernews_url": "https://news.ycombinator.com/item?id=8863",
        "created_utc": 1175714200,
        "comments": [9224, 8917],
        "type": "story",
    }


def test_get_comment_detail_returns_200_for_valid_id(
    api_client: APIClient, hackernews_comment_json_res: dict
) -> None:
    with patch("requests.get") as mock_get:
        mock_get.return_value = Mock(status_code=200, json=lambda: hackernews_comment_json_res)
        res: Response = api_client.get(
            reverse("hackernews:comment_detail", kwargs={"comment_id": 2921983})
        )
    assert res.status_code == 200
    assert res.data == {
        "id": 2921983,
        "author": "norvig",
        "body": "Test text",
        "is_submitter": False,
        "upvotes": None,
        "created_utc": 1314211127,
        "permalink": "https://news.ycombinator.com/item?id=2921983",
    }
