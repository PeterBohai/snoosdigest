"""snoosdigest URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os

from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView

admin_url: str = "admin/"

if os.environ["DJANGO_SETTINGS_MODULE"] == "snoosdigest.settings.production":
    admin_url = os.environ["PROD_ADMIN_URL"]

urlpatterns = [
    path(admin_url, admin.site.urls),
    path("api/users/", include("users.urls")),
    path("api/reddit/", include("api.urls")),
    path("api/hackernews/", include("hackernews.urls")),
]

if os.environ["DJANGO_SETTINGS_MODULE"] != "snoosdigest.settings.local":
    urlpatterns += [
        path("", TemplateView.as_view(template_name="index.html")),
        re_path(r"^(?:.*)/?$", TemplateView.as_view(template_name="index.html")),
    ]
