from rest_framework import serializers
from .models import Game, GameScore, GameProgress, GameConfig

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = [
            'id', 'title', 'description', 'config',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class GameScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameScore
        fields = [
            'id', 'game', 'score', 'metadata',
            'completed', 'played_at'
        ]
        read_only_fields = ['played_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class GameProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameProgress
        fields = [
            'id', 'game_id', 'current_level', 'current_score',
            'time_spent', 'last_played', 'completed'
        ]
        read_only_fields = ['last_played']

class GameConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameConfig
        fields = [
            'id', 'game_id', 'title', 'description', 'instructions',
            'min_score', 'max_score', 'time_limit', 'difficulty',
            'category', 'required_for_completion'
        ] 