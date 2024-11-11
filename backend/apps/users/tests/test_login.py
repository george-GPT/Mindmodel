import pytest
from django.urls import reverse
from rest_framework import status

pytestmark = pytest.mark.django_db

class TestUserLogin:
    def test_user_login_success(self, api_client, test_user):
        url = reverse('token_obtain_pair')
        data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data

    def test_user_login_wrong_credentials(self, api_client):
        url = reverse('token_obtain_pair')
        data = {
            'email': 'wrong@example.com',
            'password': 'wrongpass'
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED 