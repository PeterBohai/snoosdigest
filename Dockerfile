FROM node:16-alpine AS builder

WORKDIR /code
COPY frontend/ frontend/
WORKDIR /code/frontend
RUN npm install --legacy-peer-deps

FROM python:3.9-alpine

RUN apk update && apk upgrade
RUN apk add --no-cache postgresql-dev gcc musl-dev  # In order to use psycopg2 built from sources

WORKDIR /usr/src/app
COPY --from=builder /code/frontend/build frontend/build

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE snoosdigest.settings.dev

RUN pip install --upgrade pip
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY api/ api/
COPY snoosdigest/ snoosdigest/
COPY users/ users/
COPY .env ./
COPY manage.py ./

RUN python manage.py collectstatic --no-input
RUN python manage.py migrate

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
