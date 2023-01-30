import uuid
from datetime import datetime, timedelta

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

from api.models import Subreddit


class User(AbstractUser):
    dark_mode = models.BooleanField(default=False)


class UserSubscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_subscriptions")
    subreddit = models.ForeignKey(Subreddit, on_delete=models.CASCADE)
    sort_order = models.PositiveIntegerField(null=True, blank=True)
    favorite = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "users_user_subscriptions"


def current_time_offset_one_hr() -> datetime:
    return timezone.now() + timedelta(hours=1)


class PasswordResetRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="password_resets")
    request_time = models.DateTimeField(auto_now_add=True)
    expire_time = models.DateTimeField(default=current_time_offset_one_hr)
    reset_token = models.UUIDField(default=uuid.uuid4, editable=False)
    used = models.BooleanField(default=False)

    class Meta:
        db_table = "users_user_password_reset_requests"
