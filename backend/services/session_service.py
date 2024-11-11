from django.core.cache import cache
from datetime import datetime, timedelta
import json

class SessionService:
    @staticmethod
    def create_session(user_id: int, token: str):
        """Create new session"""
        session_data = {
            'user_id': user_id,
            'created_at': datetime.now().isoformat(),
            'last_activity': datetime.now().isoformat(),
            'ip_address': None,  # Will be set by middleware
            'user_agent': None,  # Will be set by middleware
        }
        
        # Store session data
        cache.set(f"session:{token}", json.dumps(session_data))
        
        # Add to user's active sessions
        active_sessions = cache.get(f"user_sessions:{user_id}", [])
        active_sessions.append(token)
        cache.set(f"user_sessions:{user_id}", active_sessions)
    
    @staticmethod
    def update_session(token: str, ip_address: str = None, user_agent: str = None):
        """Update session data"""
        session_data = cache.get(f"session:{token}")
        if session_data:
            data = json.loads(session_data)
            data['last_activity'] = datetime.now().isoformat()
            if ip_address:
                data['ip_address'] = ip_address
            if user_agent:
                data['user_agent'] = user_agent
            cache.set(f"session:{token}", json.dumps(data))
    
    @staticmethod
    def end_session(user_id: int, token: str):
        """End a specific session"""
        # Remove session data
        cache.delete(f"session:{token}")
        
        # Remove from user's active sessions
        active_sessions = cache.get(f"user_sessions:{user_id}", [])
        if token in active_sessions:
            active_sessions.remove(token)
            cache.set(f"user_sessions:{user_id}", active_sessions)
    
    @staticmethod
    def end_all_sessions(user_id: int):
        """End all sessions for a user"""
        active_sessions = cache.get(f"user_sessions:{user_id}", [])
        for token in active_sessions:
            cache.delete(f"session:{token}")
        cache.delete(f"user_sessions:{user_id}") 