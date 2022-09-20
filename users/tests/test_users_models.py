import pytest
from django.db.models.fields import BooleanField
from django.db.models.fields.related import ForeignKey

from users.models import User, UserSubscription

pytestmark = pytest.mark.django_db


class TestUser:
    def test_count(self) -> None:
        assert type(User.objects.count()) is int

    def test_dark_mode_type_is_boolean(self) -> None:
        user_example = User.objects.latest('id')
        dark_mode_field = user_example._meta.get_field('dark_mode')
        assert isinstance(dark_mode_field, BooleanField)

    def test_no_null_values(self) -> None:
        assert not User.objects.filter(dark_mode__isnull=True).exists()


class TestUserSubscription:
    @pytest.fixture
    def latest_user_subscription(self) -> None:
        return UserSubscription.objects.latest('id')

    def test_count(self) -> None:
        assert type(UserSubscription.objects.count()) is int

    def test_user_is_not_null(self) -> None:
        assert not UserSubscription.objects.filter(user__isnull=True).exists()

    def test_subreddit_is_not_null(self) -> None:
        assert not UserSubscription.objects.filter(subreddit__isnull=True).exists()

    def test_created_at_is_not_null(self) -> None:
        assert not UserSubscription.objects.filter(created_at__isnull=True).exists()

    def test_user_is_foreign_key(self, latest_user_subscription: UserSubscription) -> None:
        user_field = latest_user_subscription._meta.get_field('user')
        assert isinstance(user_field, ForeignKey)
