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
        
        for status_code, response in responses.items():
            if 'content' not in response or 'application/json' not in response['content']:
                continue

            content = response['content']['application/json']
            if 'schema' not in content:
                continue

            status_code = int(status_code)
            if status_code >= 400:
                content['schema'] = {'$ref': '#/components/schemas/ErrorResponse'}
            else:
                # Handle pagination for list views
                if hasattr(self.view, 'pagination_class') and self.method.lower() == 'get':
                    content['schema'] = {
                        'allOf': [
                            {'$ref': '#/components/schemas/SuccessResponse'},
                            {
                                'type': 'object',
                                'properties': {
                                    'data': {
                                        'allOf': [
                                            {'$ref': '#/components/schemas/PaginatedList'},
                                            {
                                                'type': 'object',
                                                'properties': {
                                                    'items': {
                                                        'type': 'array',
                                                        'items': content['schema']
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        ]
                    }
                else:
                    # Standard response wrapping
                    schema = content['schema']
                    if isinstance(schema, dict) and '$ref' in schema:
                        model_ref = schema['$ref']
                    else:
                        model_ref = schema

                    content['schema'] = {
                        'allOf': [
                            {'$ref': '#/components/schemas/SuccessResponse'},
                            {
                                'type': 'object',
                                'properties': {
                                    'data': model_ref
                                }
                            }
                        ]
                    }
        
        return responses

    def get_security_schemes(self):
        """Define security schemes for the API"""
        return {
            'jwtAuth': {
                'type': 'http',
                'scheme': 'bearer',
                'bearerFormat': 'JWT',
                'description': 'JWT token authentication. Format: Bearer <token>'
            },
            'cookieAuth': {
                'type': 'apiKey',
                'in': 'cookie',
                'name': 'sessionid',
                'description': 'Session cookie authentication'
            }
        }

    def get_components(self):
        """Add schemas with enums and required fields"""
        schema = super().get_components()
        
        # Add base schemas
        schema['components']['schemas'].update({
            'BaseResponse': {
                'type': 'object',
                'properties': {
                    'success': {'type': 'boolean'},
                    'message': {'type': 'string'}
                },
                'required': ['success', 'message']
            },
            'SuccessResponse': {
                'allOf': [
                    {'$ref': '#/components/schemas/BaseResponse'},
                    {
                        'type': 'object',
                        'properties': {
                            'success': {'const': True},
                            'data': {
                                'type': 'object',
                                'additionalProperties': True
                            }
                        }
                    }
                ]
            },
            'ApiError': {
                'type': 'object',
                'properties': {
                    'code': {
                        'type': 'string',
                        'enum': [
                            'validation_error',
                            'authentication_error',
                            'permission_denied',
                            'not_found',
                            'server_error',
                            'rate_limit_exceeded',
                            'token_invalid',
                            'email_not_verified',
                            'password_history',
                            'duplicate_email'
                        ]
                    },
                    'message': {'type': 'string'},
                    'details': {
                        'type': 'object',
                        'additionalProperties': True
                    }
                },
                'required': ['code', 'message']
            },
            'ErrorResponse': {
                'allOf': [
                    {'$ref': '#/components/schemas/BaseResponse'},
                    {
                        'type': 'object',
                        'properties': {
                            'success': {'const': False},
                            'error': {'$ref': '#/components/schemas/ApiError'}
                        }
                    }
                ]
            }
        })
        
        # Add paginated list schema
        schema['components']['schemas']['PaginatedList'] = {
            'type': 'object',
            'properties': {
                'items': {
                    'type': 'array',
                    'items': {
                        '$ref': '#/components/schemas/[ModelName]'
                    }
                },
                'pagination': {
                    'type': 'object',
                    'properties': {
                        'count': {'type': 'integer'},
                        'next': {
                            'type': 'string',
                            'nullable': True,
                            'format': 'uri'
                        },
                        'previous': {
                            'type': 'string',
                            'nullable': True,
                            'format': 'uri'
                        }
                    },
                    'required': ['count']
                }
            },
            'required': ['items', 'pagination']
        }
        
        return schema

    def get_request_body_schema(self, serializer):
        """Ensure required fields in request schemas"""
        schema = super().get_request_body_schema(serializer)
        
        if isinstance(schema, dict):
            # Get required fields from serializer
            required_fields = []
            if hasattr(serializer, 'get_fields'):
                for field_name, field in serializer.get_fields().items():
                    if getattr(field, 'required', False):
                        required_fields.append(field_name)
            
            # Add required fields if present
            if required_fields and 'properties' in schema:
                schema['required'] = required_fields
        
        return schema

    def get_error_responses(self):
        """Get standard error responses"""
        return {
            400: {
                'description': 'Bad Request',
                'content': {
                    'application/json': {
                        'schema': {'$ref': '#/components/schemas/ErrorResponse'}
                    }
                }
            },
            401: {
                'description': 'Unauthorized',
                'content': {
                    'application/json': {
                        'schema': {'$ref': '#/components/schemas/ErrorResponse'}
                    }
                }
            },
            403: {
                'description': 'Permission Denied',
                'content': {
                    'application/json': {
                        'schema': {'$ref': '#/components/schemas/ErrorResponse'}
                    }
                }
            },
            429: {
                'description': 'Too Many Requests',
                'content': {
                    'application/json': {
                        'schema': {'$ref': '#/components/schemas/ErrorResponse'}
                    }
                }
            }
        }

    def get_operation_id(self):
        """Get unique operation ID"""
        method = self.method.lower()
        
        # Get method name if available
        method_name = getattr(getattr(self.view, method, None), '__name__', method)
        
        # Clean view name
        view_name = self.view.__class__.__name__.replace('ViewSet', '').replace('View', '')
        
        return f"{view_name}_{method_name}"

    def get_path_parameters(self):
        """Get standardized path parameters"""
        parameters = super().get_path_parameters()
        
        # Enhance ID parameter definitions
        for param in parameters:
            if param['name'] == 'id':
                param.update({
                    'schema': {
                        'type': 'integer',
                        'format': 'int64',
                        'minimum': 1
                    },
                    'description': f'Unique identifier for this {self.view.__class__.__name__.lower().replace("viewset", "").replace("view", "")}'
                })
            elif param['name'] == 'uuid':
                param.update({
                    'schema': {
                        'type': 'string',
                        'format': 'uuid'
                    },
                    'description': f'Unique UUID for this {self.view.__class__.__name__.lower().replace("viewset", "").replace("view", "")}'
                })
        
        return parameters

    def get_pagination_parameters(self):
        """Get standardized pagination parameters"""
        return [
            {
                'name': 'page',
                'in': 'query',
                'required': False,
                'description': 'Page number within the paginated result set.',
                'schema': {
                    'type': 'integer',
                    'minimum': 1,
                    'default': 1
                }
            },
            {
                'name': 'page_size',
                'in': 'query',
                'required': False,
                'description': 'Number of results to return per page.',
                'schema': {
                    'type': 'integer',
                    'minimum': 1,
                    'maximum': 100,
                    'default': 10
                }
            }
        ]

    def get_operation(self, path, path_regex, method, registry):
        """Add enhanced parameters to operations"""
        operation = super().get_operation(path, path_regex, method, registry)
        
        # Add pagination parameters to list operations
        if method.lower() == 'get' and hasattr(self.view, 'pagination_class'):
            operation.setdefault('parameters', []).extend(self.get_pagination_parameters())
        
        # Enhance existing parameters
        if 'parameters' in operation:
            operation['parameters'] = [
                param if param.get('name') not in ['id', 'uuid']
                else next(p for p in self.get_path_parameters() if p['name'] == param['name'])
                for param in operation['parameters']
            ]
        
        return operation

def process_endpoints(endpoints):
    """Process endpoints before schema generation"""
    for (path, path_regex, method, callback) in endpoints:
        if hasattr(callback, 'initkwargs'):
            view = callback.initkwargs.get('view')
            if view:
                # Get the actual method function name
                method_name = getattr(getattr(view, method.lower(), None), '__name__', '')
                
                # Generate a descriptive operation ID
                view_name = view.__class__.__name__.replace('ViewSet', '').replace('View', '')
                operation = method_name.replace('_', '-')
                
                # Format: UserProfile_update or Game_record_score
                callback.initkwargs['operation_id'] = f"{view_name}_{operation}"
                
                # Add standard error responses based on auth requirements
                if getattr(view, 'authentication_classes', None):
                    callback.initkwargs['responses'] = {
                        401: {'$ref': '#/components/schemas/ErrorResponse'},
                        403: {'$ref': '#/components/schemas/ErrorResponse'}
                    }
                
                # Add rate limit responses for sensitive endpoints
                if method in ['POST', 'PUT', 'PATCH', 'DELETE']:
                    callback.initkwargs.setdefault('responses', {}).update({
                        429: {'$ref': '#/components/schemas/ErrorResponse'}
                    })
    
    return endpoints

def process_schema(result):
    """Process schema after generation"""
    if 'paths' in result:
        for path in result['paths'].values():
            for operation in path.values():
                # Remove empty security array
                if 'security' in operation and {} in operation['security']:
                    operation['security'].remove({})
                
                # Add default security if not specified
                if 'security' not in operation:
                    operation['security'] = [
                        {'jwtAuth': []},
                        {'cookieAuth': []}
                    ]
                
                # Remove redundant error responses
                for status_code in ['400', '401', '403', '429']:
                    if status_code in operation['responses']:
                        del operation['responses'][status_code]
                
                # Ensure consistent success response pattern
                for status_code, response in operation['responses'].items():
                    if status_code.startswith('2') and 'content' in response:
                        content = response['content'].get('application/json', {})
                        if 'schema' in content and '$ref' in content['schema']:
                            model_ref = content['schema']['$ref']
                            content['schema'] = {
                                'allOf': [
                                    {'$ref': '#/components/schemas/SuccessResponse'},
                                    {
                                        'type': 'object',
                                        'properties': {
                                            'data': {'$ref': model_ref}
                                        }
                                    }
                                ]
                            }
    
    # Remove unused schemas
    schemas_to_remove = [
        'Error401', 'Error403', 'Error429',
        'PatchedGameRequest', 'PatchedGameProgressRequest',
        'PatchedGameScoreRequest'
    ]
    if 'components' in result and 'schemas' in result['components']:
        for schema_name in schemas_to_remove:
            if schema_name in result['components']['schemas']:
                del result['components']['schemas'][schema_name]
    
    return result
