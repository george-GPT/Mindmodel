"""
OpenAPI schema customization for clean frontend integration.
"""
from drf_spectacular.extensions import OpenApiAuthenticationExtension
from drf_spectacular.openapi import AutoSchema

class JWTScheme(OpenApiAuthenticationExtension):
    """Custom JWT auth scheme for Swagger"""
    target_class = 'rest_framework_simplejwt.authentication.JWTAuthentication'
    name = 'JWT'

    def get_security_definition(self, auto_schema):
        return {
            'type': 'http',
            'scheme': 'bearer',
            'bearerFormat': 'JWT',
            'description': 'JWT token authentication. Format: Bearer <token>'
        }

class MindmodelSchema(AutoSchema):
    """Custom schema class for standardized responses"""
    
    def get_response_schemas(self, response_serializers):
        """Wrap responses in standard format"""
        responses = super().get_response_schemas(response_serializers)
        
        for response in responses.values():
            if 'content' in response:
                content = response['content'].get('application/json', {})
                if 'schema' in content:
                    content['schema'] = {
                        'type': 'object',
                        'properties': {
                            'success': {'type': 'boolean'},
                            'message': {'type': 'string'},
                            'data': content['schema'],
                            'metadata': {
                                'type': 'object',
                                'additionalProperties': True
                            }
                        }
                    }
        return responses