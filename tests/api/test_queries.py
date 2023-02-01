from datetime import datetime
from unittest.mock import Mock

import pytest
from django.utils import timezone
from praw import reddit as PrawReddit
from praw.models import Submission as PrawSubmission
from praw.models import Subreddit as PrawSubreddit

from api.models import Subreddit
from api.queries import (
    get_subreddit,
    get_subreddit_prefixed_name_of_post,
    insert_subreddit_data,
    update_subreddit_last_viewed,
)
from api.serializers import RedditPostPreviewSerializer, SubredditPostSerializer


@pytest.mark.django_db
def test_insert_subreddit_data_saves_unique_subreddit_to_db() -> None:
    fake_subreddit: PrawSubreddit = Mock(
        id="2qh3l",
        display_name="news",
        display_name_prefixed="r/news",
        url="/r/news/",
        subscribers=25201892,
        created_utc=1201243765,
    )
    inserted_subreddit = insert_subreddit_data(fake_subreddit)
    try:
        get_subreddit = Subreddit.objects.get(reddit_id=inserted_subreddit.reddit_id)
    except Subreddit.DoesNotExist as err:
        pytest.fail(f"Subreddit <{fake_subreddit.display_name}> did not insert into DB - {err}")
    except Subreddit.MultipleObjectsReturned as err:
        pytest.fail(f"Inserted existing subreddit <{fake_subreddit.display_name}> into DB - {err}")

    assert get_subreddit.subreddit_id == 1
    assert get_subreddit.reddit_id == inserted_subreddit.reddit_id
    assert get_subreddit.display_name == inserted_subreddit.display_name
    assert get_subreddit.display_name_prefixed == inserted_subreddit.display_name_prefixed
    assert get_subreddit.reddit_url_path == inserted_subreddit.reddit_url_path
    assert get_subreddit.subscribers == inserted_subreddit.subscribers
    assert get_subreddit.created_date_utc == inserted_subreddit.created_date_utc


@pytest.mark.django_db
def test_insert_subreddit_data_returns_existing_row_if_duplicate_insert() -> None:
    fake_subreddit: PrawSubreddit = Mock(
        id="2qh3l",
        display_name="news",
        display_name_prefixed="r/news",
        url="/r/news/",
        subscribers=25201892,
        created_utc=1201243765,
    )
    duplicate_subreddit: PrawSubreddit = Mock(
        id="2qh3l",
        display_name="news",
        display_name_prefixed="r/news",
        url="/r/news/",
        subscribers=67,
        created_utc=23,
    )

    inserted_subreddit = insert_subreddit_data(fake_subreddit)
    assert Subreddit.objects.count() == 1

    inserted_subreddit_dupe = insert_subreddit_data(duplicate_subreddit)
    assert Subreddit.objects.count() == 1
    assert inserted_subreddit_dupe.subreddit_id == inserted_subreddit.subreddit_id


@pytest.mark.django_db
def test_get_subreddit_existing_subreddit_returns_without_inserting() -> None:
    fake_subreddit: PrawSubreddit = Mock(
        id="2shb7",
        display_name="Bogleheads",
        display_name_prefixed="r/Bogleheads",
        url="/r/Bogleheads/",
        subscribers=3520189,
        created_utc=1201245765,
    )
    inserted_subreddit = insert_subreddit_data(fake_subreddit)

    # Try with praw_subreddit set
    result_subreddit = get_subreddit(inserted_subreddit.display_name, praw_subreddit=fake_subreddit)
    assert not fake_subreddit.called
    assert inserted_subreddit.reddit_id == result_subreddit.reddit_id
    assert inserted_subreddit.display_name == result_subreddit.display_name
    assert Subreddit.objects.count() == 1

    # Try with praw_reddit set
    fake_reddit: PrawReddit = Mock()
    result_subreddit = get_subreddit(inserted_subreddit.display_name, praw_reddit=fake_reddit)
    assert not fake_reddit.called
    assert inserted_subreddit.reddit_id == result_subreddit.reddit_id
    assert inserted_subreddit.display_name == result_subreddit.display_name
    assert Subreddit.objects.count() == 1


@pytest.mark.django_db
def test_get_non_existent_subreddit_with_praw_subreddit_inserts_and_returns() -> None:
    fake_subreddit: PrawSubreddit = Mock(
        id="2shb7",
        display_name="Bogleheads",
        display_name_prefixed="r/Bogleheads",
        url="/r/Bogleheads/",
        subscribers=3520189,
        created_utc=1201245765,
        created=1201245765,
    )
    assert Subreddit.objects.count() == 0

    result_subreddit = get_subreddit(fake_subreddit.display_name, praw_subreddit=fake_subreddit)
    query_subreddit = Subreddit.objects.get(reddit_id=fake_subreddit.id)
    assert Subreddit.objects.count() == 1
    assert result_subreddit.reddit_id == query_subreddit.reddit_id
    assert query_subreddit.display_name == query_subreddit.display_name


@pytest.mark.django_db
def test_get_non_existent_subreddit_with_praw_reddit_inserts_and_returns() -> None:
    fake_subreddit: PrawSubreddit = Mock(
        id="2shb7",
        display_name="Bogleheads",
        display_name_prefixed="r/Bogleheads",
        url="/r/Bogleheads/",
        subscribers=3520189,
        created_utc=1201245765,
        created=1201245765,
    )
    fake_reddit: PrawReddit = Mock()
    fake_reddit.subreddits.search_by_name.return_value = [fake_subreddit]

    assert Subreddit.objects.count() == 0

    result_subreddit = get_subreddit(fake_subreddit.display_name, praw_reddit=fake_reddit)
    query_subreddit = Subreddit.objects.get(reddit_id=fake_subreddit.id)
    assert Subreddit.objects.count() == 1
    assert result_subreddit.reddit_id == query_subreddit.reddit_id
    assert query_subreddit.display_name == query_subreddit.display_name


@pytest.mark.django_db
def test_get_subreddit_invalid_argument() -> None:
    with pytest.raises(ValueError):
        get_subreddit("news")


@pytest.mark.django_db
def test_update_subreddit_last_viewed_updates_valid_subreddit_name() -> None:
    fake_subreddit: PrawSubreddit = Mock(
        id="2qh3l",
        display_name="news",
        display_name_prefixed="r/news",
        url="/r/news/",
        subscribers=25201892,
        created_utc=1201243765,
    )

    inserted_subreddit = insert_subreddit_data(fake_subreddit)
    assert inserted_subreddit.last_viewed_timestamp is None

    update_subreddit_last_viewed(inserted_subreddit.display_name)
    updated_subreddit = Subreddit.objects.get(display_name=inserted_subreddit.display_name)
    assert isinstance(updated_subreddit.last_viewed_timestamp, datetime)


@pytest.mark.django_db
def test_update_subreddit_last_viewed_does_nothing_for_invalid_subreddit_name() -> None:
    try:
        update_subreddit_last_viewed("nonExistentSubreddit")
    except Subreddit.DoesNotExist:
        pytest.fail("DoesNotExist exception should not be raised for invalid subreddit")
    except Subreddit.MultipleObjectsReturned:
        pytest.fail("MultipleObjectsReturned exception should not be raised for invalid subreddit")


@pytest.mark.django_db
def test_get_subreddit_prefixed_name_of_post_retrieves_from_db_if_exists() -> None:
    insert_subreddit_data(
        Mock(
            id="2qh3l",
            display_name="news",
            display_name_prefixed="r/news",
            url="/r/news/",
            subscribers=25201892,
            created_utc=1201243765,
        )
    )
    fake_post: PrawSubmission = Mock(
        id="10qwavm",
        title="A Test Title for this Post",
        score=67,
        author=Mock(name="fake-author"),
        upvote_ratio=97.6,
        num_comments=134,
        shortlink="some-url-string",
        selftext="Example body text",
        permalink="some-permalink",
        created_utc=1201243765,
        url="",
    )
    serializer = SubredditPostSerializer(
        data={
            **RedditPostPreviewSerializer(fake_post).data,
            "top_day_order": 1,
            "subreddit": 1,
            "update_source": "test",
            "created_unix_timestamp": fake_post.created_utc,
            "created_timestamp_utc": datetime.fromtimestamp(fake_post.created_utc),
            "data_updated_timestamp_utc": timezone.now(),
        }
    )
    serializer.is_valid()
    serializer.save()
    assert "r/news" == get_subreddit_prefixed_name_of_post(fake_post.id, praw_post=fake_post)


@pytest.mark.django_db
def test_get_subreddit_prefixed_name_of_post_returns_empty_if_not_exist_and_no_praw_post() -> None:
    assert "" == get_subreddit_prefixed_name_of_post("someid")


@pytest.mark.django_db
def test_get_subreddit_prefixed_name_of_post_returns_if_not_exist_with_praw_post_set() -> None:
    fake_post: PrawSubmission = Mock(
        id="10qwavm",
        subreddit=Mock(display_name_prefixed="r/test"),
    )
    assert "r/test" == get_subreddit_prefixed_name_of_post(fake_post.id, praw_post=fake_post)
