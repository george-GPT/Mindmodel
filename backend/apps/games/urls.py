# Backend/Apps/Games/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    GameViewSet, 
    GameProgressViewSet,
    GameConfigView
)

app_name = 'games'

# Create a router for viewsets
router = DefaultRouter()
router.register(r'games', GameViewSet, basename='game')
router.register(r'progress', GameProgressViewSet, basename='game-progress')
router.register(r'config', GameConfigView, basename='game-config')

urlpatterns = [
    path('', include(router.urls)),  # Include all viewset URLs
]
