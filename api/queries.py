from datetime import date, datetime
from typing import Optional

import prawcore
from cachetools import LRUCache, cached
from django.db import IntegrityError, transaction
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
        with transaction.atomic():
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
        print(f"Django DB IntegrityError. {err} - returning existing row")
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

    # Add post order and subreddit foreign key to serialized praw data
    subreddit_data = get_subreddit(praw_subreddit.display_name, praw_subreddit=praw_subreddit)
    praw_serialized_data = []
    for i, post in enumerate(top_posts, 1):
        serialized_post = RedditPostPreviewSerializer(post).data
        serialized_post[f"top_{time_filter}_order"] = i
        serialized_post["subreddit"] = subreddit_data.subreddit_id
        if serialized_post.get("created_utc"):
            created_unix_time = int(serialized_post["created_utc"])
            serialized_post["created_unix_timestamp"] = created_unix_time
            serialized_post["created_timestamp_utc"] = datetime.fromtimestamp(created_unix_time)
        serialized_post["data_updated_timestamp_utc"] = timezone.now()
        serialized_post["update_source"] = UPDATE_SOURCE
        praw_serialized_data.append(serialized_post)

    if query_result:  # Update by deleting and inserting
        query_result.delete()

    serializer = SubredditPostSerializer(data=praw_serialized_data, many=True)
    if not serializer.is_valid():
        print(serializer.errors)
        raise ValueError(f"serializer.is_valid(): {serializer.is_valid()}")

    serializer.save()
    return serializer.data


def get_subreddit(
    subreddit_display_name: str,
    praw_reddit: Optional[PrawReddit] = None,
    praw_subreddit: Optional[PrawSubreddit] = None,
) -> Subreddit:
    """Returns a database Subreddit object if it exists. If not, insert it first.

    Need to pass in either `praw_reddit` and/or `praw_subreddit`. Cannot pass neither.
    """
    try:
        # Look for the subreddit in the DB first
        subreddit = Subreddit.objects.filter(display_name=subreddit_display_name)
        if praw_subreddit:
            subreddit = subreddit.filter(reddit_id=praw_subreddit.id)
        subreddit = subreddit.get()
    except Subreddit.DoesNotExist:
        # If it does not exist in the DB, query reddit API
        if not praw_subreddit:
            try:
                if not praw_reddit:
                    raise ValueError("Must pass in praw_reddit")
                matched_subreddits: list[PrawSubreddit] = praw_reddit.subreddits.search_by_name(
                    subreddit_display_name.lower(), exact=True
                )
            except prawcore.NotFound as err:
                print(f"prawcore.NotFound Exception: {err}")
                raise ValueError(f"Subreddit <{subreddit_display_name}> does not exist")
            if len(matched_subreddits) > 1:
                raise ValueError("Multiple potential subreddits found, please be more specific")
            praw_subreddit = matched_subreddits[0]

        # PrawSubreddit instance can be invalid in rare cases
        if not hasattr(praw_subreddit, "id") or not hasattr(praw_subreddit, "created"):
            print(f'{praw_subreddit} does not have "id" or "created" attributes')
            raise ValueError(f"Invalid subreddit name <{subreddit_display_name}>")

        # Store the "new" valid subreddit in the DB
        print(f"Subreddit <{subreddit_display_name}> does not exist in database, inserting...")
        subreddit = insert_subreddit_data(praw_subreddit)
    except Subreddit.MultipleObjectsReturned:
        raise Exception(f"Multiple Subreddit <{subreddit_display_name}> found in database")
    return subreddit


def update_subreddit_last_viewed(display_name: str) -> None:
    print(f"Updating <{display_name}> last_viewed_timestamp")
    try:
        subreddit: Subreddit = Subreddit.objects.get(display_name=display_name)
        subreddit.last_viewed_timestamp = timezone.now()
        subreddit.save()
    except Subreddit.DoesNotExist:
        print(f"Could not update last_viewed_timestamp. <{display_name}> does not exist in DB.")
    except Subreddit.MultipleObjectsReturned:
        print(f"Could not update last_viewed_timestamp. Multiple <{display_name}> found in DB.")


@cached(cache=LRUCache(maxsize=128))
def get_subreddit_prefixed_name_of_post(
    post_reddit_id: str, praw_post: Optional[PrawSubmission] = None
) -> str:
    try:
        print("get_post_subreddit_display_name", post_reddit_id)
        return SubredditPost.objects.get(reddit_id=post_reddit_id).subreddit.display_name_prefixed
    except (SubredditPost.DoesNotExist, SubredditPost.MultipleObjectsReturned) as err:
        print(f"get_post_subreddit_display_name: {err}")
    if not praw_post:
        print("Could not retrieve post's subreddit name")
        return ""
    # Only retrieve from reddit API as a last resort due to slow requests
    return praw_post.subreddit.display_name_prefixed
