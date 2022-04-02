from rest_framework import serializers


class RedditPostPreviewSerializer(serializers.Serializer):
    id = serializers.CharField()
    title = serializers.CharField()
    upvotes = serializers.IntegerField(source='score')
    upvote_ratio = serializers.FloatField(min_value=0.0)
    num_comments = serializers.IntegerField()
    url = serializers.URLField()
    body = serializers.CharField(source='selftext')
    permalink = serializers.SerializerMethodField()
    created_utc = serializers.FloatField()

    def get_permalink(self, obj):
        return f'reddit.com{obj.permalink}'


class RedditPostSerializer(RedditPostPreviewSerializer):
    comments = serializers.SerializerMethodField()

    def get_comments(self, obj):
        obj.comments.replace_more(limit=2)
        comments = []
        for comment in obj.comments:
            comments.append({
                'id': comment.id,
                'author': comment.author.name,
                'body': comment.body,
                'is_submitter': comment.is_submitter,
                'score': comment.score,
                'created_utc': comment.created_utc
            })
        return comments
