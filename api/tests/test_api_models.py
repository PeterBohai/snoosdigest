import pytest

from api.models import Subreddit, SubredditPost

pytestmark = pytest.mark.django_db


class TestSubreddit:
    def test_count(self) -> None:
        assert type(Subreddit.objects.count()) is int

    def test_display_name_max_length(self) -> None:
        subreddit_example = Subreddit.objects.get(reddit_id='2qh3l')
        assert subreddit_example._meta.get_field('display_name').max_length == 128


class TestSubredditPost:
    def test_count(self) -> None:
        assert type(SubredditPost.objects.count()) is int

    def test_title_max_length(self) -> None:
        subreddit_post_example = SubredditPost.objects.all().first()
        assert subreddit_post_example._meta.get_field('title').max_length == 300
