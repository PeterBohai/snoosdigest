"""This module contains utility functions that help abstract actions and promote DRY."""
from typing import Any

import requests
from requests import JSONDecodeError
from rest_framework import status
from rest_framework.exceptions import APIException

from .configs import API_BASE_URL


def get_item_details(item_id: int) -> dict[str, Any]:
    """Returns the specified item's details as a dictionary. Can raise APIException."""
    item = requests.get(f"{API_BASE_URL}/item/{item_id}.json")
    if item.status_code != status.HTTP_200_OK:
        raise APIException(f"HN API returned {item.status_code} status for item_id={item_id}")

    try:
        return item.json()
    except JSONDecodeError:
        raise APIException("Found invalid JSON when parsing item from HN API response")
