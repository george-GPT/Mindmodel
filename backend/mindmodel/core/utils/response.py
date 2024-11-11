"""
Utility functions for standardizing API responses.
"""
from rest_framework.response import Response
from rest_framework import status
from typing import Any, Optional, Dict, List
from django.core.paginator import Page

class APIResponse:
    """
    Standardized API response formatter
    """
    @staticmethod
    def success(
        data: Any = None,
        message: str = "Success",
        status_code: int = status.HTTP_200_OK,
        metadata: Optional[Dict] = None
    ) -> Response:
        """
        Format successful API response
        
        Args:
            data: Response data
            message: Success message
            status_code: HTTP status code
            metadata: Additional metadata
            
        Returns:
            Response: Formatted DRF response
        """
        response_data = {
            "success": True,
            "message": message,
            "data": data,
        }
        
        if metadata:
            response_data["metadata"] = metadata
            
        return Response(response_data, status=status_code)

    @staticmethod
    def error(
        message: str,
        errors: Optional[Dict] = None,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        code: Optional[str] = None
    ) -> Response:
        """
        Format error API response
        
        Args:
            message: Error message
            errors: Detailed error information
            status_code: HTTP status code
            code: Error code for client handling
            
        Returns:
            Response: Formatted DRF response
        """
        response_data = {
            "success": False,
            "message": message,
            "error": {
                "code": code or "error",
                "details": errors
            }
        }
        return Response(response_data, status=status_code)

    @staticmethod
    def paginated_response(
        paginated_data: Page,
        serializer_class: Any,
        message: str = "Success",
        metadata: Optional[Dict] = None
    ) -> Response:
        """
        Format paginated API response
        
        Args:
            paginated_data: Django paginator page object
            serializer_class: DRF serializer class
            message: Success message
            metadata: Additional metadata
            
        Returns:
            Response: Formatted DRF response with pagination
        """
        return APIResponse.success(
            data={
                "items": serializer_class(paginated_data.object_list, many=True).data,
                "pagination": {
                    "total": paginated_data.paginator.count,
                    "page": paginated_data.number,
                    "pages": paginated_data.paginator.num_pages,
                    "per_page": paginated_data.paginator.per_page,
                }
            },
            message=message,
            metadata=metadata
        ) 