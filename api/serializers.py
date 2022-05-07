from rest_framework import serializers

from api import utils


class RedditPostPreviewSerializer(serializers.Serializer):
    id = serializers.CharField()
    title = serializers.CharField()
    author = serializers.SerializerMethodField()
    upvotes = serializers.IntegerField(source='score')
    upvote_ratio = serializers.FloatField(min_value=0.0)
    num_comments = serializers.IntegerField()
    url = serializers.URLField(source='shortlink')  # 'shortlink' is always the post's link, 'url' might be image link
    img_url = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()
    body = serializers.SerializerMethodField()
    permalink = serializers.SerializerMethodField()
    created_utc = serializers.FloatField()

    def get_permalink(self, obj):
        return utils.generate_full_reddit_link(obj.permalink)

    def get_author(self, obj):
        return obj.author.name

    def get_body(self, obj):
        body = obj.selftext or ''

        # Check if body is just a http link
        permalink = self.get_permalink(obj)
        if not body:
            if obj.id_from_url(permalink) != obj.id:
                # Link is another reddit post
                body = permalink.end
            elif hasattr(obj, 'url_overridden_by_dest'):
                # Link is a non-reddit article
                body = obj.url_overridden_by_dest

        # Check if body is a cross-post (nests another reddit post directly in the post body)
        if not body and hasattr(obj, 'crosspost_parent_list'):
            crosspost_id = obj.crosspost_parent_list[0].get('id', '')
            body = utils.generate_reddit_link_from_id(crosspost_id)

        return utils.normalize_text_content(body)

    def get_img_url(self, obj):
        if 'i.redd.it' in obj.url:
            return obj.url
        return ''

    def get_video_url(self, obj):
        if 'v.redd.it' in obj.url and obj.media and obj.media.get('reddit_video'):
            return obj.media['reddit_video'].get('fallback_url', '')
        return ''


class RedditPostSerializer(RedditPostPreviewSerializer):
    comments = serializers.SerializerMethodField()

    def get_comments(self, obj):
        obj.comments.replace_more(limit=0)
        comments = []
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
