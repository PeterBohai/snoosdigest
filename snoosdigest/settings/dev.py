from snoosdigest.settings.base import *

DEBUG = False

TEMPLATES[0]["DIRS"] += [
    BASE_DIR / "frontend/build",
]

STATICFILES_DIRS += [
    BASE_DIR / "frontend/build/static",
]

STATIC_ROOT = BASE_DIR / "staticfiles"

ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
    "snoosdigest-dev.herokuapp.com",
    "snoosdigest-dev.onrender.com",
]

MIDDLEWARE = [
    # corsheaders should be placed as high as possible,
    # especially before any middleware that can generate responses such as Django’s CommonMiddleware or Whitenoise’s WhiteNoiseMiddleware
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    # whitenoise should be placed directly after the Django SecurityMiddleware and before all other
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = [
    "rest_framework.renderers.JSONRenderer",
]
