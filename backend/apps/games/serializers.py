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