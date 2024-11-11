import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from unittest.mock import patch
from ..models import User

@pytest.mark.django_db
class TestGoogleAuth:
    def setup_method(self):
        self.client = APIClient()
        self.google_auth_url = reverse('users:google-auth')

    @patch('google.oauth2.id_token.verify_oauth2_token')
    def test_google_auth_success(self, mock_verify_token):
        # Mock Google token verification
        mock_verify_token.return_value = {
            'email': 'test@gmail.com',
            'email_verified': True,
            'name': 'Test User',
            'sub': '12345'
        }

        response = self.client.post(self.google_auth_url, {
            'credential': 'mock_token'
        })

        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
        assert 'user' in response.data

        # Verify user was created
        user = User.objects.get(email='test@gmail.com')
        assert user.email_verified
        assert user.is_active

    @patch('google.oauth2.id_token.verify_oauth2_token')
    def test_google_auth_unverified_email(self, mock_verify_token):
        mock_verify_token.return_value = {
            'email': 'test@gmail.com',
            'email_verified': False
        }

        response = self.client.post(self.google_auth_url, {
            'credential': 'mock_token'
        })

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'error' in response.data

    def test_google_auth_invalid_token(self):
        response = self.client.post(self.google_auth_url, {
            'credential': 'invalid_token'
        })

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'error' in response.data 