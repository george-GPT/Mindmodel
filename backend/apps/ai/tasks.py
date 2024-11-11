# Backend/Apps/AI/tasks.py

from celery import shared_task
from celery.utils.log import get_task_logger
from django.core.cache import cache
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import AnalysisResult
from .ai_models.cogGPT import perform_analysis
import json
from django.db import transaction
from celery.exceptions import SoftTimeLimitExceeded

logger = get_task_logger(__name__)
channel_layer = get_channel_layer()

def cleanup_analysis(user_id: int) -> None:
    """Clean up failed analysis data."""
    cache_key = f"analysis_data_{user_id}"
    cache.delete(cache_key)
    
    # Update any processing analysis to failed
    AnalysisResult.objects.filter(
        user_id=user_id,
        status='PROCESSING'
    ).update(status='FAILED')

@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=60,  # 1 minute between retries
    time_limit=300,  # 5 minutes max
    soft_time_limit=240,  # 4 minutes soft limit
    acks_late=True  # Only acknowledge after successful completion
)
def perform_ai_analysis(self, user_id: int, data: dict) -> int:
    """
    Perform AI analysis asynchronously with enhanced error handling and timeouts.
    """
    logger.info(f"Starting analysis for user {user_id}")
    
    try:
        with transaction.atomic():  # Use transaction for atomicity
            # Create analysis result record
            analysis_result = AnalysisResult.objects.create(
                user_id=user_id,
                status='PROCESSING',
                metadata={'task_id': self.request.id}
            )

            # Cache key with timeout
            cache_key = f"analysis_data_{user_id}"
            cache.set(cache_key, json.dumps(data), timeout=3600)  # 1 hour timeout

            try:
                # Perform analysis with timeout protection
                analysis_output = perform_analysis(data)
                
                # Update result
                analysis_result.status = 'COMPLETED'
                analysis_result.insights = analysis_output['insights']
                analysis_result.charts = analysis_output['charts']
                analysis_result.save()

                # Send WebSocket notification
                async_to_sync(channel_layer.group_send)(
                    f'analysis_{self.request.id}',
                    {
                        'type': 'analysis_update',
                        'data': {
                            'status': 'completed',
                            'result_id': analysis_result.id
                        }
                    }
                )

                # Cleanup
                cache.delete(cache_key)
                return analysis_result.id

            except Exception as e:
                logger.error(f"Analysis failed: {str(e)}")
                analysis_result.status = 'FAILED'
                analysis_result.metadata = {
                    'error': str(e),
                    'task_id': self.request.id
                }
                analysis_result.save()

                # Send failure notification
                async_to_sync(channel_layer.group_send)(
                    f'analysis_{self.request.id}',
                    {
                        'type': 'analysis_update',
                        'data': {
                            'status': 'failed',
                            'error': str(e)
                        }
                    }
                )

                if self.request.retries < self.max_retries:
                    raise self.retry(exc=e)
                raise

    except SoftTimeLimitExceeded:
        logger.error("Task timed out")
        # Clean up and mark as failed
        cleanup_analysis(user_id)
        raise
    except Exception as e:
        logger.error(f"Task failed: {str(e)}")
        cleanup_analysis(user_id)
        raise

@shared_task
def cleanup_old_analyses():
    """
    Periodic task to clean up old analyses and cached data.
    Runs daily to prevent data accumulation.
    """
    from django.utils import timezone
    from datetime import timedelta
    
    # Delete analyses older than 30 days
    threshold = timezone.now() - timedelta(days=30)
    AnalysisResult.objects.filter(created_at__lt=threshold).delete()
