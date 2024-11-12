from rest_framework import serializers
from .models import Game, GameScore, GameProgress, GameConfig
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets

class GameSerializer(serializers.ModelSerializer):
    """
    Serializer for Game model with complete game information.
    """
    class Meta:
        model = Game
        fields = '__all__'

class GameScoreSerializer(serializers.ModelSerializer):
    """
    Serializer for GameScore model to handle game results.
    """
    class Meta:
        model = GameScore
        fields = ['id', 'user', 'game', 'score', 'completion_time', 'metadata', 'completed', 'played_at']
        read_only_fields = ['user', 'played_at']

class GameProgressSerializer(serializers.ModelSerializer):
    """
    Serializer for GameProgress model to track user progress.
    """
    class Meta:
        model = GameProgress
        fields = ['id', 'user', 'game_id', 'current_level', 'current_score', 
                 'time_spent', 'last_played', 'completed']


class GameConfigSerializer(serializers.ModelSerializer):
    """
    Serializer for GameConfig model to handle game settings.
    """
    class Meta:
        model = GameConfig
        fields = ['id', 'game_id', 'title', 'description', 'instructions', 
                 'min_score', 'max_score', 'time_limit', 'difficulty', 
                 'category', 'required_for_completion']

@extend_schema(tags=['games'])
class GameProgressViewSet(viewsets.ModelViewSet):
    """
    Handle game progress operations.
    """
    @extend_schema(
        summary="List user's game progress",
        description="Returns the progress for all games for the authenticated user",
        responses={200: GameProgressSerializer(many=True)}
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        summary="Create game progress",
        description="Create a new game progress entry",
        request=GameProgressSerializer,
        responses={201: GameProgressSerializer}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @extend_schema(
        summary="Update game progress",
        description="Update an existing game progress entry",
        request=GameProgressSerializer,
        responses={200: GameProgressSerializer}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

@extend_schema(tags=['games'])
class GameConfigView(viewsets.ReadOnlyModelViewSet):
    """
    View game configurations.
    """
    @extend_schema(
        summary="List game configurations",
        description="Returns a list of all game configurations",
        responses={200: GameConfigSerializer(many=True)}
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        summary="Get game configuration",
        description="Returns details for a specific game configuration",
        responses={200: GameConfigSerializer}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)