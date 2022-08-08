from snoosdigest.settings.base import *

DEBUG = False

TEMPLATES[0]['DIRS'] += [BASE_DIR / 'frontend/build', ]

STATICFILES_DIRS += [
    BASE_DIR / 'frontend/build/static',
]

ALLOWED_HOSTS = ['127.0.0.1', 'localhost', ]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME_PROD'),
        'USER': os.environ.get('DB_USER_PROD'),
        'PASSWORD': os.environ.get('DB_PASSWORD_PROD'),
        'HOST': os.environ.get('DB_HOST_PROD'),
        'PORT': '5432'
    }
}

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',    # Should be placed as high as possible, especially before any middleware that can generate responses such as Django’s CommonMiddleware or Whitenoise’s WhiteNoiseMiddleware
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',       # Should be placed directly after the Django SecurityMiddleware and before all other
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = ['rest_framework.renderers.JSONRenderer', ]
