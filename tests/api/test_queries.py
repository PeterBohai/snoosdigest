from unittest.mock import Mock

import pytest

from api.models import Subreddit
from api.queries import insert_subreddit_data


@pytest.mark.django_db
def test_insert_subreddit_data_saves_unique_subreddit_to_db() -> None:
    fake_subreddit = Mock(
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
    fake_subreddit = Mock(
        id="2qh3l",
        display_name="news",
        display_name_prefixed="r/news",
        url="/r/news/",
        subscribers=25201892,
        created_utc=1201243765,
    )
    duplicate_subreddit = Mock(
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
