# Backend/Apps/Users/urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

# Auth views
from .views.auth_views import (
    LoginView,
    RegisterView,
    LogoutView,
    ProfileView,
    ChangePasswordView,
    ChangeEmailView,
)

# Social auth views
from .views.social_auth import GoogleAuthView

# Verification views
from .views.verification import (
    EmailVerificationView,
    ResendVerificationView
)

# Member views
from .views.member_views import (
    MemberRegistrationView,
    MemberProfileView,
    UserProfileView
)

# Two-factor views
from .views.auth_views import (
    TwoFactorEnableView,
    TwoFactorDisableView,
)

app_name = 'users'

urlpatterns = [
    # Auth endpoints
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('change-email/', ChangeEmailView.as_view(), name='change_email'),
    
    # Member endpoints
    path('member/register/', MemberRegistrationView.as_view(), name='member_register'),
    path('member/profile/', MemberProfileView.as_view(), name='member_profile'),
    path('me/', UserProfileView.as_view(), name='user_profile'),
    path('profile/', ProfileView.as_view(), name='profile'),
    
    # Social auth
    path('auth/google/', GoogleAuthView.as_view(), name='google-auth'),
    
    # 2FA
    path('2fa/enable/', TwoFactorEnableView.as_view(), name='2fa_enable'),
    path('2fa/disable/', TwoFactorDisableView.as_view(), name='2fa_disable'),
    
    # Email verification
    path('verify-email/', EmailVerificationView.as_view(), name='verify-email'),
    path('resend-verification/', ResendVerificationView.as_view(), name='resend-verification'),
]
