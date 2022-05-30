from typing import Union

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils import timezone
from django.conf import settings
from django.contrib.auth.models import User
from praw.models import Submission

from api.models import SubredditPost
from api import utils


class RedditPostPreviewSerializer(serializers.Serializer):
    reddit_id = serializers.CharField(source='id')
    title = serializers.CharField()
    author_name = serializers.CharField(source='author.name')
    upvotes = serializers.IntegerField(source='score')
    upvote_ratio = serializers.FloatField(min_value=0.0)
    num_comments = serializers.IntegerField()
    reddit_url = serializers.URLField(source='shortlink')  # 'shortlink' is always the post's link, 'url' might be image link
    img_url = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()
    body = serializers.SerializerMethodField()
    permalink = serializers.SerializerMethodField()
    created_utc = serializers.FloatField()
    over_18 = serializers.BooleanField(allow_null=True)
    spoiler = serializers.BooleanField(allow_null=True)

    def get_permalink(self, obj: Submission) -> str:
        return utils.generate_full_reddit_link(obj.permalink)

    def get_body(self, obj: Submission) -> str:
        body: str = obj.selftext or ''

        # Check if body is just a http link
        permalink: str = self.get_permalink(obj)
        if not body:
            if obj.id_from_url(permalink) != obj.id:
                # Link is another reddit post
                body = permalink
            elif hasattr(obj, 'url_overridden_by_dest'):
                # Link is a non-reddit article
                body = obj.url_overridden_by_dest

        # Check if body is a cross-post (nests another reddit post directly in the post body)
        if not body and hasattr(obj, 'crosspost_parent_list'):
            crosspost_id: str = obj.crosspost_parent_list[0].get('id', '')
            body = utils.generate_reddit_link_from_id(crosspost_id)

        return utils.normalize_text_content(body)

    def get_img_url(self, obj: Submission) -> str:
        if 'i.redd.it' in obj.url:
            return obj.url
        return ''

    def get_video_url(self, obj: Submission) -> str:
        if 'v.redd.it' in obj.url and obj.media.get('reddit_video'):
            return obj.media['reddit_video'].get('fallback_url', '')
        return ''


class RedditPostSerializer(RedditPostPreviewSerializer):
    comments = serializers.SerializerMethodField()

    def get_comments(self, obj: Submission) -> list[dict[str, Union[str, int]]]:
        obj.comments.replace_more(limit=0)
        comments: list[dict[str, Union[str, int]]] = []
        for comment in obj.comments:
            # If the comment or author's account is deleted, comment will be removed - Skip
            if not comment.author:
                continue

            comments.append({
                'id': comment.id,
                'author': comment.author.name,
                'body':  utils.normalize_text_content(comment.body),
                'is_submitter': comment.is_submitter,
                'upvotes': comment.score,
                'created_utc': comment.created_utc
            })
        return comments


class SubredditPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubredditPost
        fields = '__all__'

    def create(self, validated_data):
        """
        Create and return a new `SubredditPost` instance, given the validated data.
        """
        validated_data['data_updated_timestamp_utc'] = timezone.now()
        return SubredditPost.objects.create(**validated_data)


class SnoosDigestTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Custom private claims
        token[f'{settings.NAMESPACE}/username'] = user.username

        return token


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined']
