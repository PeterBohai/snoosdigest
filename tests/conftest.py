from datetime import date, datetime, timezone
from typing import Any, Union

import pytest

from api.models import Subreddit, SubredditPost


@pytest.fixture
def valid_subreddit() -> Subreddit:
    name = "TestSubredditName"
    create_time_stamp = 1229740515
    return Subreddit(
        reddit_id="2test",
        display_name=name,
        display_name_prefixed=f"r/{name}",
        reddit_url_path=f"/r/{name}",
        subscribers=3214332,
        created_date_utc=date.fromtimestamp(create_time_stamp),
        created_unix_timestamp=create_time_stamp,
        data_updated_timestamp_utc=datetime(2018, 8, 25, 23, 9, 19, tzinfo=timezone.utc),
        update_source="test-snoosdigest",
        last_viewed_timestamp=datetime(2022, 8, 8, 23, 9, 20, tzinfo=timezone.utc),
    )


@pytest.fixture
def valid_subreddit_post(valid_subreddit: Subreddit) -> SubredditPost:
    valid_subreddit.save()
    reddit_id = "10mtest"
    created_timestamp = 1674845320
    return SubredditPost(
        subreddit=valid_subreddit,
        reddit_id=reddit_id,
        reddit_url=f"https://redd.it/{reddit_id}",
        top_day_order=3,
        title="Test Title",
        body="Some test text to pretend this is a real post.",
        author_name="coolTester",
        upvotes=878,
        upvote_ratio=0.97,
        num_comments=234,
        spoiler=True,
        created_timestamp_utc=datetime.fromtimestamp(created_timestamp, tz=timezone.utc),
        created_unix_timestamp=created_timestamp,
        data_updated_timestamp_utc=datetime(2023, 1, 28, 11, 37, 24, tzinfo=timezone.utc),
        update_source="test-snoosdigest",
    )


@pytest.fixture
def valid_user_data() -> dict[str, Union[str, bool]]:
    user_email = "john.doe@email.com"
    return {
        "first_name": "John",
        "last_name": "Doe",
        "username": user_email,
        "email": user_email,
        "password": "very-secret-password",
        "dark_mode": True,
    }


@pytest.fixture
def hackernews_json_res() -> dict[str, Any]:
    return {
        "by": "dhouston",
        "descendants": 71,
        "id": 8863,
        "kids": [9224, 8917],
        "score": 104,
        "time": 1175714200,
        "title": "My YC app: Dropbox - Throw away your USB drive",
        "type": "story",
        "url": "http://www.getdropbox.com/u/2/screencast.html",
    }
