# Backend/Apps/Games/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    GameView, 
    GameDetailView, 
    GameScoreView,
    GameProgressViewSet,
    GameConfigView
)

app_name = 'games'

# Create a router for viewsets
router = DefaultRouter()
router.register(r'progress', GameProgressViewSet, basename='game-progress')
router.register(r'config', GameConfigView, basename='game-config')

urlpatterns = [
    path('', GameView.as_view(), name='game-list'),
    path('<int:pk>/', GameDetailView.as_view(), name='game-detail'),
    path('scores/', GameScoreView.as_view(), name='game-scores'),
    path('', include(router.urls)),  # Include viewset URLs
]
