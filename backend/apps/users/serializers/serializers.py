from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('email', 'username', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class EmailChangeSerializer(serializers.Serializer):
    new_email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        token['is_staff'] = user.is_staff
        
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add extra responses
        data['email'] = self.user.email
        data['username'] = self.user.username
        data['is_staff'] = self.user.is_staff
        
        return data
