from django.urls import path
from api import views
from rest_framework_simplejwt.views import TokenObtainPairView

app_name = 'api'
urlpatterns = [
    path('subreddits/<str:subreddit>/top-posts', views.SubredditTopPostsList.as_view(), name='subreddit_posts_top'),
    path('posts/homepage', views.HomePagePostsList.as_view(), name='home_page_posts'),
    path('posts/<str:post_id>', views.RedditPostDetail.as_view(), name='reddit_post_detail'),
    path('user/watchlist', views.UserSubredditWatchList.as_view(), name='user_watchlist'),
    path('users/login', TokenObtainPairView.as_view(), name='token_obtain_pair'),
]
