from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from ..models import User
from ..services.email_service import EmailService
from django.core import mail
from django.utils import timezone
from datetime import timedelta

class EmailVerificationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.user.set_verification_token()
        self.verify_url = reverse('users:verify-email')
        self.resend_url = reverse('users:resend-verification')

    def test_verify_email_success(self):
        """Test successful email verification"""
        response = self.client.post(self.verify_url, {
            'token': self.user.verification_token
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.email_verified)
        self.assertIsNone(self.user.verification_token)

    def test_verify_email_invalid_token(self):
        """Test verification with invalid token"""
        response = self.client.post(self.verify_url, {
            'token': 'invalid-token'
        })
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.user.refresh_from_db()
        self.assertFalse(self.user.email_verified)

    def test_verify_email_expired_token(self):
        """Test verification with expired token"""
        self.user.verification_token_created = timezone.now() - timedelta(hours=25)
        self.user.save()
        
        response = self.client.post(self.verify_url, {
            'token': self.user.verification_token
        })
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(self.user.email_verified)

    def test_resend_verification_success(self):
        """Test successful resend of verification email"""
        response = self.client.post(self.resend_url, {
            'email': self.user.email
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('verify', mail.outbox[0].subject.lower())

    def test_resend_verification_already_verified(self):
        """Test resend when email is already verified"""
        self.user.email_verified = True
        self.user.save()
        
        response = self.client.post(self.resend_url, {
            'email': self.user.email
        })
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(mail.outbox), 0)

    def test_resend_verification_invalid_email(self):
        """Test resend with invalid email"""
        response = self.client.post(self.resend_url, {
            'email': 'nonexistent@example.com'
        })
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(len(mail.outbox), 0) 