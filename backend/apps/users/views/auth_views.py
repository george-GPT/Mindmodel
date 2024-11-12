from rest_framework import status, views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from apps.users.serializers.auth_serializers import (
    EmailTokenObtainPairSerializer,
    UserSerializer,
    PasswordChangeSerializer,
    EmailChangeSerializer
)
from ..services.email_service import EmailService
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.exceptions import ValidationError
from ..validators import validate_password_strength, validate_password_history
from ..models import PasswordHistory
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from mindmodel.docs.api_documentation import (
    AUTH_EXAMPLES,
    ERROR_RESPONSES,
    VALIDATION_RULES,
    SECURITY_SCHEMAS
)
from mindmodel.core.utils import APIResponse
from mindmodel.core.utils.exceptions import custom_exception_handler

User = get_user_model()

@extend_schema(
    tags=['auth'],
    examples=[
        AUTH_EXAMPLES["login_success"],
        AUTH_EXAMPLES["auth_error"]
    ]
)
class LoginView(TokenObtainPairView):
    """Handle user login and token generation."""
    
    @extend_schema(
        summary="User login",
        description="Authenticate user and return JWT tokens",
        request=EmailTokenObtainPairSerializer,
        responses={
            200: {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "default": True},
                    "message": {"type": "string"},
                    "data": {
                        "type": "object",
                        "properties": {
                            "access": {"type": "string", "description": "JWT access token"},
                            "refresh": {"type": "string", "description": "JWT refresh token"},
                            "user": {"type": "object", "description": "User details"}
                        }
                    }
                }
            },
            401: {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "default": False},
                    "message": {"type": "string"},
                    "error": {
                        "type": "object",
                        "properties": {
                            "code": {"type": "string"},
                            "details": {"type": "object"}
                        }
                    }
                }
            }
        },
        examples=[
            OpenApiExample(
                'Success Response',
                value={
                    "success": True,
                    "message": "Login successful",
                    "data": {
                        "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
                        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
                        "user": {
                            "id": 1,
                            "username": "testuser",
                            "email": "test@example.com",
                            "is_verified": True
                        }
                    }
                }
            )
        ]
    )
    def post(self, request):
        """Login user and return tokens."""
        serializer = EmailTokenObtainPairSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                user.set_verification_token()
                EmailService.send_verification_email(user, user.verification_token)
                
                # Generate tokens
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    "success": True,
                    "message": "Registration successful. Please verify your email.",
                    "data": {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh),
                        'user': UserSerializer(user).data
                    }
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    "success": False,
                    "message": "Registration failed",
                    "error": {
                        "message": str(e),
                        "code": "registration_failed",
                        "field": None
                    }
                }, status=status.HTTP_400_BAD_REQUEST)
                
        return Response({
            "success": False,
            "message": "Validation failed",
            "error": {
                "message": "Invalid data provided",
                "code": "validation_error",
                "field": next(iter(serializer.errors)),  # Gets the first error field
            },
            "errors": serializer.errors  # Detailed validation errors
        }, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=['auth'])
class RegisterView(views.APIView):
    """Handle user registration."""
    
    @extend_schema(
        summary="User registration",
        description="Register a new user account",
        request={
            "type": "object",
            "properties": {
                "email": {"type": "string", "format": "email"},
                "username": {"type": "string", "minLength": 3},
                "password": {"type": "string", "minLength": 8}
            },
            "required": ["email", "username", "password"]
        },
        responses={
            201: {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "default": True},
                    "message": {"type": "string"},
                    "data": {
                        "type": "object",
                        "properties": {
                            "user": {"type": "object"},
                            "access": {"type": "string"},
                            "refresh": {"type": "string"}
                        }
                    }
                }
            },
            400: {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "default": False},
                    "message": {"type": "string"},
                    "error": {
                        "type": "object",
                        "properties": {
                            "code": {"type": "string"},
                            "details": {"type": "object"}
                        }
                    }
                }
            }
        }
    )
    def post(self, request):
        """Register a new user."""
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                user.set_verification_token()
                EmailService.send_verification_email(user, user.verification_token)
                
                # Generate tokens
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    "success": True,
                    "message": "Registration successful. Please verify your email.",
                    "data": {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh),
                        'user': UserSerializer(user).data
                    }
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    "success": False,
                    "message": "Registration failed",
                    "error": {
                        "message": str(e),
                        "code": "registration_failed",
                        "field": None
                    }
                }, status=status.HTTP_400_BAD_REQUEST)
                
        return Response({
            "success": False,
            "message": "Validation failed",
            "error": {
                "message": "Invalid data provided",
                "code": "validation_error",
                "field": next(iter(serializer.errors)),  # Gets the first error field
            },
            "errors": serializer.errors  # Detailed validation errors
        }, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=['auth'])
class LogoutView(views.APIView):
    permission_classes = [IsAuthenticated]
    
    @extend_schema(
        summary="Logout user",
        description="Logout the authenticated user",
        responses={
            200: {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "default": True},
                    "message": {"type": "string"}
                }
            },
            400: {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "default": False},
                    "message": {"type": "string"},
                    "error": {
                        "type": "object",
                        "properties": {
                            "code": {"type": "string"},
                            "details": {"type": "object"}
                        }
                    }
                }
            }
        }
    )
    def post(self, request):
        """Logout the authenticated user."""
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response({
                    "success": True,
                    "message": "Successfully logged out"
                }, status=status.HTTP_200_OK)
            return Response({
                "success": False,
                "message": "Logout failed",
                "error": {
                    "message": "No refresh token provided",
                    "code": "token_missing",
                    "field": "refresh"
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                "success": False,
                "message": "Logout failed",
                "error": {
                    "message": "Invalid refresh token",
                    "code": "token_invalid",
                    "field": "refresh"
                }
            }, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=['auth'])
class ChangePasswordView(views.APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Change user password",
        description="Change the user's password",
        request={
            "type": "object",
            "properties": {
                "old_password": {"type": "string", "minLength": 8},
                "new_password": {"type": "string", "minLength": 8}
            },
            "required": ["old_password", "new_password"]
        },
        responses={
            200: {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "default": True},
                    "message": {"type": "string"}
                }
            },
            400: {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "default": False},
                    "message": {"type": "string"},
                    "error": {
                        "type": "object",
                        "properties": {
                            "code": {"type": "string"},
                            "details": {"type": "object"}
                        }
                    }
                }
            }
        }
    )
    def post(self, request):
        """Change the user's password."""
        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            old_password = serializer.data['old_password']
            new_password = serializer.data['new_password']

            if not user.check_password(old_password):
                return Response({
                    "success": False,
                    "message": "Password change failed",
                    "error": {
                        "message": "Invalid old password",
                        "code": "invalid_credentials",
                        "field": "old_password"
                    }
                }, status=status.HTTP_400_BAD_REQUEST)

            try:
                # Validate password strength
                validate_password_strength(new_password)
                # Validate password history
                validate_password_history(user, new_password)

                # Save old password to history
                PasswordHistory.add_password(user, old_password)
                
                # Set new password
                user.set_password(new_password)
                user.save()

                return Response({
                    "success": True,
                    "message": "Password changed successfully"
                }, status=status.HTTP_200_OK)
                
            except ValidationError as e:
                return Response({
                    "success": False,
                    "message": "Password change failed",
                    "error": {
                        "message": str(e),
                        "code": "validation_error",
                        "field": "new_password"
                    }
                }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "success": False,
            "message": "Validation failed",
            "error": {
                "message": "Invalid data provided",
                "code": "validation_error",
                "field": next(iter(serializer.errors))
            },
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=['auth'])
class ChangeEmailView(views.APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Change user email",
        description="Change the user's email",
        request={
            "type": "object",
            "properties": {
                "new_email": {"type": "string", "format": "email"},
                "password": {"type": "string", "minLength": 8}
            },
            "required": ["new_email", "password"]
        },
        responses={
            200: {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "default": True},
                    "message": {"type": "string"}
                }
            },
            400: {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "default": False},
                    "message": {"type": "string"},
                    "error": {
                        "type": "object",
                        "properties": {
                            "code": {"type": "string"},
                            "details": {"type": "object"}
                        }
                    }
                }
            }
        }
    )
    def post(self, request):
        """Change the user's email."""
        serializer = EmailChangeSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            new_email = serializer.validated_data['new_email']
            password = serializer.validated_data['password']

            # Verify password
            if not user.check_password(password):
                return Response({
                    "success": False,
                    "message": "Email change failed",
                    "error": {
                        "message": "Invalid password",
                        "code": "invalid_credentials",
                        "field": "password"
                    }
                }, status=status.HTTP_400_BAD_REQUEST)

            # Check if email is already in use
            if User.objects.filter(email=new_email).exists():
                return Response({
                    "success": False,
                    "message": "Email change failed",
                    "error": {
                        "message": "Email already in use",
                        "code": "duplicate_email",
                        "field": "new_email"
                    }
                }, status=status.HTTP_400_BAD_REQUEST)

            # Store new email and generate verification token
            user.new_email = new_email
            user.set_email_change_token()
            
            # Send verification emails
            EmailService.send_email_change_verification(
                user, 
                new_email, 
                user.email_change_token
            )

            return Response({
                "success": True,
                "message": "Verification email sent to new address"
            }, status=status.HTTP_200_OK)

        return Response({
            "success": False,
            "message": "Validation failed",
            "error": {
                "message": "Invalid data provided",
                "code": "validation_error",
                "field": next(iter(serializer.errors))
            },
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=['auth'])
class ProfileView(views.APIView):
    permission_classes = [IsAuthenticated]
    
    @extend_schema(
        summary="Get user profile",
        description="Retrieve the authenticated user's profile",
        responses={
            200: {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "default": True},
                    "message": {"type": "string"},
                    "data": {"type": "object"}
                }
            },
            400: {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "default": False},
                    "message": {"type": "string"},
                    "error": {
                        "type": "object",
                        "properties": {
                            "code": {"type": "string"},
                            "details": {"type": "object"}
                        }
                    }
                }
            }
        }
    )
    def get(self, request):
        """Retrieve the authenticated user's profile."""
        serializer = UserSerializer(request.user)
        return Response({
            "success": True,
            "message": "Profile retrieved successfully",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Update user profile",
        description="Update the authenticated user's profile",
        request={
            "type": "object",
            "properties": {
                "username": {"type": "string", "minLength": 3},
                "email": {"type": "string", "format": "email"},
                "first_name": {"type": "string"},
                "last_name": {"type": "string"}
            },
            "required": ["username", "email"]
        },
        responses={
            200: {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "default": True},
                    "message": {"type": "string"},
                    "data": {"type": "object"}
                }
            },
            400: {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "default": False},
                    "message": {"type": "string"},
                    "error": {
                        "type": "object",
                        "properties": {
                            "code": {"type": "string"},
                            "details": {"type": "object"}
                        }
                    }
                }
            }
        }
    )
    def patch(self, request):
        """Update the authenticated user's profile."""
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Profile updated successfully",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            "success": False,
            "message": "Profile update failed",
            "error": {
                "message": "Invalid data provided",
                "code": "validation_error",
                "field": next(iter(serializer.errors))
            },
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=['auth'])
class TwoFactorEnableView(views.APIView):
    permission_classes = [IsAuthenticated]
    
    @extend_schema(
        summary="Enable two-factor authentication",
        description="Enable two-factor authentication for the authenticated user",
        responses={
            200: {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "default": True},
                    "message": {"type": "string"}
                }
            },
            400: {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "default": False},
                    "message": {"type": "string"},
                    "error": {
                        "type": "object",
                        "properties": {
                            "code": {"type": "string"},
                            "details": {"type": "object"}
                        }
                    }
                }
            }
        }
    )
    def post(self, request):
        """Enable two-factor authentication for the authenticated user."""
        try:
            user = request.user
            user.two_factor_enabled = True
            user.save()
            return Response({
                "success": True,
                "message": "2FA enabled successfully"
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "success": False,
                "message": "Failed to enable 2FA",
                "error": {
                    "message": str(e),
                    "code": "two_factor_error",
                    "field": None
                }
            }, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=['auth'])
class TwoFactorDisableView(views.APIView):
    permission_classes = [IsAuthenticated]
    
    @extend_schema(
        summary="Disable two-factor authentication",
        description="Disable two-factor authentication for the authenticated user",
        responses={
            200: {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "default": True},
                    "message": {"type": "string"}
                }
            },
            400: {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "default": False},
                    "message": {"type": "string"},
                    "error": {
                        "type": "object",
                        "properties": {
                            "code": {"type": "string"},
                            "details": {"type": "object"}
                        }
                    }
                }
            }
        }
    )
    def post(self, request):
        """Disable two-factor authentication for the authenticated user."""
        try:
            user = request.user
            user.two_factor_enabled = False
            user.save()
            return Response({
                "success": True,
                "message": "2FA disabled successfully"
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "success": False,
                "message": "Failed to disable 2FA",
                "error": {
                    "message": str(e),
                    "code": "two_factor_error",
                    "field": None
                }
            }, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=['auth'])
class PasswordResetView(views.APIView):
    permission_classes = []
    
    @extend_schema(
        summary="Request password reset",
        description="Request a password reset link for the user",
        request={
            "type": "object",
            "properties": {
                "email": {"type": "string", "format": "email"}
            },
            "required": ["email"]
        },
        responses={
            200: {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "default": True},
                    "message": {"type": "string"}
                }
            },
            400: {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "default": False},
                    "message": {"type": "string"},
                    "error": {
                        "type": "object",
                        "properties": {
                            "code": {"type": "string"},
                            "details": {"type": "object"}
                        }
                    }
                }
            }
        }
    )
    def post(self, request):
        """Request a password reset link for the user."""
        try:
            email = request.data.get('email')
            if not email:
                return Response({
                    "success": False,
                    "message": "Password reset failed",
                    "error": {
                        "message": "Email is required",
                        "code": "missing_field",
                        "field": "email"
                    }
                }, status=status.HTTP_400_BAD_REQUEST)

            # Don't reveal if user exists
            user = User.objects.filter(email=email).first()
            if user:
                user.set_password_reset_token()
                EmailService.send_password_reset_email(user, user.password_reset_token)

            return Response({
                "success": True,
                "message": "If an account exists with this email, a password reset link will be sent."
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                "success": False,
                "message": "Password reset request failed",
                "error": {
                    "message": "Unable to process request",
                    "code": "reset_request_failed",
                    "field": None
                }
            }, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=['auth'])
class PasswordResetConfirmView(views.APIView):
    permission_classes = []
    
    @extend_schema(
        summary="Confirm password reset",
        description="Confirm the password reset using the reset token",
        request={
            "type": "object",
            "properties": {
                "token": {"type": "string"},
                "new_password": {"type": "string", "minLength": 8}
            },
            "required": ["token", "new_password"]
        },
        responses={
            200: {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "default": True},
                    "message": {"type": "string"}
                }
            },
            400: {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "default": False},
                    "message": {"type": "string"},
                    "error": {
                        "type": "object",
                        "properties": {
                            "code": {"type": "string"},
                            "details": {"type": "object"}
                        }
                    }
                }
            }
        }
    )
    def post(self, request):
        """Confirm the password reset using the reset token."""
        try:
            token = request.data.get('token')
            new_password = request.data.get('new_password')

            if not token or not new_password:
                return Response({
                    "success": False,
                    "message": "Password reset failed",
                    "error": {
                        "message": "Token and new password are required",
                        "code": "missing_fields",
                        "field": None
                    }
                }, status=status.HTTP_400_BAD_REQUEST)

            # Validate token and get user
            user = User.objects.filter(password_reset_token=token).first()
            if not user or not user.is_password_reset_token_valid():
                return Response({
                    "success": False,
                    "message": "Password reset failed",
                    "error": {
                        "message": "Invalid or expired token",
                        "code": "invalid_token",
                        "field": "token"
                    }
                }, status=status.HTTP_400_BAD_REQUEST)

            # Validate new password
            try:
                validate_password_strength(new_password)
                validate_password_history(user, new_password)
                
                user.set_password(new_password)
                user.password_reset_token = None
                user.save()

                return Response({
                    "success": True,
                    "message": "Password has been reset successfully"
                }, status=status.HTTP_200_OK)
                
            except ValidationError as e:
                return Response({
                    "success": False,
                    "message": "Password reset failed",
                    "error": {
                        "message": str(e),
                        "code": "validation_error",
                        "field": "new_password"
                    }
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                "success": False,
                "message": "Password reset failed",
                "error": {
                    "message": "Unable to reset password",
                    "code": "reset_failed",
                    "field": None
                }
            }, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=['auth'])
class EmailVerificationView(views.APIView):
    """Handle email verification."""
    
    @extend_schema(
        summary="Verify email address",
        description="Verify user's email address using verification token",
        parameters=[
            OpenApiParameter(
                name="token",
                type=str,
                location=OpenApiParameter.QUERY,
                description="Email verification token",
                required=True
            )
        ],
        responses={
            200: {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "default": True},
                    "message": {"type": "string"}
                }
            },
            400: {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean", "default": False},
                    "message": {"type": "string"},
                    "error": {"type": "object"}
                }
            }
        }
    )
    def get(self, request):
        """Verify email with token."""
        token = request.query_params.get('token')
        if not token:
            return Response({
                "success": False,
                "message": "Email verification failed",
                "error": {
                    "message": "Verification token is required",
                    "code": "missing_token",
                    "field": "token"
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.filter(verification_token=token).first()
            if not user or not user.is_verification_token_valid():
                return Response({
                    "success": False,
                    "message": "Email verification failed",
                    "error": {
                        "message": "Invalid or expired verification token",
                        "code": "invalid_token",
                        "field": "token"
                    }
                }, status=status.HTTP_400_BAD_REQUEST)

            user.is_verified = True
            user.verification_token = None
            user.save()

            return Response({
                "success": True,
                "message": "Email verified successfully"
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "success": False,
                "message": "Email verification failed",
                "error": {
                    "message": "Unable to verify email",
                    "code": "verification_failed",
                    "field": None
                }
            }, status=status.HTTP_400_BAD_REQUEST)