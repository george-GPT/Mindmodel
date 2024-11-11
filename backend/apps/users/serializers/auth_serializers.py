from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'is_member', 
            'is_verified', 'profile_complete', 'meta',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'is_member', 'is_verified')

class SocialAuthSerializer(serializers.Serializer):
    token = serializers.CharField()
    provider = serializers.ChoiceField(choices=['google', 'apple'])