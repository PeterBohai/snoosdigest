import pytest

from api.models import Subreddit, SubredditPost

pytestmark = pytest.mark.django_db


class TestSubreddit:
    def test_dunder_str(self, valid_subreddit: Subreddit) -> None:
        valid_subreddit.save()
        assert str(valid_subreddit) == f'Subreddit [1]: {valid_subreddit.display_name_prefixed}'

    def test_meta_db_table_name(self) -> None:
        assert Subreddit._meta.db_table == "subreddit"

    def test_count(self, valid_subreddit: Subreddit) -> None:
        assert SubredditPost.objects.count() == 0
        valid_subreddit.save()
        assert Subreddit.objects.count() == 1

    def test_display_name_max_length(self) -> None:
        assert Subreddit._meta.get_field('display_name').max_length == 128


class TestSubredditPost:
    def test_count(self, valid_subreddit_post: SubredditPost) -> None:
        assert SubredditPost.objects.count() == 0
        valid_subreddit_post.save()
        assert SubredditPost.objects.count() == 1

    def test_meta_db_table_name(self) -> None:
        assert SubredditPost._meta.db_table == "subreddit_post"

    def test_title_max_length(self) -> None:
        assert SubredditPost._meta.get_field('title').max_length == 300
