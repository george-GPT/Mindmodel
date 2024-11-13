from drf_spectacular.utils import OpenApiExample

# Auth Response Examples
AUTH_EXAMPLES = {
    "login": OpenApiExample(
        "Login Success",
        value={
            "success": True,
            "data": {
                "access": "eyJ0...",
                "refresh": "eyJ1...",
                "user": {
                    "id": 1,
                    "email": "user@example.com",
                    "username": "user",
                    "is_verified": True,
                    "is_member": False,
                    "profile_complete": True,
                    "created_at": "2024-01-01T00:00:00Z",
                    "updated_at": "2024-01-01T00:00:00Z"
                }
            }
        }
    ),
    "password_change": OpenApiExample(
        "Password Change",
        value={
            "old_password": "currentPass123!",
            "new_password": "newPass123!"
        }
    ),
    "email_change": OpenApiExample(
        "Email Change",
        value={
            "new_email": "new@example.com",
            "password": "currentPass123!"
        }
    ),
    "verification": OpenApiExample(
        "Email Verification",
        value={
            "token": "verification-token"
        }
    ),
    "google_auth": OpenApiExample(
        "Google Auth",
        value={
            "credential": "google-oauth2-token"
        }
    ),
    "register_success": OpenApiExample(
        "Register Success",
        value={
            "success": True,
            "data": {
                "user": {
                    "id": 1,
                    "email": "user@example.com",
                    "username": "user",
                    "is_verified": False,
                    "is_member": False,
                    "profile_complete": False,
                    "created_at": "2024-01-01T00:00:00Z",
                    "updated_at": "2024-01-01T00:00:00Z"
                },
                "message": "Registration successful. Please verify your email."
            }
        }
    ),
    "verification_success": OpenApiExample(
        "Email Verification Success",
        value={
            "success": True,
            "data": {
                "message": "Email verified successfully"
            }
        }
    ),
    "resend_verification": OpenApiExample(
        "Resend Verification",
        value={
            "email": "user@example.com"
        }
    ),
    "token_refresh": OpenApiExample(
        "Token Refresh",
        value={
            "refresh": "eyJ0...",
            "access": "eyJ1..."
        }
    ),
    "profile_update": OpenApiExample(
        "Profile Update",
        value={
            "username": "newusername",
            "email": "newemail@example.com"
        }
    ),
    "auth_error": OpenApiExample(
        "Authentication Error",
        value={
            "success": False,
            "error": {
                "code": "invalid_credentials",
                "details": {"message": "Invalid email or password"}
            }
        }
    ),
    "email_verification_success": OpenApiExample(
        "Email Verification Success",
        value={
            "success": True,
            "data": {
                "message": "Email verified successfully"
            }
        }
    ),
    "password_change_success": OpenApiExample(
        "Password Change Success",
        value={
            "success": True,
            "data": {
                "message": "Password changed successfully"
            }
        }
    )
}

# Validation Rules (matching frontend)
VALIDATION_RULES = {
    "password": {
        "min_length": 8,
        "max_length": 128,
        "pattern": r"^(?=.*[0-9])(?=.*[!@#$%^&*])",
        "description": "Must contain at least one number and one special character"
    },
    "username": {
        "min_length": 3,
        "max_length": 30,
        "pattern": r"^[a-zA-Z0-9_-]*$",
        "description": "Letters, numbers, underscores, and hyphens only"
    },
    "email": {
        "max_length": 255,
        "pattern": r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
        "description": "Valid email format required"
    }
}

# Error Response Schema
ERROR_RESPONSES = {
    "auth": {
        "invalid_credentials": {
            "code": "invalid_credentials",
            "message": "Invalid email or password",
            "status": 401,
            "example": {
                "success": False,
                "error": {
                    "code": "invalid_credentials",
                    "details": {"message": "Invalid email or password"}
                }
            }
        },
        "token_invalid": {
            "code": "token_invalid",
            "message": "Token is invalid or expired",
            "status": 401
        },
        "email_not_verified": {
            "code": "email_not_verified",
            "message": "Email not verified",
            "status": 403
        },
        "email_already_verified": {
            "code": "email_already_verified",
            "status": 400,
            "example": {
                "success": False,
                "error": {
                    "code": "email_already_verified",
                    "details": {"message": "Email is already verified"}
                }
            }
        },
        "password_history": {
            "code": "password_history",
            "status": 400,
            "example": {
                "success": False,
                "error": {
                    "code": "password_history",
                    "details": {"message": "Password was used recently"}
                }
            }
        }
    },
    "validation": {
        "password": {
            "code": "validation_error",
            "message": "Password validation failed",
            "status": 400,
            "example": {
                "success": False,
                "error": {
                    "code": "validation_error",
                    "details": {
                        "password": [
                            "Must be at least 8 characters",
                            "Must contain at least one number",
                            "Must contain at least one special character"
                        ]
                    }
                }
            }
        }
    }
}

# Security Schemas
SECURITY_SCHEMAS = {
    "Bearer": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
    }
}

# Add AUTH_ENDPOINTS mapping
AUTH_ENDPOINTS = {
    'login': {
        'method': 'POST',
        'path': '/api/users/auth/login/',
        'description': 'Login with email and password',
        'request_example': AUTH_EXAMPLES['login'],
        'error_responses': {
            '400': ERROR_RESPONSES['validation']['password_invalid'],
            '401': ERROR_RESPONSES['auth']['invalid_credentials'],
            '429': ERROR_RESPONSES['auth']['rate_limit']
        }
    },
    'register': {
        'method': 'POST',
        'path': '/api/users/auth/register/',
        'description': 'Register new user',
        'request_example': AUTH_EXAMPLES['register'],
        'error_responses': {
            '400': ERROR_RESPONSES['validation']
        }
    },
    'verify_email': {
        'method': 'POST',
        'path': '/api/users/auth/verify-email/',
        'description': 'Verify email with token',
        'request_example': AUTH_EXAMPLES['verification'],
        'error_responses': {
            '400': ERROR_RESPONSES['validation'],
            '401': ERROR_RESPONSES['auth']['token_invalid']
        }
    },
    'resend_verification': {
        'method': 'POST',
        'path': '/api/users/auth/resend-verification/',
        'description': 'Resend verification email',
        'request_example': AUTH_EXAMPLES['resend_verification'],
        'error_responses': {
            '400': ERROR_RESPONSES['validation'],
            '429': ERROR_RESPONSES['auth']['rate_limit']
        }
    },
    'change_password': {
        'method': 'POST',
        'path': '/api/users/auth/change-password/',
        'description': 'Change user password',
        'request_example': AUTH_EXAMPLES['password_change'],
        'error_responses': {
            '400': ERROR_RESPONSES['validation']['password_invalid'],
            '401': ERROR_RESPONSES['auth']['invalid_credentials']
        }
    },
    'change_email': {
        'method': 'POST',
        'path': '/api/users/auth/change-email/',
        'description': 'Change user email',
        'request_example': AUTH_EXAMPLES['email_change'],
        'error_responses': {
            '400': ERROR_RESPONSES['validation'],
            '401': ERROR_RESPONSES['auth']['invalid_credentials']
        }
    },
    'google_auth': {
        'method': 'POST',
        'path': '/api/users/auth/google/',
        'description': 'Authenticate with Google',
        'request_example': AUTH_EXAMPLES['google_auth'],
        'error_responses': {
            '400': ERROR_RESPONSES['validation'],
            '401': ERROR_RESPONSES['auth']['invalid_credentials']
        }
    },
    'profile': {
        'method': 'GET',
        'path': '/api/users/auth/profile/',
        'description': 'Get user profile',
        'error_responses': {
            '401': ERROR_RESPONSES['auth']['invalid_credentials']
        }
    },
    'profile_update': {
        'method': 'PATCH',
        'path': '/api/users/auth/profile/',
        'description': 'Update user profile',
        'error_responses': {
            '400': ERROR_RESPONSES['validation'],
            '401': ERROR_RESPONSES['auth']['invalid_credentials']
        }
    },
    'refresh_token': {
        'method': 'POST',
        'path': '/api/users/auth/token/refresh/',
        'description': 'Refresh access token',
        'request_example': {
            'refresh': 'eyJ0...'
        },
        'error_responses': {
            '401': ERROR_RESPONSES['auth']['token_invalid']
        }
    },
    'logout_all': {
        'method': 'POST',
        'path': '/api/users/auth/logout/all/',
        'description': 'Logout from all devices',
        'error_responses': {
            '401': ERROR_RESPONSES['auth']['invalid_credentials']
        }
    },
    'password_reset': {
        'method': 'POST',
        'path': '/api/users/auth/password-reset/',
        'description': 'Request password reset email',
        'request_example': {
            'email': 'user@example.com'
        },
        'error_responses': {
            '400': ERROR_RESPONSES['validation']['email']
        }
    },
    'password_reset_confirm': {
        'method': 'POST',
        'path': '/api/users/auth/password-reset/confirm/',
        'description': 'Confirm password reset',
        'request_example': {
            'token': 'reset-token',
            'password': 'newPass123!'
        },
        'error_responses': {
            '400': ERROR_RESPONSES['validation']['password_invalid'],
            '401': ERROR_RESPONSES['auth']['token_invalid']
        }
    }
} 