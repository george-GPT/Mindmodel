from django.http import JsonResponse
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from django.conf import settings
import jwt
import logging

logger = logging.getLogger('auth')

class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Skip auth for allowed paths
        if self._is_path_allowed(request.path):
            return self.get_response(request)

        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return JsonResponse(
                {'error': 'Authentication required'}, 
                status=401
            )

        token = auth_header.split(' ')[1]
        try:
            # Verify token
            AccessToken(token)
            return self.get_response(request)
        except TokenError as e:
            logger.warning(f"Token validation failed: {str(e)}")
            return JsonResponse(
                {'error': 'Invalid or expired token'}, 
                status=401
            )
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            return JsonResponse(
                {'error': 'Authentication failed'}, 
                status=401
            )

    def _is_path_allowed(self, path):
        ALLOWED_PATHS = [
            '/api/users/auth/login',
            '/api/users/auth/register',
            '/api/users/auth/token/refresh',
            '/api/users/auth/social-auth',
        ]
        return any(path.startswith(allowed) for allowed in ALLOWED_PATHS) 