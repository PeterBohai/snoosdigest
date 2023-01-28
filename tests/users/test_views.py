import pytest
from django.urls import reverse
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_profile_unauthorized_request(api_client: APIClient) -> None:
    url = reverse('users:profile')
    response = api_client.get(url)
    assert response.status_code == 401
    assert response.json() == {"detail": "Authentication credentials were not provided."}
