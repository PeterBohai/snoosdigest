release: python manage.py migrate
web: gunicorn snoosdigest.asgi:application -w 2 -k uvicorn.workers.UvicornWorker
