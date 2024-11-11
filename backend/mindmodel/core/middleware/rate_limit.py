from django.core.cache import cache
from rest_framework.exceptions import Throttled
from django.conf import settings
from datetime import datetime, timedelta
import json

class RateLimitMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if self._should_throttle(request):
            self._check_rate_limit(request)
        return self.get_response(request)

    def _should_throttle(self, request) -> bool:
        """Determine if request should be throttled"""
        # Only throttle auth endpoints and POST requests
        return (
            request.path.startswith('/api/users/auth/') and 
            request.method == 'POST'
        )

    def _get_cache_key(self, request) -> str:
        """Generate cache key based on IP and user if authenticated"""
        ip = self._get_client_ip(request)
        user_id = request.user.id if request.user.is_authenticated else None
        
        if user_id:
            return f"rate_limit:user:{user_id}"
        return f"rate_limit:ip:{ip}"

    def _get_client_ip(self, request) -> str:
        """Get client IP, handling proxies"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')

    def _check_rate_limit(self, request):
        """Check and enforce rate limits with progressive delays"""
        key = self._get_cache_key(request)
        now = datetime.now().timestamp()
        window_size = 300  # 5 minutes in seconds

        # Get current attempts
        attempts = cache.get(key, [])
        
        # Clean old attempts
        attempts = [t for t in attempts if (now - t) < window_size]
        
        # Get limit based on user authentication
        limit = (
            settings.RATE_LIMIT_PER_USER 
            if request.user.is_authenticated 
            else settings.RATE_LIMIT_PER_IP
        )

        # Check if limit exceeded
        if len(attempts) >= limit:
            delay = self._get_progressive_delay(len(attempts))
            raise Throttled(
                detail={
                    "success": False,
                    "message": "Too many attempts",
                    "error": {
                        "message": f"Please try again in {delay} seconds",
                        "code": "rate_limit_exceeded",
                        "field": None
                    }
                }
            )

        # Add new attempt
        attempts.append(now)
        cache.set(key, attempts, window_size)

    def _get_progressive_delay(self, attempts: int) -> int:
        """Calculate progressive delay based on number of attempts"""
        if attempts < 5:
            return 300      # 5 minutes
        elif attempts < 10:
            return 900      # 15 minutes
        elif attempts < 15:
            return 3600     # 1 hour
        return 86400       # 24 hours 