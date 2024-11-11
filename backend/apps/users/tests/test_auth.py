import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from ..models import PasswordHistory
from datetime import timedelta
from django.utils import timezone

User = get_user_model()

@pytest.mark.django_db
class TestAuthEndpoints:
    @pytest.fixture
    def api_client(self):
        return APIClient()

    @pytest.fixture
    def test_user_data(self):
        return {
            'email': 'test@example.com',
            'username': 'testuser',
            'password': 'Test123!@#'
        }

    @pytest.fixture
    def test_user(self, test_user_data):
        user = User.objects.create_user(**test_user_data)
        user.is_verified = True
        user.save()
        return user

    def test_registration_success(self, api_client, test_user_data):
        """Test successful user registration"""
        url = reverse('users:register')
        response = api_client.post(url, test_user_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['success'] is True
        assert 'access' in response.data['data']
        assert 'refresh' in response.data['data']
        assert 'user' in response.data['data']

    def test_registration_validation(self, api_client):
        """Test registration validation"""
        url = reverse('users:register')
        invalid_data = {
            'email': 'invalid-email',
            'username': 'u',  # Too short
            'password': '123'  # Too weak
        }
        response = api_client.post(url, invalid_data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['success'] is False
        assert 'error' in response.data

    def test_login_success(self, api_client, test_user, test_user_data):
        """Test successful login"""
        url = reverse('users:login')
        response = api_client.post(url, {
            'email': test_user_data['email'],
            'password': test_user_data['password']
        })
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
        assert 'access' in response.data
        assert 'refresh' in response.data

    def test_login_invalid_credentials(self, api_client):
        """Test login with invalid credentials"""
        url = reverse('users:login')
        response = api_client.post(url, {
            'email': 'wrong@example.com',
            'password': 'wrongpass'
        })
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.data['success'] is False
        assert response.data['error']['code'] == 'invalid_credentials'

    def test_password_reset_request(self, api_client, test_user):
        """Test password reset request"""
        url = reverse('users:password-reset')
        response = api_client.post(url, {'email': test_user.email})
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True

    def test_password_reset_confirm(self, api_client, test_user):
        """Test password reset confirmation"""
        # Set up reset token
        test_user.set_password_reset_token()
        test_user.save()
        
        url = reverse('users:password-reset-confirm')
        response = api_client.post(url, {
            'token': test_user.password_reset_token,
            'new_password': 'NewTest123!@#'
        })
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True

    def test_email_verification(self, api_client, test_user):
        """Test email verification"""
        test_user.set_verification_token()
        test_user.save()
        
        url = reverse('users:verify-email')
        response = api_client.get(f"{url}?token={test_user.verification_token}")
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True

    def test_change_password(self, api_client, test_user, test_user_data):
        """Test password change"""
        # Login first
        api_client.force_authenticate(user=test_user)
        
        url = reverse('users:change-password')
        response = api_client.post(url, {
            'old_password': test_user_data['password'],
            'new_password': 'NewTest123!@#'
        })
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True

    def test_change_email(self, api_client, test_user, test_user_data):
        """Test email change request"""
        api_client.force_authenticate(user=test_user)
        
        url = reverse('users:change-email')
        response = api_client.post(url, {
            'new_email': 'newemail@example.com',
            'password': test_user_data['password']
        })
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True

    def test_profile_update(self, api_client, test_user):
        """Test profile update"""
        api_client.force_authenticate(user=test_user)
        
        url = reverse('users:profile')
        response = api_client.patch(url, {
            'meta': {
                'theme': 'dark',
                'notifications': True
            }
        })
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True

    def test_rate_limiting(self, api_client):
        """Test rate limiting middleware"""
        url = reverse('users:login')
        for _ in range(6):  # Exceed rate limit
            api_client.post(url, {
                'email': 'test@example.com',
                'password': 'wrongpass'
            })
        
        response = api_client.post(url, {
            'email': 'test@example.com',
            'password': 'wrongpass'
        })
        
        assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS
        assert response.data['error']['code'] == 'rate_limit_exceeded'