import pytest
from django.urls import reverse
from rest_framework import status

pytestmark = pytest.mark.django_db

class TestAuthEndpoints:
    def test_login_endpoint(self, api_client, test_user, test_password):
        url = reverse('token_obtain_pair')
        data = {
            'email': test_user.email,
            'password': test_password
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data

    def test_protected_endpoint(self, auth_client):
        client, user = auth_client
        url = reverse('user-profile')  # Adjust to match your URL name
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['email'] == user.email

    def test_unauthorized_access(self, api_client):
        url = reverse('user-profile')  # Adjust to match your URL name
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED