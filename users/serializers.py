from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings


from users.models import User, UserSubscription


class SnoosDigestTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user: User) -> RefreshToken:
        token = super().get_token(user)

        # Custom private claims
        token[f'{settings.NAMESPACE}/username'] = user.username

        return token


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'date_joined',
            'first_name',
            'last_name',
        ]


class UserSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSubscription
        fields = ['user', 'subreddit', 'sort_order', 'favorite']
