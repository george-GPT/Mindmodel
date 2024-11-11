import pytest
from django.urls import reverse
from rest_framework import status

pytestmark = pytest.mark.django_db

class TestURLAccess:
    def test_admin_access(self, client):
        url = reverse('admin:index')
        response = client.get(url)
        assert response.status_code == status.HTTP_302_FOUND  # Redirects to login

    def test_admin_login(self, client, test_user):
        # First make user a superuser
        test_user.is_staff = True
        test_user.is_superuser = True
        test_user.save()
        
        # Try to login
        login_successful = client.login(
            username=test_user.username,
            password='testpass123'
        )
        assert login_successful

        # Access admin after login
        url = reverse('admin:index')
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_api_endpoints(self, client):
        """Test that our API endpoints exist"""
        endpoints = [
            'users:auth:login',
            'users:auth:register',
            'users:auth:token-refresh',
            'users:member:me',
        ]
        
        for endpoint in endpoints:
            url = reverse(endpoint)
            assert url  # Verifies URL exists