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
        
        # Initialize components if not present
        if 'components' not in schema:
            schema['components'] = {}
            schema['components'].update({
                'securitySchemes': {},
                'schemas': {},
                'responses': {}
            })

        # Update security schemes
        schema['components']['securitySchemes'].update(SECURITY_SCHEMAS)
        
        # Add validation rules to components
        schema['components']['schemas'].update({
            'ValidationRules': {
                'type': 'object',
                'properties': VALIDATION_RULES
            }
        })
        
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

        return schema