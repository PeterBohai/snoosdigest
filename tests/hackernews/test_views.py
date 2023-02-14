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


def test_get_posts_returns_200_for_valid_path(api_client: APIClient) -> None:
    res: Response = api_client.get(f"{reverse('hackernews:posts')}?sort_type=best")

    assert res.status_code == HTTP_200_OK
    assert type(res.data) is list
    assert len(res.data) <= MAX_POSTS


def test_get_post_detail_returns_200_for_valid_id(api_client: APIClient) -> None:
    res: Response = api_client.get(reverse("hackernews:post_detail", kwargs={"post_id": 8863}))
    assert type(res.data) is dict
    assert res.data["by"] == "dhouston"
    assert type(res.data["descendants"]) is int
    assert res.data["id"] == 8863
    assert type(res.data["kids"]) is list
    assert type(res.data["score"]) is int
    assert res.data["time"] == 1175714200
    assert res.data["title"] == "My YC app: Dropbox - Throw away your USB drive"
    assert res.data["type"] == "story"
    assert res.data["url"] == "http://www.getdropbox.com/u/2/screencast.html"
