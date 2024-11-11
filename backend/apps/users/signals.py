# Backend/Apps/Users/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

User = get_user_model()

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Signal to handle user-related operations after save
    """
    if created:
        # Add any post-user creation logic here
        pass
