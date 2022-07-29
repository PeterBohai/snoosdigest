from django.db import models
from django.contrib.auth.models import AbstractUser

from api.models import Subreddit


class User(AbstractUser):
    pass


class UserSubscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subreddit = models.ForeignKey(Subreddit, on_delete=models.CASCADE)
    sort_order = models.PositiveIntegerField()
    favorite = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'users_user_subscriptions'
