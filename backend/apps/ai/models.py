# Backend/apps/AI/models.py

from django.db import models
from django.conf import settings
from django.utils import timezone

class Analysis(models.Model):
    """
    Model for storing AI analysis results.
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='analyses'
    )
    data = models.JSONField(default=dict)
    results = models.JSONField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'AI_analysis'
        app_label = 'AI'
        ordering = ['-created_at']

    def __str__(self):
        return f"Analysis for {self.user.username} ({self.status})"

class AnalysisResult(models.Model):
    """
    Model for storing detailed analysis results.
    """
    analysis = models.ForeignKey(Analysis, on_delete=models.CASCADE, related_name='detailed_results')
    result_type = models.CharField(max_length=50)
    data = models.JSONField()
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'AI_analysisresult'
        app_label = 'AI'

class AnalysisTask(models.Model):
    """
    Model for storing analysis tasks.
    """
    analysis = models.ForeignKey('AI.Analysis', on_delete=models.CASCADE)
    status = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'AI_analysistask'
        app_label = 'AI'
