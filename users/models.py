from django.contrib.auth.models import AbstractUser
from django.db import models

from api.models import Subreddit


class User(AbstractUser):
    pass


class UserSubscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_subscriptions')
    subreddit = models.ForeignKey(Subreddit, on_delete=models.CASCADE)
    sort_order = models.PositiveIntegerField(null=True, blank=True)
    favorite = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'users_user_subscriptions'
