from django.urls import path

from users import views

app_name = 'users'
urlpatterns = [
    path('subscriptions', views.UserSubredditSubscriptions.as_view(), name='subscriptions'),
    path('login', views.UserLogin.as_view(), name='login'),
    path('register', views.UserRegister.as_view(), name='register'),
    path('profile', views.UserProfile.as_view(), name='profile'),
    path('update-password', views.UserUpdatePassword.as_view(), name='update_password'),
]
