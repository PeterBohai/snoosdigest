from django.urls import path

from . import views

app_name = "hackernews"
urlpatterns = [
    path("posts", views.PostList.as_view(), name="posts"),
    path("posts/<int:post_id>", views.PostDetail.as_view(), name="post_detail"),
    path("comments/<int:comment_id>", views.CommentDetail.as_view(), name="comment_detail"),
]
