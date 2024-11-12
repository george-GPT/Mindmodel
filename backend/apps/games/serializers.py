from rest_framework import serializers
from .models import Game, GameScore, GameProgress, GameConfig

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
        fields = ['id', 'user', 'game', 'score', 'completion_time', 'created_at']
        read_only_fields = ['user', 'created_at']

class GameProgressSerializer(serializers.ModelSerializer):
    """
    Serializer for GameProgress model to track user progress.
    """
    class Meta:
        model = GameProgress
        fields = ['id', 'user', 'game', 'status', 'current_level', 'last_played', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']

class GameConfigSerializer(serializers.ModelSerializer):
    """
    Serializer for GameConfig model to handle game settings.
    """
    class Meta:
        model = GameConfig
        fields = ['id', 'game', 'difficulty', 'settings', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']