# Backend/Apps/Users/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.hashers import make_password, check_password

class User(AbstractUser):
    """User model as defined in auth_documentation.md"""
    email = models.EmailField(unique=True)
    is_verified = models.BooleanField(default=False)
    is_member = models.BooleanField(default=False)
    profile_complete = models.BooleanField(default=False)
    meta = models.JSONField(blank=True, null=True)
    two_factor_enabled = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    email_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=100, blank=True, null=True)
    verification_token_created = models.DateTimeField(null=True)
    previous_email = models.EmailField(blank=True, null=True)
    email_change_token = models.CharField(max_length=100, blank=True, null=True)
    email_change_token_created = models.DateTimeField(null=True)
    new_email = models.EmailField(blank=True, null=True)

    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email']

    class Meta:
        app_label = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['is_member']),
        ]

    def __str__(self):
        return self.email

    # Fix the reverse accessor clashes
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',  # Changed from user_set
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',  # Changed from user_set
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    # Make sure these are True by default for your superuser
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)

    def set_verification_token(self):
        """Set a new verification token"""
        from .services.email_service import EmailService
        self.verification_token = EmailService.generate_verification_token()
        self.verification_token_created = timezone.now()
        self.save()

    def verify_email(self, token):
        """Verify user's email with given token"""
        if not self.verification_token or not self.verification_token_created:
            return False
            
        # Check if token is expired (24 hours)
        if timezone.now() > self.verification_token_created + timedelta(hours=24):
            return False
            
        if token == self.verification_token:
            self.email_verified = True
            self.verification_token = None
            self.verification_token_created = None
            self.save()
            return True
            
        return False

    def set_email_change_token(self):
        """Set token for email change verification"""
        from .services.email_service import EmailService
        self.email_change_token = EmailService.generate_verification_token()
        self.email_change_token_created = timezone.now()
        self.save()

    def verify_email_change(self, token: str) -> bool:
        """Verify email change token and update email"""
        if (
            self.email_change_token and 
            self.email_change_token == token and 
            self.email_change_token_created and 
            timezone.now() - self.email_change_token_created < timedelta(hours=24)
        ):
            self.previous_email = self.email
            self.email = self.new_email
            self.new_email = None
            self.email_change_token = None
            self.email_change_token_created = None
            self.save()
            return True
        return False

class MemberProfile(models.Model):
    user = models.OneToOneField(
        'users.User',
        on_delete=models.CASCADE,
        related_name='memberprofile'
    )
    bio = models.TextField(blank=True)
    profile_picture = models.ImageField(
        upload_to='profile_pics/',
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'users'

class BlacklistedToken(models.Model):
    token = models.CharField(max_length=500)
    blacklisted_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class PasswordHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_history')
    password_hash = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        get_latest_by = 'created_at'

    @classmethod
    def add_password(cls, user, password):
        """Add a password to history"""
        # Keep only last 5 passwords
        cls.objects.filter(user=user).order_by('-created_at')[5:].delete()
        return cls.objects.create(
            user=user,
            password_hash=make_password(password)
        )

    @classmethod
    def password_was_used(cls, user, password):
        """Check if password was used before"""
        for history in cls.objects.filter(user=user).order_by('-created_at')[:5]:
            if check_password(password, history.password_hash):
                return True
        return False
