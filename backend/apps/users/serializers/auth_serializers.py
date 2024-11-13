from rest_framework import serializers
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema_serializer, OpenApiExample

User = get_user_model()

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Email Token Request',
            value={
                'email': 'user@example.com',
                'password': 'Password123!'
            }
        )
    ]
)
class EmailTokenObtainPairSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    class Meta:
        ref_name = "EmailTokenObtainPairRequest"

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Token Response',
            value={
                'access': 'eyJ0....',
                'refresh': 'eyJ1....',
                'user': {
                    'id': 1,
                    'email': 'user@example.com',
                    'username': 'user',
                    'is_verified': True
                }
            }
        )
    ]
)
class TokenResponseSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = UserSerializer()
    
    class Meta:
        ref_name = "TokenResponse"

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'is_verified', 'is_member', 'profile_complete', 'created_at', 'updated_at')
        read_only_fields = ('id', 'is_verified', 'is_member', 'created_at', 'updated_at')

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Password Change Request',
            value={
                'old_password': 'currentPass123!',
                'new_password': 'newPass123!'
            }
        )
    ]
)
class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    class Meta:
        ref_name = "PasswordChangeRequest"

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Email Change Request',
            value={
                'new_email': 'new@example.com',
                'password': 'currentPass123!'
            }
        )
    ]
)
class EmailChangeSerializer(serializers.Serializer):
    new_email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)

    def validate_new_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use")
        return value

    class Meta:
        ref_name = "EmailChangeRequest"

class SocialAuthSerializer(serializers.Serializer):
    token = serializers.CharField()
    provider = serializers.ChoiceField(choices=['google', 'apple'])