from snoosdigest.settings.base import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('TEST_DB_NAME'),
        'USER': os.environ.get('TEST_DB_USER'),
        'PASSWORD': os.environ.get('TEST_DB_PASSWORD'),
        'HOST': os.environ.get('TEST_DB_HOST'),
        'PORT': '5432',
    }
}

REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = [
    'rest_framework.renderers.JSONRenderer',
]
