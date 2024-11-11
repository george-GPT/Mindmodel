from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from ..serializers.serializers import UserSerializer
from ..models import User
from ..services.email_service import generate_tokens

class GoogleAuthView(APIView):
    def post(self, request):
        try:
            # Verify the Google token
            credential = request.data.get('credential')
            idinfo = self._validate_google_token(credential)

            # Verify email
            if not idinfo.get('email_verified'):
                return Response(
                    {'error': 'Email not verified with Google'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            email = idinfo['email']
            
            # Get or create user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0],  # Basic username from email
                    'is_verified': True,  # Google verified the email
                    'is_member': False,  # Default to non-member
                    'profile_complete': False
                }
            )

            # Generate tokens using your existing token service
            tokens = generate_tokens(user)
            
            return Response({
                'user': UserSerializer(user).data,
                'access': tokens['access'],
                'refresh': tokens['refresh']
            })

        except ValueError as e:
            return Response(
                {'error': 'Invalid token'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
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