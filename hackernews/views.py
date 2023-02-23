"""This module contains view classes and functions for retrieving Hacker News content.

More info about their API can be found at https://github.com/HackerNews/API
"""
import logging

import requests
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from requests import Response
from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.request import Request
from rest_framework.response import Response as DrfResponse
from rest_framework.views import APIView

from .configs import API_BASE_URL, MAX_POSTS, SORT_TYPES
from .utils import (
    build_comment_item,
    build_post_like_item,
    get_item_details,
    get_post_details_from_ids,
)

logger = logging.getLogger(__name__)


class PostList(APIView):
    """Lists posts (stories) of a specific sort type.

    Supported types are described in config.SORT_TYPES
    """

    @method_decorator(cache_page(10 * 60))
    def get(self, request: Request) -> DrfResponse:
        """Returns a lists o posts under the specified `sort_type`.

        Example request: GET /api/hackernews/posts/best.
        """
        try:
            sort_type: str = request.query_params["sort_type"].strip().lower()
        except KeyError:
            return DrfResponse(
                "sort_type is a required parameter", status=status.HTTP_400_BAD_REQUEST
            )
        if sort_type not in SORT_TYPES:
            return DrfResponse(
                f"{sort_type} is not supported. Try these: {', '.join(SORT_TYPES)}",
                status=status.HTTP_400_BAD_REQUEST,
            )

        res: Response = requests.get(f"{API_BASE_URL}/{sort_type}stories.json")
        post_ids: list[int] = res.json()[:MAX_POSTS]
        return DrfResponse(get_post_details_from_ids(post_ids))


class PostDetail(APIView):
    """Retrieve a single HackerNews post-like item"""

    @method_decorator(cache_page(5 * 60))
    def get(self, request: Request, post_id: int) -> Response:
        """Returns a single post-like instance.

        Example GET request: /api/hackernews/posts/<post_id>
        """
        try:
            item = get_item_details(post_id)
            if item.get("type") in ("comment", "poll"):  # Add support for polls later
                return DrfResponse(
                    f"id={post_id} is not a post-like item", status=status.HTTP_400_BAD_REQUEST
                )
            return DrfResponse(build_post_like_item(item))
        except APIException as err:
            return DrfResponse(
                f"APIException occurred. Skipped post - {err}",
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CommentDetail(APIView):
    """Retrieve a single HackerNews comment item"""

    @method_decorator(cache_page(30 * 60))
    def get(self, request: Request, comment_id: int) -> Response:
        """Returns a single comment item instance.

        Example GET request: /api/hackernews/comments/<comment_id>
        """
        try:
            item = get_item_details(comment_id)
            if item.get("type") != "comment":  # Add support for polls later
                return DrfResponse(
                    f"id={comment_id} is not a comment item", status=status.HTTP_400_BAD_REQUEST
                )
            return DrfResponse(build_comment_item(item))
        except APIException as err:
            return DrfResponse(
                f"APIException occurred. Skipped comment - {err}",
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
