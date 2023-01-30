from datetime import date, datetime

import prawcore
from cachetools import LRUCache, cached
from django.db import IntegrityError
from django.db.models.query import QuerySet
from django.utils import timezone
from praw import Reddit as PrawReddit
from praw.models import Submission as PrawSubmission
from praw.models import Subreddit as PrawSubreddit

from api.consts import MAX_NUM_POSTS_PER_SUBREDDIT
from api.models import Subreddit, SubredditPost
from api.serializers import RedditPostPreviewSerializer, SubredditPostSerializer

UPDATE_SOURCE = "django-snoosdigest"


def insert_subreddit_data(subreddit: PrawSubreddit) -> Subreddit:
    created_unix_timestamp = int(subreddit.created_utc)
    try:
        new_subreddit = Subreddit(
            reddit_id=subreddit.id,
            display_name=subreddit.display_name,
            display_name_prefixed=subreddit.display_name_prefixed,
            reddit_url_path=subreddit.url,
            subscribers=subreddit.subscribers,
            created_date_utc=date.fromtimestamp(created_unix_timestamp),
            created_unix_timestamp=created_unix_timestamp,
            data_updated_timestamp_utc=timezone.now(),
            update_source=UPDATE_SOURCE,
        )
        new_subreddit.save()
    except IntegrityError as err:
        print(f"Django DB IntegrityError: {err}")
        return Subreddit.objects.get(reddit_id=subreddit.id, display_name=subreddit.display_name)
    return new_subreddit


def update_or_insert_subreddit_posts(
    query_result: QuerySet, praw_subreddit: PrawSubreddit, time_filter: str
) -> list[dict]:

    top_posts: list[PrawSubmission] = list(
        praw_subreddit.top(time_filter, limit=MAX_NUM_POSTS_PER_SUBREDDIT)
    )
    if len(top_posts) < MAX_NUM_POSTS_PER_SUBREDDIT:
        top_posts = list(praw_subreddit.hot(limit=MAX_NUM_POSTS_PER_SUBREDDIT))

    try:
        subreddit_data = Subreddit.objects.filter(reddit_id=praw_subreddit.id).get()
    except Subreddit.DoesNotExist:
        print(
            f"<{praw_subreddit.display_name}> does not exist in Subreddit table, "
            f"inserting subreddit..."
        )
        subreddit_data = insert_subreddit_data(praw_subreddit)
    except Subreddit.MultipleObjectsReturned:
        print(f"Multiple Subreddit (reddit_id={praw_subreddit.id})rows found in database...")
        raise Subreddit.MultipleObjectsReturned

    # Add post order and subreddit relation to serialized praw data
    praw_serialized_data = []
    for i, post in enumerate(top_posts, 1):
        serialized_post = RedditPostPreviewSerializer(post).data
        serialized_post[f"top_{time_filter}_order"] = i
        serialized_post["subreddit"] = subreddit_data.subreddit_id
        if serialized_post.get("created_utc"):
            created_unix_timestamp = int(serialized_post["created_utc"])
            serialized_post["created_unix_timestamp"] = created_unix_timestamp
            serialized_post["created_timestamp_utc"] = datetime.fromtimestamp(
                created_unix_timestamp
            )
        serialized_post["data_updated_timestamp_utc"] = timezone.now()
        serialized_post["update_source"] = UPDATE_SOURCE

        praw_serialized_data.append(serialized_post)

    if query_result:
        query_result.delete()
    serializer = SubredditPostSerializer(data=praw_serialized_data, many=True)

    if not serializer.is_valid():
        print(serializer.errors)
        raise ValueError(f"serializer.is_valid(): {serializer.is_valid()}")

    serializer.save()
    return serializer.data


def get_subreddit(subreddit_display_name: str, praw_reddit: PrawReddit) -> Subreddit:
    # Look for the subreddit in the DB
    try:
        subreddit: Subreddit = Subreddit.objects.get(
            display_name__iexact=subreddit_display_name.lower()
        )

    except Subreddit.DoesNotExist:
        # If it does not exist in the DB, query reddit API
        try:
            matched_subreddits: list[PrawSubreddit] = praw_reddit.subreddits.search_by_name(
                subreddit_display_name.lower(), exact=True
            )
            if len(matched_subreddits) != 1:
                raise ValueError("Multiple potential subreddits found, please be more specific")

            praw_subreddit: PrawSubreddit = matched_subreddits[0]
            # If it does not event exist in reddit API, return error response
            if not hasattr(praw_subreddit, "id") or not hasattr(praw_subreddit, "created"):
                print(f'{praw_subreddit} does not have "id" or "created" attributes')
                raise ValueError(
                    f'"{subreddit_display_name}" is not a valid subreddit, please try again'
                )

        except prawcore.NotFound as err:
            print(f"prawcore.NotFound Exception: {err}")
            raise ValueError(
                f'"{subreddit_display_name}" is not a valid subreddit, please try again'
            )

        # Store the "new" valid subreddit in the DB
        subreddit = insert_subreddit_data(praw_subreddit)

    return subreddit


def update_subreddit_last_viewed(display_name: str) -> None:
    print(f"Updating <{display_name}> last_viewed_timestamp")
    subreddit: Subreddit = Subreddit.objects.get(display_name__iexact=display_name)
    subreddit.last_viewed_timestamp = timezone.now()
    subreddit.save()


@cached(cache=LRUCache(maxsize=128))
def get_post_subreddit_display_name(post_reddit_id: str) -> str:
    try:
        print("get_post_subreddit_display_name", post_reddit_id)
        return SubredditPost.objects.get(reddit_id=post_reddit_id).subreddit.display_name_prefixed
    except (SubredditPost.DoesNotExist, SubredditPost.MultipleObjectsReturned) as err:
        print(f"get_post_subreddit_display_name: {err}")
        return ""
