from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import GameScore

@receiver(post_save, sender=GameScore)
def handle_game_completion(sender, instance, created, **kwargs):
    """Signal to handle game completion"""
    if created and instance.completed:
        # Add game completion logic here
        pass 