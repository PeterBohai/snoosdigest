from rest_framework import serializers


class RedditPostSerializer(serializers.Serializer):
    id = serializers.CharField()
    title = serializers.CharField()
    upvotes = serializers.IntegerField(source='score')
    upvote_ratio = serializers.FloatField(min_value=0.0)
    num_comments = serializers.IntegerField()
    url = serializers.URLField()
    body = serializers.CharField(source='selftext')
    created_utc = serializers.FloatField()
