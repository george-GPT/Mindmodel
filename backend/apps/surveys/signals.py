from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import SurveyResponse

@receiver(post_save, sender=SurveyResponse)
def handle_survey_completion(sender, instance, created, **kwargs):
    """Signal to handle survey completion"""
    if created and instance.completed:
        # Add survey completion logic here
        pass 