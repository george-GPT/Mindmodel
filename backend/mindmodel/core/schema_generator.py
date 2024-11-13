from drf_spectacular.generators import SchemaGenerator
from apps.users.serializers.auth_serializers import (
    EmailTokenObtainPairSerializer,
    UserSerializer,
    PasswordChangeSerializer,
    EmailChangeSerializer,
    SocialAuthSerializer
)

class MindmodelSchemaGenerator(SchemaGenerator):
    def get_schema(self, request=None, public=False):
        schema = super().get_schema(request, public)
        
        # Add auth-specific schemas
        if 'components' not in schema:
            schema['components'] = {}
            
        if 'schemas' not in schema['components']:
            schema['components']['schemas'] = {}
            
        # Use all auth serializers with proper ref_names
        schema['components']['schemas'].update({
            'PasswordChangeRequest': {
                'type': 'object',
                'properties': {
                    'old_password': {'type': 'string'},
                    'new_password': {'type': 'string'}
                },
                'required': ['old_password', 'new_password']
            },
            'EmailChangeRequest': {
                'type': 'object',
                'properties': {
                    'new_email': {'type': 'string', 'format': 'email'},
                    'password': {'type': 'string'}
                },
                'required': ['new_email', 'password']
            },
            'VerificationRequest': {
                'type': 'object',
                'properties': {
                    'token': {'type': 'string'}
                },
                'required': ['token']
            },
            'ResendVerificationRequest': {
                'type': 'object',
                'properties': {
                    'email': {'type': 'string', 'format': 'email'}
                },
                'required': ['email']
            },
            'GoogleAuthRequest': {
                'type': 'object',
                'properties': {
                    'credential': {'type': 'string'}
                },
                'required': ['credential']
            }
        })
        
        return schema