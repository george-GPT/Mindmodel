from rest_framework import status, views
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from ..serializers.auth_serializers import UserSerializer
from mindmodel.core.utils import APIResponse
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from ..models import User
from ..services.email_service import EmailService
from drf_spectacular.utils import extend_schema, OpenApiExample
from mindmodel.docs.api_documentation import AUTH_EXAMPLES, ERROR_RESPONSES

User = get_user_model()

class GoogleAuthView(views.APIView):
    @extend_schema(
        summary="Google OAuth authentication",
        description="Authenticate user with Google OAuth credential",
        responses={
            200: AUTH_EXAMPLES["login_success"],
            400: ERROR_RESPONSES["auth"]["invalid_credentials"],
            401: ERROR_RESPONSES["auth"]["token_invalid"]
        }
    )
    def post(self, request):
        try:
            credential = request.data.get('credential')
            if not credential:
                return APIResponse(
                    success=False,
                    message="Authentication failed",
                    error={
                        "code": "invalid_credentials",
                        "details": {"message": "Google credential is required"}
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            idinfo = self._validate_google_token(credential)

            if not idinfo.get('email_verified'):
                return APIResponse(
                    success=False,
                    message="Authentication failed",
                    error={
                        "code": "email_not_verified",
                        "details": {"message": "Email not verified with Google"}
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            email = idinfo['email']
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0],
                    'is_verified': True,
                    'is_member': False,
                    'profile_complete': False
                }
            )

            tokens = EmailService.generate_tokens(user)
            
            return APIResponse(
                success=True,
                message="Login successful",
                data={
                    'user': UserSerializer(user).data,
                    'access': tokens['access'],
                    'refresh': tokens['refresh']
                },
                status=status.HTTP_200_OK
            )

        except ValueError:
            return APIResponse(
                success=False,
                message="Authentication failed",
                error={
                    "code": "token_invalid",
                    "details": {"message": "Invalid Google token"}
                },
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            return APIResponse(
                success=False,
                message="Authentication failed",
                error={
                    "code": "server_error",
                    "details": {"message": str(e)}
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _validate_google_token(self, token: str) -> dict:
        """Validate Google token and return user info"""
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            settings.GOOGLE_OAUTH2_CLIENT_ID
        )
        
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')
            
        return idinfo