from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import PasswordResetRequest, User, UserSubscription

admin.site.register(User, UserAdmin)


@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = ("user", "subreddit", "sort_order", "favorite", "created_at")


@admin.register(PasswordResetRequest)
class UserPasswordResetRequest(admin.ModelAdmin):
    list_display = (
        "user",
        "request_time",
        "expire_time",
        "used",
    )
