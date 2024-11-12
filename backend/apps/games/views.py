# Backend/Apps/Games/views.py

from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Game, GameScore, GameProgress, GameConfig
from .serializers import (
    GameSerializer, 
    GameScoreSerializer, 
    GameProgressSerializer,
    GameConfigSerializer
)
from mindmodel.core.utils import APIResponse

@extend_schema(tags=['games'])
class GameViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing cognitive assessment games.
    """
    serializer_class = GameSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Game.objects.filter(is_active=True)

    @extend_schema(
        summary="List all available games",
        description="Returns a list of all active cognitive assessment games",
        responses={200: GameSerializer(many=True)},
        parameters=[
            OpenApiParameter(
                name='category',
                type=str,
                description='Filter games by category',
                required=False
            ),
        ]
    )
    def list(self, request, *args, **kwargs):
        """Get list of available games with optional category filter"""
        queryset = self.get_queryset()
        category = request.query_params.get('category')
        
        if category:
            queryset = queryset.filter(category=category)
            
        serializer = self.get_serializer(queryset, many=True)
        return APIResponse.success(
            data=serializer.data,
            message="Games retrieved successfully"
        )

    @extend_schema(
        summary="Record game score",
        description="Save a user's game score and performance data",
        request=GameScoreSerializer,
        responses={201: GameScoreSerializer}
    )
    @action(detail=True, methods=['post'])
    def record_score(self, request, pk=None):
        """Record user's game score and performance"""
        game = self.get_object()
        serializer = GameScoreSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(user=request.user, game=game)
            return APIResponse.success(
                data=serializer.data,
                message="Score recorded successfully",
                status_code=status.HTTP_201_CREATED
            )
            
        return APIResponse.error(
            message="Invalid score data",
            errors=serializer.errors
        )

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

class GameProgressViewSet(viewsets.ModelViewSet):
    """
    Handle game progress operations.
    """
    serializer_class = GameProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return GameProgress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class GameConfigView(viewsets.ReadOnlyModelViewSet):
    """
    View game configurations.
    """
    serializer_class = GameConfigSerializer
    queryset = GameConfig.objects.all()
    permission_classes = [IsAuthenticated]
