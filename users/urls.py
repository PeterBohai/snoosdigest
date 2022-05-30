from django.urls import path
from users import views

app_name = 'users'
urlpatterns = [
    path('watchlist', views.UserSubredditWatchList.as_view(), name='watchlist'),
    path('login', views.SnoosDigestTokenObtainPairView.as_view(), name='login'),
    path('register', views.UserRegister.as_view(), name='register'),
    path('profile', views.UserProfile.as_view(), name='profile'),
]
