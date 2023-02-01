from unittest.mock import Mock

import pytest
from praw import reddit as PrawReddit
from praw.models import Subreddit as PrawSubreddit

from api.models import Subreddit
from api.queries import get_subreddit, insert_subreddit_data


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
