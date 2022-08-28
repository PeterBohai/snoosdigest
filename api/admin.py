from django.contrib import admin

from .models import Subreddit, SubredditPost


@admin.register(Subreddit)
class SubredditAdmin(admin.ModelAdmin):
    list_display = (
        'subreddit_id',
        'reddit_id',
        'display_name',
        'subscribers',
        'data_updated_timestamp_utc',
        'last_viewed_timestamp',
        'update_source',
        'inserted_at',
    )


@admin.register(SubredditPost)
class SubredditPostAdmin(admin.ModelAdmin):
    list_display = (
        'subreddit_post_id',
        'subreddit',
        'reddit_id',
        'top_day_order',
        'author_name',
        'title',
        'data_updated_timestamp_utc',
        'update_source',
    )
