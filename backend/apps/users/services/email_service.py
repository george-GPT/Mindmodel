from django.core.mail import send_mail
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
import secrets

class EmailService:
    @staticmethod
    def generate_tokens(user):
        """Generate access and refresh tokens for user"""
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }

    @staticmethod
    def generate_verification_token():
        """Generate a random verification token"""
        return secrets.token_urlsafe(32)

    @staticmethod
    def send_verification_email(user, token):
        """Send email verification link to user."""
        subject = 'Verify your email address'
        message = f'Click the following link to verify your email: {settings.FRONTEND_URL}/verify-email?token={token}'
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )

    @staticmethod
    def send_password_reset_email(user, token):
        """Send password reset link to user."""
        subject = 'Reset your password'
        message = f'Click the following link to reset your password: {settings.FRONTEND_URL}/reset-password?token={token}'
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )

    @staticmethod
    def send_email_change_verification(user, new_email, token):
        """Send email change verification link."""
        subject = 'Verify your new email address'
        message = f'Click the following link to verify your new email: {settings.FRONTEND_URL}/verify-email-change?token={token}'
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [new_email],
            fail_silently=False,
        ) 