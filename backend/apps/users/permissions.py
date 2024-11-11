# Backend/Apps/Users/permissions.py

from rest_framework.permissions import BasePermission

class IsMember(BasePermission):
    """
    Allows access only to members.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_member)
