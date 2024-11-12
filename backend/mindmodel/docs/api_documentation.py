"""
API Documentation Configuration for Swagger/OpenAPI
"""
from drf_spectacular.extensions import OpenApiAuthenticationExtension
from drf_spectacular.utils import OpenApiExample, OpenApiParameter, OpenApiTypes
from mindmodel.core.schema import MindmodelSchema
from mindmodel.core.utils.exceptions import custom_exception_handler

# Security Schemas
SECURITY_SCHEMAS = {
    "Bearer": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
        "description": "JWT token authentication. Format: Bearer <token>"
    },
    "OAuth2": {
        "type": "oauth2",
        "flows": {
            "authorizationCode": {
                "authorizationUrl": "/api/auth/google/",
                "scopes": {
                    "email": "Access email",
                    "profile": "Access profile"
                }
            }
        }
    }
}

# Token Configuration
TOKEN_SETTINGS = {
    "access_token": {
        "lifetime": "15 minutes",
        "auto_refresh": True,
        "refresh_threshold": "5 minutes"
    },
    "refresh_token": {
        "lifetime": "7 days",
        "rotation_enabled": True,
        "blacklist_after_rotation": True
    }
}

# Authentication Flow Schemas
AUTH_FLOWS = {
    "standard_login": {
        "endpoint": "/api/auth/login/",
        "method": "POST",
        "request": {
            "email": {"type": "string", "format": "email"},
            "password": {"type": "string", "format": "password"}
        },
        "response": {
            "access": "JWT access token",
            "refresh": "JWT refresh token",
            "user": "User details"
        }
    },
    "google_oauth": {
        "endpoint": "/api/auth/google/",
        "method": "POST",
        "request": {
            "credential": "Google OAuth credential"
        },
        "response": {
            "access": "JWT access token",
            "refresh": "JWT refresh token",
            "user": "User details"
        }
    },
    "token_refresh": {
        "endpoint": "/api/auth/refresh/",
        "method": "POST",
        "request": {
            "refresh": "Refresh token"
        },
        "response": {
            "access": "New access token"
        }
    }
}

# Security Error Codes
SECURITY_ERROR_CODES = {
    "token_expired": {
        "code": "token_expired",
        "message": "Token has expired",
        "status": 401
    },
    "invalid_token": {
        "code": "invalid_token",
        "message": "Token is invalid or malformed",
        "status": 401
    },
    "token_blacklisted": {
        "code": "token_blacklisted",
        "message": "Token has been blacklisted",
        "status": 401
    },
    "rate_limit_exceeded": {
        "code": "rate_limit_exceeded",
        "message": "Too many attempts",
        "status": 429
    }
}

# Rate Limiting Configuration
RATE_LIMIT_SPECS = {
    "authenticated": {
        "rate": "100/5m",  # 100 requests per 5 minutes
        "scope": "user"
    },
    "anonymous": {
        "rate": "50/5m",  # 50 requests per 5 minutes
        "scope": "ip"
    }
}

# Authentication Examples
AUTH_EXAMPLES = {
    "login_success": OpenApiExample(
        name="Login Success",
        value={
            "success": True,
            "message": "Login successful",
            "data": {
                "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
                "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
                "user": {
                    "id": 1,
                    "username": "testuser",
                    "email": "test@example.com",
                    "is_verified": True
                }
            }
        }
    ),
    "token_refresh_success": OpenApiExample(
        name="Token Refresh Success",
        value={
            "success": True,
            "message": "Token refreshed",
            "data": {
                "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
            }
        }
    ),
    "auth_error": OpenApiExample(
        name="Authentication Error",
        value={
            "success": False,
            "message": "Authentication failed",
            "error": {
                "code": "invalid_credentials",
                "details": {
                    "message": "Invalid email or password"
                }
            }
        }
    )
}

# Security Headers
SECURITY_HEADERS = {
    "Authorization": {
        "description": "JWT token",
        "example": "Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
    },
    "X-CSRF-Token": {
        "description": "CSRF protection token",
        "required": True
    }
}

# TypeScript Security Types
SECURITY_TYPES = """
// Token Types
interface TokenPair {
    access: string;
    refresh: string;
}

interface TokenPayload {
    exp: number;
    iat: number;
    jti: string;
    token_type: string;
    user_id: number;
}

// Auth Headers
interface AuthHeaders {
    Authorization: string;
    'Content-Type': string;
    'X-CSRF-Token'?: string;
}

// Security Error Types
interface SecurityError {
    code: 'token_expired' | 'invalid_token' | 'token_blacklisted' | 'rate_limit_exceeded';
    message: string;
    details?: Record<string, any>;
}

// Token Management
class TokenManager {
    static getAccessToken(): string | null {
        return localStorage.getItem('access_token');
    }

    static setTokens(access: string, refresh: string): void {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
    }

    static clearTokens(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }

    static isTokenExpired(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch {
            return true;
        }
    }
}
"""

# Security Middleware Configuration
SECURITY_MIDDLEWARE = {
    "rate_limiting": {
        "enabled": True,
        "config": RATE_LIMIT_SPECS
    },
    "csrf_protection": {
        "enabled": True,
        "exempt_urls": [
            "/api/auth/login/",
            "/api/auth/refresh/"
        ]
    },
    "cors": {
        "enabled": True,
        "allowed_origins": [
            "http://localhost:3000"
        ],
        "allow_credentials": True
    }
}

# Add these essential TypeScript utilities to TYPESCRIPT_INTERFACES:

"""
// Core Response Types - Essential
type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
    metadata?: Record<string, any>;
};

// Essential Domain Types
interface CognitiveAssessment {
    id: number;
    type: 'survey' | 'game';
    status: 'pending' | 'in_progress' | 'completed';
    score?: number;
    metadata: Record<string, any>;
}

// Flexible Generic Types - Useful but not overly strict
type AssessmentResult<T extends Record<string, any> = Record<string, any>> = {
    assessmentId: number;
    userId: number;
    timestamp: string;
    data: T;
};

// Utility Types - Keep these minimal but useful
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type AssessmentUpdate = Optional<CognitiveAssessment, 'id' | 'metadata'>;

// API Error Handling - Essential for frontend
interface ApiError {
    code: string;
    message: string;
    field?: string;
    details?: Record<string, any>;
}

// Type Guards - Only for critical checks
const isApiError = (error: unknown): error is ApiError => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        'message' in error
    );
};

// Async Response Helper - Practical utility
const handleApiResponse = async <T>(
    promise: Promise<Response>
): Promise<ApiResponse<T>> => {
    try {
        const response = await promise;
        const data = await response.json();
        
        if (!response.ok) {
            throw {
                code: data.error?.code || 'unknown_error',
                message: data.message || 'An error occurred',
                details: data.error?.details
            };
        }
        
        return data;
    } catch (error) {
        throw isApiError(error) ? error : {
            code: 'unknown_error',
            message: 'An unexpected error occurred'
        };
    }
};
"""

# Add this comprehensive auth types section to TYPESCRIPT_INTERFACES:

"""
// Auth Types - Comprehensive type definitions for authentication

// Request Types
interface AuthRequest {
    email: string;
    password: string;
}

interface RegisterRequest extends AuthRequest {
    username: string;
}

interface TokenRefreshRequest {
    refresh: string;
}

interface PasswordResetRequest {
    email: string;
}

interface PasswordResetConfirmRequest {
    token: string;
    new_password: string;
}

// Response Types
interface AuthTokens {
    access: string;
    refresh: string;
}

interface UserProfile {
    id: number;
    username: string;
    email: string;
    is_verified: boolean;
    is_member: boolean;
    profile_complete: boolean;
    meta?: Record<string, any>;
    created_at: string;
    updated_at: string;
}

interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        access: string;
        refresh: string;
        user: UserProfile;
    };
}

// Auth State Management
interface AuthState {
    isAuthenticated: boolean;
    user: UserProfile | null;
    tokens: AuthTokens | null;
    loading: boolean;
    error: AuthError | null;
}

interface AuthError {
    code: AuthErrorCode;
    message: string;
    field?: string;
}

type AuthErrorCode = 
    | 'invalid_credentials'
    | 'token_expired'
    | 'token_invalid'
    | 'email_exists'
    | 'username_exists'
    | 'validation_error'
    | 'not_verified'
    | 'account_disabled';

// Auth Context Types
interface AuthContextType {
    auth: AuthState;
    login: (credentials: AuthRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

// Auth API Client
class AuthAPI {
    static async login(credentials: AuthRequest): Promise<AuthResponse> {
        return handleApiResponse<AuthResponse>(
            fetch('/api/auth/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            })
        );
    }

    static async register(data: RegisterRequest): Promise<AuthResponse> {
        return handleApiResponse<AuthResponse>(
            fetch('/api/auth/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
        );
    }

    static async refreshToken(token: string): Promise<{ access: string }> {
        return handleApiResponse<{ access: string }>(
            fetch('/api/auth/refresh/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: token }),
            })
        );
    }

    static async getProfile(): Promise<UserProfile> {
        return handleApiResponse<UserProfile>(
            fetch('/api/users/profile/', {
                headers: {
                    'Authorization': `Bearer ${TokenManager.getAccessToken()}`,
                    'Content-Type': 'application/json',
                },
            })
        );
    }
}

// Auth Hooks
interface UseAuth {
    user: UserProfile | null;
    isAuthenticated: boolean;
    login: (credentials: AuthRequest) => Promise<void>;
    logout: () => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    loading: boolean;
    error: AuthError | null;
}

// Example Auth Hook Implementation
const useAuth = (): UseAuth => {
    const { auth, login, logout, register } = useContext(AuthContext);
    
    return {
        user: auth.user,
        isAuthenticated: auth.isAuthenticated,
        login,
        logout,
        register,
        loading: auth.loading,
        error: auth.error,
    };
};

// Auth Guard HOC Type
interface WithAuthProps {
    user: UserProfile;
    isAuthenticated: boolean;
}

// Protected Route Props
interface ProtectedRouteProps {
    children: React.ReactNode;
    requireVerified?: boolean;
    requireMember?: boolean;
}
"""

# Add this comprehensive AUTH_ENDPOINTS mapping
AUTH_ENDPOINTS = {
    "base": {
        "path": "/api/users/auth",
        "description": "Base path for auth endpoints"
    },
    "login": {
        "path": "/api/users/auth/login/",
        "method": "POST",
        "description": "Authenticate user and get tokens",
        "request": {
            "email": "string",
            "password": "string"
        },
        "response": {
            "success": True,
            "message": "Login successful",
            "data": {
                "access": "JWT access token",
                "refresh": "JWT refresh token",
                "user": {
                    "id": "number",
                    "username": "string",
                    "email": "string",
                    "is_verified": "boolean",
                    "is_member": "boolean",
                    "profile_complete": "boolean",
                    "created_at": "string (ISO 8601)",
                    "updated_at": "string (ISO 8601)",
                    "meta": {
                        "theme": "string (light|dark)",
                        "notifications": "boolean",
                        "language": "string (en|es)",
                        "custom": "Record<string, unknown>"
                    }
                }
            }
        }
    },
    "register": {
        "path": "/api/users/member/register/",
        "method": "POST",
        "description": "Register new user account",
        "request": {
            "email": "string",
            "username": "string",
            "password": "string"
        },
        "response": {
            "success": True,
            "message": "Registration successful",
            "data": {
                "access": "string",
                "refresh": "string",
                "user": "UserData"
            }
        }
    },
    "logout": {
        "path": "/api/users/auth/logout/",
        "method": "POST",
        "description": "Logout user and blacklist refresh token",
        "request": {
            "refresh": "string"
        },
        "response": {
            "success": True,
            "message": "Successfully logged out"
        }
    },
    "refresh": {
        "path": "/api/users/auth/token/refresh/",
        "method": "POST",
        "description": "Get new access token using refresh token",
        "request": {
            "refresh": "string"
        },
        "response": {
            "success": True,
            "message": "Token refreshed",
            "data": {
                "access": "string"
            }
        }
    },
    "verify_token": {
        "path": "/api/users/auth/token/verify/",
        "method": "POST",
        "description": "Verify token validity",
        "request": {
            "token": "string"
        },
        "response": {
            "success": True,
            "message": "Token is valid",
            "data": {
                "is_valid": True
            }
        }
    },
    "verify_email": {
        "path": "/api/users/auth/verify-email/",
        "method": "GET",
        "description": "Verify user email address",
        "parameters": {
            "token": "string (query parameter)"
        },
        "response": {
            "success": True,
            "message": "Email verified successfully"
        }
    },
    "profile": {
        "path": "/api/users/member/me/",
        "method": "GET",
        "description": "Get user profile",
        "response": {
            "success": True,
            "message": "Profile retrieved successfully",
            "data": "UserData"
        }
    },
    "social_auth": {
        "path": "/api/users/auth/social-auth/",
        "method": "POST",
        "description": "Authenticate with social provider",
        "request": {
            "provider": "string (google)",
            "access_token": "string"
        },
        "response": {
            "success": True,
            "message": "Social authentication successful",
            "data": {
                "access": "string",
                "refresh": "string",
                "user": "UserData"
            }
        }
    },
    "change_password": {
        "path": "/api/users/member/change-password/",
        "method": "POST",
        "description": "Change user password",
        "request": {
            "old_password": "string",
            "new_password": "string"
        },
        "response": {
            "success": True,
            "message": "Password changed successfully"
        }
    },
    "change_email": {
        "path": "/api/users/member/change-email/",
        "method": "POST",
        "description": "Request email change",
        "request": {
            "new_email": "string",
            "password": "string"
        },
        "response": {
            "success": True,
            "message": "Verification email sent"
        }
    },
    "two_factor": {
        "enable": {
            "path": "/api/users/auth/2fa/enable/",
            "method": "POST",
            "description": "Enable 2FA",
            "response": {
                "success": True,
                "message": "2FA enabled successfully"
            }
        },
        "disable": {
            "path": "/api/users/auth/2fa/disable/",
            "method": "POST",
            "description": "Disable 2FA",
            "response": {
                "success": True,
                "message": "2FA disabled successfully"
            }
        }
    },
    "password_reset": {
        "request": {
            "path": "/api/users/auth/password/reset/",
            "method": "POST",
            "description": "Request password reset",
            "request": {
                "email": "string"
            },
            "response": {
                "success": True,
                "message": "Password reset email sent"
            }
        },
        "confirm": {
            "path": "/api/users/auth/password/reset/confirm/",
            "method": "POST",
            "description": "Confirm password reset",
            "request": {
                "token": "string",
                "new_password": "string"
            },
            "response": {
                "success": True,
                "message": "Password reset successful"
            }
        }
    }
}

# Validation Rules
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

# Detailed Error Responses
ERROR_RESPONSES = {
    "auth": {
        "invalid_credentials": {
            "code": "invalid_credentials",
            "message": "Invalid email or password",
            "status": 401,
            "example": {
                "success": False,
                "message": "Authentication failed",
                "error": {
                    "code": "invalid_credentials",
                    "details": {"message": "Invalid email or password"}
                }
            }
        },
        "token_invalid": {
            "code": "token_invalid",
            "message": "Token is invalid or malformed",
            "status": 401,
            "example": {
                "success": False,
                "message": "Authentication failed",
                "error": {
                    "code": "token_invalid",
                    "details": {"message": "Token is invalid or malformed"}
                }
            }
        },
        "rate_limit_exceeded": {
            "code": "rate_limit_exceeded",
            "message": "Too many attempts",
            "status": 429,
            "example": {
                "success": False,
                "message": "Rate limit exceeded",
                "error": {
                    "code": "rate_limit_exceeded",
                    "details": {
                        "message": "Too many attempts",
                        "retry_after": 300
                    }
                }
            }
        }
    },
    "validation": {
        "password_invalid": {
            "code": "validation_error",
            "message": "Password validation failed",
            "status": 400,
            "example": {
                "success": False,
                "message": "Validation failed",
                "error": {
                    "code": "validation_error",
                    "details": {
                        "password": [
                            "Password must be at least 8 characters long",
                            "Password must contain at least one number",
                            "Password must contain at least one special character"
                        ]
                    }
                }
            }
        }
    },
    "permissions": {
        "not_authenticated": {
            "code": "not_authenticated",
            "message": "Authentication required",
            "status": 401,
            "example": {
                "success": False,
                "message": "Authentication required",
                "error": {
                    "code": "not_authenticated",
                    "details": {"message": "You must be logged in"}
                }
            }
        }
    }
}

# Update endpoint error responses
for endpoint in AUTH_ENDPOINTS.values():
    if isinstance(endpoint, dict) and 'method' in endpoint:
        endpoint['error_responses'] = {
            '400': ERROR_RESPONSES['validation'],
            '401': ERROR_RESPONSES['auth'],
            '403': ERROR_RESPONSES['permissions'],
            '429': ERROR_RESPONSES['auth']['rate_limit_exceeded']
        }