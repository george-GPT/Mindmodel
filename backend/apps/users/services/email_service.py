from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.utils.crypto import get_random_string
from django.utils import timezone
from datetime import timedelta

class EmailService:
    @staticmethod
    def generate_verification_token():
        """Generate a random token for email verification"""
        return get_random_string(64)

    @staticmethod
    def send_verification_email(user, verification_token):
        """Send verification email to user"""
        subject = 'Verify your Mindmodel account'
        
        # Create verification link
        verification_link = f"{settings.FRONTEND_URL}/verify-email?token={verification_token}"
        
        # Render HTML email template
        html_message = render_to_string('emails/verify_email.html', {
            'user': user,
            'verification_link': verification_link
        })
        
        # Create plain text version
        plain_message = strip_tags(html_message)
        
        # Send email
        return send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            html_message=html_message
        )

    @staticmethod
    def send_password_reset_email(user, reset_token):
        """Send password reset email"""
        subject = 'Reset your Mindmodel password'
        
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
        
        html_message = render_to_string('emails/reset_password.html', {
            'user': user,
            'reset_link': reset_link
        })
        
        plain_message = strip_tags(html_message)
        
        return send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            html_message=html_message
        )

    @staticmethod
    def send_welcome_email(user):
        """Send welcome email after verification"""
        subject = 'Welcome to Mindmodel!'
        html_message = render_to_string('emails/welcome.html', {
            'user': user
        })
        plain_message = strip_tags(html_message)
        
        return send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            html_message=html_message
        )

    @staticmethod
    def send_email_change_verification(user, new_email, verification_token):
        """Send email change verification"""
        subject = 'Verify your new email address'
        verification_link = f"{settings.FRONTEND_URL}/verify-email-change?token={verification_token}"
        
        # Send to new email
        html_message = render_to_string('emails/verify_email_change.html', {
            'user': user,
            'verification_link': verification_link,
            'new_email': new_email
        })
        plain_message = strip_tags(html_message)
        
        # Send notification to old email
        old_email_html = render_to_string('emails/email_change_notification.html', {
            'user': user,
            'new_email': new_email
        })
        old_email_plain = strip_tags(old_email_html)
        
        # Send both emails
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[new_email],
            html_message=html_message
        )
        
        send_mail(
            subject='Email Change Notification',
            message=old_email_plain,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            html_message=old_email_html
        ) 