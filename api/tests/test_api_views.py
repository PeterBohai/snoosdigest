import pytest
from django.urls import reverse
from django.utils.http import urlencode
from rest_framework.test import APIClient

from api import consts


@pytest.mark.django_db
def test_home_page_posts(api_client: APIClient) -> None:
    url = reverse('api:home_page_posts')
    params = {'time_filter': 'day'}
    url_params = f'{url}?{urlencode(params)}'
    response = api_client.get(url_params)
    assert response.status_code == 200
    assert type(response.json()['r/news']) is list
    assert len(response.json()['r/news']) == consts.MAX_NUM_POSTS_PER_SUBREDDIT


@pytest.mark.django_db
def test_subreddit_posts_top(api_client: APIClient) -> None:
    url = reverse('api:subreddit_posts_top', kwargs={'subreddit': 'news'})
    params = {'time_filter': 'day', 'n': consts.MAX_NUM_POSTS_PER_SUBREDDIT}
    url_params = f'{url}?{urlencode(params)}'
    response = api_client.get(url_params)
    assert response.status_code == 200
    assert response.json()['subreddit_name'] == 'r/news'
    assert type(response.json()['posts']) is list
    assert len(response.json()['posts']) == consts.MAX_NUM_POSTS_PER_SUBREDDIT
