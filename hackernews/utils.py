"""This module contains utility functions that help abstract actions and promote DRY."""
import asyncio
import logging
import time
from typing import Any

import aiohttp
import requests
from asyncache import cached as async_cached
from cachetools import TTLCache, cached
from django.conf import settings
from requests import JSONDecodeError
from rest_framework import status
from rest_framework.exceptions import APIException

from .configs import API_BASE_URL, APP_NAME, MAX_COMMENTS

logger = logging.getLogger(__name__)


@cached(cache=TTLCache(maxsize=500, ttl=20))
def get_item_details(item_id: int) -> dict[str, Any]:
    """Returns the specified item's details as a dictionary. Can raise APIException."""
    item = requests.get(f"{API_BASE_URL}/item/{item_id}.json")
    if item.status_code != status.HTTP_200_OK:
        raise APIException(f"HN API returned {item.status_code} status for item_id={item_id}")

    try:
        return item.json()
    except JSONDecodeError:
        raise APIException("Found invalid JSON when parsing item from HN API response")


@async_cached(cache=TTLCache(maxsize=500, ttl=20))
async def async_get_item_details(item_id: int) -> dict[str, Any]:
    """Returns the specified item's details as a dictionary. Can raise APIException."""
    async with aiohttp.ClientSession() as session:
        async with session.get(f"{API_BASE_URL}/item/{item_id}.json") as item_response:
            if item_response.status != status.HTTP_200_OK:
                raise APIException(
                    f"HN API returned {item_response.status} status for item_id={item_id}"
                )
            try:
                item = await item_response.json()
                return item
            except Exception as err:
                raise APIException(f"Error when parsing item from HN API response - {err}")


async def get_post_details_from_ids(post_ids: list[int]) -> list[dict]:
    """Given a list of post ids, return their post details as a list."""
    start_benchmark = time.time()
    try:
        post_details = await asyncio.gather(
            *[async_get_item_details(post_id) for post_id in post_ids]
        )
        normalized_post_details = [
            build_post_like_item(post_detail) for post_detail in post_details
        ]
        logger.info(f"{time.time() - start_benchmark:.3f}s to finish querying all post details")
        return normalized_post_details
    except RuntimeError as err:
        logger.error(f"Async RuntimeError: {err}")
    return []


def determine_is_body_url(item: dict[str, Any]) -> bool:
    if item.get("text") or not item.get("url"):
        return False
    return True


def build_post_body(item: dict[str, Any]) -> str:
    """Returns a formatted body string for post-like Hacker News items."""
    url = item.get("url")
    text = item.get("text")
    if url and text:
        return f"{url} <br>{text}"
    if url:
        return url
    if text:
        return text
    return ""


def build_source_url(item: dict[str, Any]) -> str:
    """Returns the specified item's link on the actual Hacker News website."""
    url_base = "https://news.ycombinator.com"
    if not (item_id := item.get("id")):
        return url_base
    return f"{url_base}/item?id={item_id}"


def build_post_like_item(item: dict[str, Any]) -> dict:
    post = {
        f"{settings.NAMESPACE}_app": APP_NAME,
        "hackernews_id": item.get("id"),
        "title": item.get("title", ""),
        "author_name": item.get("by", ""),
        "upvotes": item.get("score", ""),
        "num_comments": item.get("descendants"),
        "body": build_post_body(item),
        "body_url": build_post_body(item) if determine_is_body_url(item) else "",
        "hackernews_url": build_source_url(item),
        "created_utc": item.get("time"),
        "comments": item.get("kids", [])[:MAX_COMMENTS],
        "type": item.get("type"),
    }
    if "deleted" in item:
        post["deleted"] = item.get("deleted")
    if "dead" in item:
        post["dead"] = item.get("dead")
    return post


def build_comment_item(item: dict[str, Any]) -> dict:
    comment = {
        "id": item.get("id"),
        "author": item.get("by", ""),
        "body": item.get("text", ""),
        "is_submitter": False,
        "upvotes": None,
        "created_utc": item.get("time"),
        "permalink": build_source_url(item),
    }
    if "deleted" in item:
        comment["deleted"] = item.get("deleted")
    if "dead" in item:
        comment["dead"] = item.get("dead")
    return comment
