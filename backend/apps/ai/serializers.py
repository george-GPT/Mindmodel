# Backend/apps/ai/serializers.py

from rest_framework import serializers
from .models import Analysis

class AnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analysis
        fields = [
            'id', 'data', 'results', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class AggregateDataSerializer(serializers.Serializer):
    survey_data = serializers.JSONField(required=False)
    game_data = serializers.JSONField(required=False)
    
    def validate(self, data):
        if not data.get('survey_data') and not data.get('game_data'):
            raise serializers.ValidationError(
                "At least one of survey_data or game_data must be provided"
            )
        return data
