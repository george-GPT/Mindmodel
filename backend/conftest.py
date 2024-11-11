import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

@pytest.fixture
def api_client():
    """Return an API client for testing endpoints"""
    return APIClient()

@pytest.fixture
def test_user():
    """Create test user exactly as documented"""
    return User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123'
    )

@pytest.fixture
def auth_client(api_client, test_user):
    """Create authenticated client as documented"""
    refresh = RefreshToken.for_user(test_user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client, test_user

@pytest.fixture
def test_password():
    return 'testpass123'