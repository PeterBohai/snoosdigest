from django.urls import path
from api import views

app_name = 'api'
urlpatterns = [
    path(
        'subreddits/<str:subreddit>/top-posts',
        views.SubredditTopPostsList.as_view(),
        name='subreddit_posts_top',
    ),
    path('posts/homepage', views.HomePagePostsList.as_view(), name='home_page_posts'),
    path('posts/<str:post_id>', views.RedditPostDetail.as_view(), name='reddit_post_detail'),
]
