from django.urls import path
from api import views

app_name = 'api'
urlpatterns = [
    path('subreddit/<str:subreddit>/top-posts', views.SubredditTopPostsList.as_view(), name='subreddit_posts_top'),
]
