import pytest
from rest_framework.test import APIClient


@pytest.fixture(scope='session')
def django_db_setup() -> None:
    pass


@pytest.fixture
def api_client() -> APIClient:
    return APIClient()
