from django.core.cache import cache
from django.conf import settings
from datetime import datetime, timedelta
import ipaddress

class SecurityService:
    BLOCKED_IPS_KEY = "blocked_ips"
    SUSPICIOUS_IPS_KEY = "suspicious_ips"
    
    @classmethod
    def is_ip_blocked(cls, ip: str) -> bool:
        """Check if IP is blocked"""
        # Check if IP is in blocked list
        blocked_ips = cache.get(cls.BLOCKED_IPS_KEY, {})
        return ip in blocked_ips
    
    @classmethod
    def block_ip(cls, ip: str, duration_hours: int = 24):
        """Block an IP address"""
        blocked_ips = cache.get(cls.BLOCKED_IPS_KEY, {})
        blocked_ips[ip] = {
            'blocked_at': datetime.now().isoformat(),
            'expires_at': (datetime.now() + timedelta(hours=duration_hours)).isoformat()
        }
        cache.set(cls.BLOCKED_IPS_KEY, blocked_ips)
    
    @classmethod
    def record_failed_attempt(cls, ip: str):
        """Record failed login attempt"""
        suspicious_ips = cache.get(cls.SUSPICIOUS_IPS_KEY, {})
        
        if ip not in suspicious_ips:
            suspicious_ips[ip] = {
                'attempts': 1,
                'first_attempt': datetime.now().isoformat()
            }
        else:
            suspicious_ips[ip]['attempts'] += 1
            
            # Check if should be blocked
            if suspicious_ips[ip]['attempts'] >= settings.MAX_FAILED_ATTEMPTS:
                cls.block_ip(ip)
                del suspicious_ips[ip]  # Remove from suspicious list
        
        cache.set(cls.SUSPICIOUS_IPS_KEY, suspicious_ips)
    
    @classmethod
    def is_valid_ip(cls, ip: str) -> bool:
        """Validate IP address"""
        try:
            ipaddress.ip_address(ip)
            return True
        except ValueError:
            return False 