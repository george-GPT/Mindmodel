from django.core.cache import cache
from django.conf import settings
import json
from datetime import timedelta

class AIDataService:
    """
    Service to handle data collection and caching for AI analysis.
    Uses Redis for efficient data storage and retrieval.
    """
    
    @staticmethod
    def cache_completion_data(user_id: int, data_type: str, data: dict):
        """
        Cache survey or game completion data in Redis.
        """
        cache_key = f"user_{user_id}_{data_type}_data"
        existing_data = cache.get(cache_key, [])
        
        if isinstance(existing_data, str):
            existing_data = json.loads(existing_data)
        
        existing_data.append(data)
        cache.set(
            cache_key, 
            json.dumps(existing_data),
            timeout=86400  # 24 hours
        )

    @staticmethod
    def get_user_data(user_id: int) -> dict:
        """
        Retrieve all cached user data for AI analysis.
        """
        survey_data = cache.get(f"user_{user_id}_survey_data", [])
        game_data = cache.get(f"user_{user_id}_game_data", [])
        
        if isinstance(survey_data, str):
            survey_data = json.loads(survey_data)
        if isinstance(game_data, str):
            game_data = json.loads(game_data)
            
        return {
            'survey_data': survey_data,
            'game_data': game_data
        }

    @staticmethod
    def clear_user_cache(user_id: int):
        """
        Clear cached data after successful analysis.
        """
        cache.delete(f"user_{user_id}_survey_data")
        cache.delete(f"user_{user_id}_game_data") 