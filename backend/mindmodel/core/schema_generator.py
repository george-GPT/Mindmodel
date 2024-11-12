from drf_spectacular.generators import SchemaGenerator
from drf_spectacular.plumbing import build_basic_type
from mindmodel.docs.api_documentation import (
    ERROR_RESPONSES,
    VALIDATION_RULES,
    SECURITY_SCHEMAS
)

class MindmodelSchemaGenerator(SchemaGenerator):
    def get_schema(self, request=None, public=False):
        schema = super().get_schema(request, public)
        
        # Add security schemas
        schema['components']['securitySchemes'] = SECURITY_SCHEMAS
        
        # Add validation rules to components
        schema['components']['schemas']['ValidationRules'] = {
            'type': 'object',
            'properties': VALIDATION_RULES
        }
        
        # Add error responses to components
        schema['components']['responses'].update({
            'Error400': {
                'description': 'Validation Error',
                'content': {
                    'application/json': {
                        'schema': {
                            '$ref': '#/components/schemas/ErrorResponse'
                        }
                    }
                }
            },
            'Error401': {
                'description': 'Authentication Error',
                'content': {
                    'application/json': {
                        'schema': {
                            '$ref': '#/components/schemas/ErrorResponse'
                        }
                    }
                }
            },
            'Error403': {
                'description': 'Permission Error',
                'content': {
                    'application/json': {
                        'schema': {
                            '$ref': '#/components/schemas/ErrorResponse'
                        }
                    }
                }
            },
            'Error429': {
                'description': 'Rate Limit Error',
                'content': {
                    'application/json': {
                        'schema': {
                            '$ref': '#/components/schemas/ErrorResponse'
                        }
                    }
                }
            }
        })
        
        # Add standard schemas
        schema['components']['schemas'].update({
            'StandardResponse': {
                'type': 'object',
                'properties': {
                    'success': {'type': 'boolean'},
                    'message': {'type': 'string'},
                    'data': {'type': 'object'},
                    'metadata': {
                        'type': 'object',
                        'additionalProperties': True
                    }
                },
                'required': ['success', 'message']
            },
            'ErrorResponse': {
                'type': 'object',
                'properties': {
                    'success': {'type': 'boolean', 'default': False},
                    'message': {'type': 'string'},
                    'error': {
                        'type': 'object',
                        'properties': {
                            'code': {'type': 'string'},
                            'details': {'type': 'object'}
                        },
                        'required': ['code']
                    }
                },
                'required': ['success', 'message', 'error']
            }
        })
        
        return schema

    def get_operation(self, path, method, view):
        operation = super().get_operation(path, method, view)
        if operation and 'responses' in operation:
            # Add standard error responses
            operation['responses'].update({
                '401': {'$ref': '#/components/responses/Error401'},
                '429': {'$ref': '#/components/responses/Error429'}
            })
            
            # Wrap successful responses in standard format
            for status_code, response in operation['responses'].items():
                if status_code.startswith('2'):  # 2xx responses
                    if 'content' in response and 'application/json' in response['content']:
                        original_schema = response['content']['application/json']['schema']
                        response['content']['application/json']['schema'] = {
                            'allOf': [
                                {'$ref': '#/components/schemas/StandardResponse'},
                                {
                                    'type': 'object',
                                    'properties': {
                                        'data': original_schema
                                    }
                                }
                            ]
                        }
        
        return operation