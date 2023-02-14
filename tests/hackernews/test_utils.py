from unittest.mock import Mock, patch

import pytest
from rest_framework.exceptions import APIException

from hackernews.utils import get_item_details


def test_get_item_details_returns_correct_data() -> None:
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
    with patch("requests.get") as mock_get:
        mock_get.return_value = Mock(status_code=500)
        with pytest.raises(APIException) as err:
            get_item_details(8863)
        assert str(8863) in str(err.value)
        assert f"{500} status" in str(err.value)
