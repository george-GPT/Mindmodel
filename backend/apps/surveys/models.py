# Backend/Apps/Surveys/models.py

from django.db import models
from django.conf import settings
from django.utils import timezone

class Survey(models.Model):
    """
    Model for storing survey information.
    """
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    questions = models.JSONField()  # Stores survey questions structure
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'Surveys'  # Changed from 'Apps.Surveys'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return self.title

class SurveyResponse(models.Model):
    """
    Model for storing user survey submissions.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='survey_responses'
    )
    survey = models.ForeignKey('Surveys.Survey', on_delete=models.CASCADE)  # Fixed reference
    responses = models.JSONField()  # Stores user's answers
    completed = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'Surveys'  # Changed from 'Apps.Surveys'
        ordering = ['-submitted_at']
        indexes = [
            models.Index(fields=['user', 'survey']),
            models.Index(fields=['completed']),
        ]
        unique_together = ['user', 'survey']

    def __str__(self):
        return f"{self.user.username}'s submission for {self.survey.title}"
