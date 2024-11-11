# Backend/Apps/Games/models.py

from django.db import models
from django.conf import settings
from django.utils import timezone

class Game(models.Model):
    """
    Model for game configuration and metadata.
    """
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    config = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'Games'
        ordering = ['title']
        indexes = [
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return self.title

class GameScore(models.Model):
    """
    Model for storing user game scores.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='game_scores'
    )
    game = models.ForeignKey(
        Game,
        on_delete=models.CASCADE,
        related_name='scores'
    )
    score = models.IntegerField(default=0)
    metadata = models.JSONField(null=True, blank=True)
    completed = models.BooleanField(default=False)
    played_at = models.DateTimeField(default=timezone.now)

    class Meta:
        app_label = 'Games'
        ordering = ['-played_at']
        indexes = [
            models.Index(fields=['user', 'game']),
            models.Index(fields=['completed']),
        ]

    def __str__(self):
        return f"{self.user.username}'s score for {self.game.title}"

class GameProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    game_id = models.CharField(max_length=100)
    current_level = models.IntegerField(default=1)
    current_score = models.IntegerField(default=0)
    time_spent = models.IntegerField(default=0)  # in seconds
    last_played = models.DateTimeField(auto_now=True)
    completed = models.BooleanField(default=False)

    class Meta:
        app_label = 'Games'
        unique_together = ('user', 'game_id')
        indexes = [
            models.Index(fields=['user', 'game_id']),
            models.Index(fields=['completed']),
        ]

class GameConfig(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]

    game_id = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    instructions = models.TextField()
    min_score = models.IntegerField(default=0)
    max_score = models.IntegerField()
    time_limit = models.IntegerField(null=True, blank=True)  # in seconds
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    category = models.CharField(max_length=100)
    required_for_completion = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    class Meta:
        app_label = 'Games'