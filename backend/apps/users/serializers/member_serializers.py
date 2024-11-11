# Backend/apps/users/member_serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..models import MemberProfile
from ..models import User

User = get_user_model()

class MemberRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for member registration.
    """
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'is_member')
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True},
            'is_member': {'read_only': True}
        }

    def validate(self, attrs):
        """
        Validate that both passwords match.
        """
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        """
        Create a new member user and associated MemberProfile.
        """
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_member=False  # Default to false, can be updated later
        )
        # Create an associated MemberProfile
        MemberProfile.objects.create(user=user)
        return user

class MemberProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for MemberProfile.
    """
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = MemberProfile
        fields = ['bio', 'profile_picture', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def update(self, instance, validated_data):
        """
        Update MemberProfile instance.
        """
        instance.bio = validated_data.get('bio', instance.bio)
        profile_picture = validated_data.get('profile_picture', None)
        if profile_picture:
            instance.profile_picture = profile_picture
        instance.save()
        return instance

class SurveyProgressSerializer(serializers.Serializer):
    """
    Serializer to represent survey progress.
    """
    completed_surveys = serializers.ListField(child=serializers.CharField())

class GameProgressSerializer(serializers.Serializer):
    """
    Serializer to represent game progress.
    """
    completed_games = serializers.ListField(child=serializers.CharField())
