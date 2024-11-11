import pytest
from django.urls import reverse
from rest_framework import status

pytestmark = pytest.mark.django_db

class TestAuthEndpoints:
    def test_login_success(self, api_client, test_user):
        url = reverse('token_obtain_pair')
        data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data

    def test_protected_route(self, authenticated_client):
        url = reverse('protected-route-name')  # Replace with your actual protected route
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_unauthorized_access(self, api_client):
        url = reverse('protected-route-name')  # Replace with your actual protected route
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED 