from django.db import models


class Subreddit(models.Model):
    subreddit_id = models.AutoField(primary_key=True)
    reddit_id = models.CharField(max_length=16, unique=True)
    display_name = models.CharField(max_length=128, unique=True)
    display_name_prefixed = models.CharField(max_length=128, unique=True)
    reddit_url_path = models.CharField(max_length=128, unique=True)
    subscribers = models.PositiveIntegerField(null=True)
    created_date_utc = models.DateField(null=True)
    created_unix_timestamp = models.PositiveBigIntegerField(null=True)
    data_updated_timestamp_utc = models.DateTimeField()
    update_source = models.CharField(max_length=32, null=True, blank=True)

    class Meta:
        db_table = 'subreddit'

    def __str__(self) -> str:
        return f'Subreddit [{self.subreddit_id}]: {self.display_name_prefixed}'


class SubredditPost(models.Model):
    subreddit_post_id = models.AutoField(primary_key=True)
    subreddit = models.ForeignKey(Subreddit, on_delete=models.CASCADE)
    reddit_id = models.CharField(max_length=16)
    reddit_url = models.CharField(max_length=256)
    top_day_order = models.PositiveSmallIntegerField(null=True)
    top_week_order = models.PositiveSmallIntegerField(null=True)
    top_month_order = models.PositiveSmallIntegerField(null=True)
    top_year_order = models.PositiveSmallIntegerField(null=True)
    top_all_order = models.PositiveSmallIntegerField(null=True)
    title = models.CharField(max_length=300)
    body = models.TextField(null=True, blank=True)
    author_name = models.CharField(max_length=64)
    upvotes = models.IntegerField()
    upvote_ratio = models.FloatField(null=True)
    num_comments = models.PositiveIntegerField()
    img_url = models.CharField(max_length=256, null=True, blank=True)
    video_url = models.CharField(max_length=256, null=True, blank=True)
    over_18 = models.BooleanField(null=True)
    spoiler = models.BooleanField(null=True)
    created_timestamp_utc = models.DateTimeField()
    created_unix_timestamp = models.PositiveBigIntegerField()
    data_updated_timestamp_utc = models.DateTimeField()
    update_source = models.CharField(max_length=32, null=True, blank=True)

    class Meta:
        db_table = 'subreddit_post'
        constraints = [
            models.UniqueConstraint(
                fields=['subreddit', 'reddit_id', 'top_day_order'],
                name='Unique subreddit day posts',
            )
        ]
