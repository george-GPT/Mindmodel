from drf_spectacular.generators import SchemaGenerator
from apps.docs.api_documentation import (
    AUTH_ENDPOINTS,
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
            'Error400': ERROR_RESPONSES['validation'],
            'Error401': ERROR_RESPONSES['auth'],
            'Error403': ERROR_RESPONSES['permission'],
            'Error429': ERROR_RESPONSES['auth']['rate_limit_exceeded']
        })
        
        return schema 