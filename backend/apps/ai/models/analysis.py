from django.db import models
from django.conf import settings
from django.core.cache import cache
from datetime import datetime

class Analysis(models.Model):
    """
    Stores AI analysis results for user survey responses and game performance.
    Follows security and response structure standards from auth documentation.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='analyses'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Analysis Status
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed')
    ]
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    
    # Analysis Data
    survey_data = models.JSONField(null=True, blank=True)
    game_data = models.JSONField(null=True, blank=True)
    analysis_results = models.JSONField(null=True, blank=True)
    
    # Error tracking
    error_message = models.TextField(null=True, blank=True)
    
    class Meta:
        verbose_name_plural = 'analyses'
        ordering = ['-created_at']
        
    def __str__(self):
        return f"Analysis for {self.user.username} - {self.created_at.isoformat()}"
    
    def get_cached_results(self):
        """Get cached analysis results or None"""
        cache_key = f"analysis_results:{self.id}"
        return cache.get(cache_key)
    
    def cache_results(self, results: dict):
        """Cache analysis results"""
        cache_key = f"analysis_results:{self.id}"
        cache.set(cache_key, results, timeout=3600)  # Cache for 1 hour
        
    def to_response_format(self) -> dict:
        """
        Convert to standardized response format following auth documentation
        """
        return {
            "success": self.status == 'completed',
            "message": "Analysis results retrieved successfully" if self.status == 'completed' else "Analysis pending",
            "error": {
                "message": self.error_message,
                "code": "analysis_failed",
                "field": None
            } if self.status == 'failed' else None,
            "data": {
                "id": self.id,
                "status": self.status,
                "created_at": self.created_at.isoformat(),
                "updated_at": self.updated_at.isoformat(),
                "results": self.analysis_results if self.status == 'completed' else None
            }
        } 