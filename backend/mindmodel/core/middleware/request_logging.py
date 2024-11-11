import logging
import json
from django.utils import timezone
from django.conf import settings

logger = logging.getLogger('request_logger')

class RequestLoggingMiddleware:
    SENSITIVE_FIELDS = {'password', 'token', 'access', 'refresh', 'secret', 'authorization'}
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Start timing the request
        start_time = timezone.now()

        # Log request
        self.log_request(request)

        # Get response
        response = self.get_response(request)

        # Calculate duration
        duration = timezone.now() - start_time

        # Log response
        self.log_response(request, response, duration)

        return response

    def log_request(self, request):
        """Log incoming request details with sensitive data masking"""
        data = {
            'timestamp': timezone.now().isoformat(),
            'method': request.method,
            'path': request.path,
            'ip': self.get_client_ip(request),
            'user_id': request.user.id if request.user.is_authenticated else None,
            'user_agent': request.META.get('HTTP_USER_AGENT', ''),
            'referer': request.META.get('HTTP_REFERER', ''),
        }

        # Only log request body for specific endpoints and mask sensitive data
        if request.path.startswith('/api/'):
            body = self._get_masked_request_body(request)
            if body:
                data['body'] = body

        logger.info(f"Request: {json.dumps(data)}")

    def log_response(self, request, response, duration):
        """Log response details without sensitive information"""
        data = {
            'timestamp': timezone.now().isoformat(),
            'path': request.path,
            'status_code': response.status_code,
            'duration_ms': duration.total_seconds() * 1000,
            'ip': self.get_client_ip(request),
        }

        # Log at appropriate level based on status code
        if response.status_code >= 500:
            logger.error(f"Response: {json.dumps(data)}")
        elif response.status_code >= 400:
            logger.warning(f"Response: {json.dumps(data)}")
        else:
            logger.info(f"Response: {json.dumps(data)}")

    def get_client_ip(self, request):
        """Get client IP, handling proxies securely"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            # Return the first IP in the chain
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR')

    def _get_masked_request_body(self, request):
        """Get request body with sensitive data masked"""
        try:
            if not request.body:
                return None

            body = json.loads(request.body)
            if isinstance(body, dict):
                return self._mask_sensitive_data(body)
            return body
        except json.JSONDecodeError:
            return None

    def _mask_sensitive_data(self, data: dict) -> dict:
        """Recursively mask sensitive data in dictionary"""
        masked_data = {}
        for key, value in data.items():
            if isinstance(value, dict):
                masked_data[key] = self._mask_sensitive_data(value)
            elif isinstance(key, str) and any(field in key.lower() for field in self.SENSITIVE_FIELDS):
                masked_data[key] = '*****'
            else:
                masked_data[key] = value
        return masked_data 