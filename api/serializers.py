from typing import Union

from django.db import Error as DbError
from django.utils import timezone
from praw.models import Submission
from rest_framework import serializers

from api import utils
from api.models import Subreddit, SubredditPost


class RedditPostPreviewSerializer(serializers.Serializer):
    reddit_id = serializers.CharField(source="id")
    title = serializers.CharField()
    author_name = serializers.CharField(source="author.name", default="nullReferenceError")
    upvotes = serializers.IntegerField(source="score")
    upvote_ratio = serializers.FloatField(min_value=0.0)
    num_comments = serializers.IntegerField()
    reddit_url = serializers.URLField(
        source="shortlink"
    )  # 'shortlink' is always the post's link, 'url' might be image link
    img_url = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()
    body = serializers.SerializerMethodField()
    body_url = serializers.SerializerMethodField()
    permalink = serializers.SerializerMethodField()
    created_utc = serializers.FloatField()
    over_18 = serializers.BooleanField(allow_null=True)
    spoiler = serializers.BooleanField(allow_null=True)

    def get_permalink(self, obj: Submission) -> str:
        return utils.generate_full_reddit_link(obj.permalink)

    def _extract_body_text_or_url(self, obj: Submission, body_text: str) -> str:
        if body_text:
            return utils.normalize_text_content(body_text)
        # Check if body is just a http link
        permalink: str = self.get_permalink(obj)
        if obj.id_from_url(permalink) != obj.id:
            # Link is another reddit post
            return utils.normalize_text_content(permalink)
        if hasattr(obj, "url_overridden_by_dest"):
            # Link is a non-reddit article
            return utils.normalize_text_content(obj.url_overridden_by_dest)
        if hasattr(obj, "crosspost_parent_list"):
            # Check if body is a cross-post (links to another reddit post in the post body)
            crosspost_id: str = obj.crosspost_parent_list[0].get("id", "")
            crosspost_link = utils.generate_reddit_link_from_id(crosspost_id)
            return utils.normalize_text_content(crosspost_link)
        return ""

    def get_body(self, obj: Submission) -> str:
        return self._extract_body_text_or_url(obj, obj.selftext or "")

    def get_body_url(self, obj: Submission) -> str:
        body: str = obj.selftext or ""
        if body:
            return ""
        return self._extract_body_text_or_url(obj, body)

    def get_img_url(self, obj: Submission) -> str:
        if "i.redd.it" in obj.url:
            return obj.url
        return ""

    def get_video_url(self, obj: Submission) -> str:
        if "v.redd.it" in obj.url and obj.media.get("reddit_video"):
            return obj.media["reddit_video"].get("fallback_url", "")
        return ""


class RedditPostSerializer(RedditPostPreviewSerializer):
    comments = serializers.SerializerMethodField()

    def get_comments(self, obj: Submission) -> list[dict[str, Union[str, int]]]:
        obj.comments.replace_more(limit=0)
        comments: list[dict[str, Union[str, int]]] = []
        for comment in obj.comments:
            # If the comment or author's account is deleted, comment will be removed - Skip
            if not comment.author:
                continue

            comments.append(
                {
                    "id": comment.id,
                    "author": comment.author.name,
                    "body": utils.normalize_text_content(comment.body),
                    "is_submitter": comment.is_submitter,
                    "upvotes": comment.score,
                    "created_utc": comment.created_utc,
                    "permalink": f"https://reddit.com{comment.permalink}",
                }
            )
        return comments


class SubredditPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubredditPost
        fields = "__all__"

    def create(self, validated_data: dict) -> SubredditPost:
        """
        Create and return a new `SubredditPost` instance, given the validated data.
        """
        validated_data["data_updated_timestamp_utc"] = timezone.now()
        try:
            return SubredditPost.objects.create(**validated_data)
        except DbError as err:
            print(f"DB ERROR - {err}")
            return SubredditPost.objects.get(
                reddit_id=validated_data.get("reddit_id"),
                top_day_order=validated_data.get("top_day_order"),
            )


class SubredditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subreddit
        fields = [
            "display_name",
        ]
