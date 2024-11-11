"""
OpenAPI schema customization for clean frontend integration.
"""
from drf_spectacular.extensions import OpenApiAuthenticationExtension
from drf_spectacular.hooks import preprocess_schema, postprocess_schema
from drf_spectacular.openapi import AutoSchema
from drf_spectacular.utils import OpenApiExample
from typing import Dict, Any

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

@preprocess_schema
def preprocess_schema_hook(endpoints: list, **kwargs) -> list:
    """Clean up schema before generation"""
    for (path, path_regex, method, callback) in endpoints:
        # Add operation IDs for better frontend integration
        if hasattr(callback, 'initkwargs'):
            view = callback.initkwargs.get('view')
            if view:
                method_name = getattr(getattr(view, method.lower(), None), '__name__', '')
                callback.initkwargs['operation_id'] = f"{view.__class__.__name__}_{method_name}"
    return endpoints

@postprocess_schema
def postprocess_schema_hook(result: Dict[str, Any], **kwargs) -> Dict[str, Any]:
    """Enhance schema after generation"""
    # Add common responses
    common_responses = {
        '401': {
            'description': 'Authentication failed',
            'content': {
                'application/json': {
                    'schema': {
                        'type': 'object',
                        'properties': {
                            'success': {'type': 'boolean', 'default': False},
                            'message': {'type': 'string'},
                            'error': {
                                'type': 'object',
                                'properties': {
                                    'code': {'type': 'string'},
                                    'details': {'type': 'object'}
                                }
                            }
                        }
                    },
                    'examples': {
                        'token_expired': {
                            'value': {
                                'success': False,
                                'message': 'Token has expired',
                                'error': {
                                    'code': 'token_expired',
                                    'details': None
                                }
                            }
                        }
                    }
                }
            }
        },
        '429': {
            'description': 'Rate limit exceeded',
            'content': {
                'application/json': {
                    'schema': {
                        'type': 'object',
                        'properties': {
                            'success': {'type': 'boolean', 'default': False},
                            'message': {'type': 'string'},
                            'error': {
                                'type': 'object',
                                'properties': {
                                    'code': {'type': 'string'},
                                    'details': {'type': 'object'}
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    # Add common responses to all operations
    for path in result['paths'].values():
        for operation in path.values():
            operation['responses'].update(common_responses)

    return result 