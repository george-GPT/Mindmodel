"""
Standardized error codes and messages for consistent API responses.
"""

# Error Codes
ERROR_CODES = {
    # Authentication Errors
    'invalid_credentials': 'Invalid login credentials',
    'token_expired': 'Token has expired',
    'token_invalid': 'Invalid token',
    'token_missing': 'Token not provided',
    
    # Permission Errors
    'permission_denied': 'Permission denied',
    'not_authenticated': 'Authentication required',
    
    # Resource Errors
    'not_found': 'Resource not found',
    'already_exists': 'Resource already exists',
    
    # Validation Errors
    'validation_error': 'Validation failed',
    'missing_field': 'Required field missing',
    'invalid_format': 'Invalid data format',
    
    # Rate Limiting
    'rate_limit_exceeded': 'Too many attempts',
    
    # Registration Errors
    'registration_failed': 'Registration failed',
    'email_taken': 'Email already registered',
    'username_taken': 'Username already taken',
    
    # Password Errors
    'password_mismatch': 'Passwords do not match',
    'password_history': 'Password was used recently',
    'password_too_weak': 'Password does not meet requirements',
    
    # Email Errors
    'email_verification_failed': 'Email verification failed',
    'email_change_failed': 'Email change failed',
    'duplicate_email': 'Email already in use',
    
    # Two-Factor Authentication
    'two_factor_required': '2FA verification required',
    'two_factor_failed': '2FA verification failed',
    'two_factor_error': '2FA configuration error'
}

# Error Messages
ERROR_MESSAGES = {
    'password': {
        'min_length': 'Password must be at least 8 characters long.',
        'max_length': 'Password must not exceed 128 characters.',
        'require_numbers': 'Password must include at least one number.',
        'require_special': 'Password must include at least one special character.',
        'history': 'This password has been used recently. Please choose a different one.',
        'mismatch': 'The provided passwords do not match.',
    },
    'username': {
        'min_length': 'Username must be at least 3 characters long.',
        'max_length': 'Username must not exceed 30 characters.',
        'pattern': 'Username may only contain letters, numbers, underscores, and hyphens.',
        'taken': 'This username is already taken.',
    },
    'email': {
        'max_length': 'Email must not exceed 255 characters.',
        'pattern': 'Please enter a valid email address.',
        'taken': 'This email address is already registered.',
        'verification': 'Please verify your email address.',
    },
    'auth': {
        'invalid_credentials': 'Invalid email or password.',
        'account_disabled': 'This account has been disabled.',
        'verification_required': 'Please verify your email address to continue.',
        'token_expired': 'Your session has expired. Please log in again.',
    },
    'permissions': {
        'not_authenticated': 'Authentication is required to access this resource.',
        'permission_denied': 'You do not have permission to perform this action.',
    },
    'rate_limit': {
        'exceeded': 'Too many attempts. Please try again later.',
        'user_blocked': 'Account temporarily locked due to multiple failed attempts.',
    }
}

# HTTP Status Codes with descriptions
HTTP_STATUS = {
    'OK': 200,                    # Request successful
    'CREATED': 201,               # Resource created successfully
    'ACCEPTED': 202,              # Request accepted but not completed
    'NO_CONTENT': 204,            # Request successful, no content to return
    'BAD_REQUEST': 400,           # Invalid request
    'UNAUTHORIZED': 401,          # Authentication required
    'FORBIDDEN': 403,             # Permission denied
    'NOT_FOUND': 404,             # Resource not found
    'METHOD_NOT_ALLOWED': 405,    # HTTP method not allowed
    'CONFLICT': 409,              # Resource conflict
    'TOO_MANY_REQUESTS': 429,     # Rate limit exceeded
    'SERVER_ERROR': 500,          # Internal server error
}

# Response Message Templates
RESPONSE_MESSAGES = {
    'success': {
        'created': '{resource} created successfully.',
        'updated': '{resource} updated successfully.',
        'deleted': '{resource} deleted successfully.',
        'retrieved': '{resource} retrieved successfully.',
    },
    'error': {
        'not_found': '{resource} not found.',
        'already_exists': '{resource} already exists.',
        'invalid_data': 'Invalid {resource} data provided.',
    }
} 