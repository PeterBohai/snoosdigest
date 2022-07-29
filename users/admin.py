from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User, UserSubscription

admin.site.register(User, UserAdmin)


@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'subreddit', 'sort_order', 'favorite', 'created_at')
