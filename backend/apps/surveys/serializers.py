from rest_framework import serializers
from .models import Survey, SurveyResponse

class SurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = Survey
        fields = [
            'id', 'title', 'description', 'questions',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class SurveyResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurveyResponse
        fields = [
            'id', 'survey', 'responses', 'completed',
            'submitted_at', 'updated_at'
        ]
        read_only_fields = ['submitted_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data) 