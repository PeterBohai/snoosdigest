from typing import Union

import pytest
from django.db.models.fields import BooleanField
from django.db.models.fields.related import ForeignKey

from users.models import PasswordResetRequest, User, UserSubscription

pytestmark = pytest.mark.django_db


class TestUser:
    def test_count(self, valid_user_data: dict[str, Union[str, bool]]) -> None:
        assert User.objects.count() == 0
        User.objects.create_user(**valid_user_data)
        assert User.objects.count() == 1

    def test_dark_mode_type_is_boolean(
        self,
    ) -> None:
        assert isinstance(User._meta.get_field('dark_mode'), BooleanField)


class TestUserSubscription:
    def test_count(self) -> None:
        assert type(UserSubscription.objects.count()) is int

    def test_user_is_not_null(self) -> None:
        assert not UserSubscription.objects.filter(user__isnull=True).exists()

    def test_subreddit_is_not_null(self) -> None:
        assert not UserSubscription.objects.filter(subreddit__isnull=True).exists()

    def test_created_at_is_not_null(self) -> None:
        assert not UserSubscription.objects.filter(created_at__isnull=True).exists()

    def test_user_is_foreign_key(self) -> None:
        user_field = UserSubscription._meta.get_field('user')
        assert isinstance(user_field, ForeignKey)


class TestPasswordResetRequest:
    def test_count(self) -> None:
        assert type(PasswordResetRequest.objects.count()) is int

    def test_used_or_expired_type_is_boolean(self) -> None:
        used_or_expired_field = PasswordResetRequest._meta.get_field('used')
        assert isinstance(used_or_expired_field, BooleanField)
