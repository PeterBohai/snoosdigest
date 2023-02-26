from typing import Any, Generator
from unittest.mock import Mock, patch

import pytest
from rest_framework.exceptions import APIException

from hackernews.utils import (
    build_comment_item,
    build_post_body,
    build_post_like_item,
    build_source_url,
    determine_is_body_url,
    get_item_details,
)


@pytest.fixture(autouse=True)
def clear_cache() -> Generator:
    """Clears the cache for each test so cached content of previous tests do not pollute current."""
    yield
    get_item_details.cache_clear()


def test_get_item_details_returns_correct_data(hackernews_json_res: dict) -> None:
    test_response = Mock(status_code=200, json=lambda: hackernews_json_res)
    with patch("requests.get") as mock_get:
        mock_get.return_value = test_response
        item = get_item_details(8863)  # Item ID is picked from example in the official docs
        assert type(item) is dict
        assert item["by"] == "dhouston"
        assert type(item["descendants"]) is int
        assert item["id"] == 8863
        assert type(item["kids"]) is list
        assert type(item["score"]) is int
        assert item["time"] == 1175714200
        assert item["title"] == "My YC app: Dropbox - Throw away your USB drive"
        assert item["type"] == "story"
        assert item["url"] == "http://www.getdropbox.com/u/2/screencast.html"


def test_get_item_details_throw_exception_on_bad_response() -> None:
    with patch("requests.get") as mock_get, pytest.raises(APIException) as err:
        mock_get.return_value = Mock(status_code=500)
        get_item_details(8863)
    assert str(8863) in str(err.value)
    assert f"{500} status" in str(err.value)


def test_get_item_details_caches_function() -> None:
    test_response = Mock(status_code=200, json=lambda: {"title": "test_response"})
    with patch("requests.get") as mock_get:
        mock_get.return_value = test_response
        response = get_item_details(8863)
        assert mock_get.called is True
        assert response == {"title": "test_response"}

    # Cached call
    with patch("requests.get") as mock_get:
        mock_get.return_value = test_response
        response = get_item_details(8863)
        assert mock_get.called is False
        assert response == {"title": "test_response"}


def test_determine_is_body_url_returns_true_correctly() -> None:
    assert determine_is_body_url({"url": "https://url.com"}) is True
    assert determine_is_body_url({"text": "", "url": "https://url.com"}) is True


def test_determine_is_body_url_returns_false_correctly() -> None:
    assert determine_is_body_url({"text": "Some test body text"}) is False
    assert determine_is_body_url({"text": "Text body and url", "url": "https://url.com"}) is False
    assert determine_is_body_url({"other": "No [url] field returns False"}) is False
    assert determine_is_body_url({}) is False


def test_build_post_body_both_url_and_test() -> None:
    assert "My text" in build_post_body({"text": "My text", "url": "https://test.com"})
    assert "https://test.com" in build_post_body({"text": "My text", "url": "https://test.com"})


def test_build_post_body_when_only_url() -> None:
    assert build_post_body({"url": "https://test.com"}) == "https://test.com"
    assert build_post_body({"url": "https://test.com", "other": 343}) == "https://test.com"


def test_build_post_body_when_only_text() -> None:
    assert build_post_body({"text": "My text"}) == "My text"
    assert build_post_body({"text": "My text", "other": 343}) == "My text"


def test_build_post_body_when_no_text_or_body() -> None:
    assert build_post_body({"text": ""}) == ""
    assert build_post_body({"text": "", "body": ""}) == ""
    assert build_post_body({"body": ""}) == ""
    assert build_post_body({"other": 343}) == ""
    assert build_post_body({}) == ""


def test_build_source_url() -> None:
    assert build_source_url({"id": 123}) == "https://news.ycombinator.com/item?id=123"
    assert build_source_url({}) == "https://news.ycombinator.com"


def test_build_post_like_item(hackernews_json_res: dict) -> None:
    basic_result: dict[str, Any] = {
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
    assert build_post_like_item(hackernews_json_res) == basic_result
    assert build_post_like_item({**hackernews_json_res, "deleted": True}) == {
        **basic_result,
        "deleted": True,
    }
    assert build_post_like_item({**hackernews_json_res, "dead": False}) == {
        **basic_result,
        "dead": False,
    }
    assert build_post_like_item({**hackernews_json_res, "dead": False, "deleted": True}) == {
        **basic_result,
        "dead": False,
        "deleted": True,
    }


def test_build_comment_item(hackernews_comment_json_res: dict) -> None:
    basic_result: dict[str, Any] = {
        "id": 2921983,
        "author": "norvig",
        "body": "Test text",
        "is_submitter": False,
        "upvotes": None,
        "created_utc": 1314211127,
        "permalink": "https://news.ycombinator.com/item?id=2921983",
    }
    assert build_comment_item(hackernews_comment_json_res) == basic_result
    assert build_comment_item({**hackernews_comment_json_res, "deleted": True}) == {
        **basic_result,
        "deleted": True,
    }
    assert build_comment_item({**hackernews_comment_json_res, "dead": False}) == {
        **basic_result,
        "dead": False,
    }
    assert build_comment_item({**hackernews_comment_json_res, "dead": False, "deleted": True}) == {
        **basic_result,
        "dead": False,
        "deleted": True,
    }
