from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    """
    Custom exception handler for consistent error responses
    """
    response = exception_handler(exc, context)
    
    if response is not None:
        error_message = "An error occurred"
        error_details = None
        
        if hasattr(exc, 'detail'):
            if isinstance(exc.detail, dict):
                error_details = exc.detail
                error_message = next(iter(exc.detail.values()))[0] if exc.detail else "Validation error"
            else:
                error_message = str(exc.detail)
                
        response.data = {
            "success": False,
            "message": error_message,
            "error": {
                "code": exc.__class__.__name__,
                "details": error_details
            }
        }
        
    return response 