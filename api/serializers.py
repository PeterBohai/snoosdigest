from rest_framework import serializers


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
        return f'https://www.reddit.com{obj.permalink}'.strip()

    def get_author(self, obj):
        return obj.author.name

    def get_body(self, obj):
        permalink = self.get_permalink(obj)
        permalink_post_id = obj.id_from_url(permalink)
        if not obj.selftext:
            if permalink_post_id == obj.id:
                return ''
            if permalink_post_id != obj.id:
                return permalink
        return obj.selftext.strip()

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
                'body': comment.body.strip(),
                'is_submitter': comment.is_submitter,
                'upvotes': comment.score,
                'created_utc': comment.created_utc
            })
        return comments
