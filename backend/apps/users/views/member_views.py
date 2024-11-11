# Backend/Apps/Users/member_views.py

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from ..models import MemberProfile
from ..serializers.member_serializers import MemberProfileSerializer
from ..permissions import IsMember

class MemberRegistrationView(APIView):
    """Handle member registration/upgrade"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        if user.is_member:
            return Response(
                {'error': 'User is already a member'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        user.is_member = True
        user.save()
        
        MemberProfile.objects.get_or_create(user=user)
        
        return Response({'message': 'Successfully upgraded to member'})

class MemberProfileView(APIView):
    """Handle member profile operations"""
    permission_classes = [IsAuthenticated, IsMember]
    
    def get(self, request):
        profile = get_object_or_404(MemberProfile, user=request.user)
        serializer = MemberProfileSerializer(profile)
        return Response(serializer.data)
    
    def patch(self, request):
        profile = get_object_or_404(MemberProfile, user=request.user)
        serializer = MemberProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    """Handle user profile operations"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        data = {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'is_member': user.is_member,
            'profile_complete': user.profile_complete
        }
        if user.is_member and hasattr(user, 'memberprofile'):
            data['member_profile'] = MemberProfileSerializer(user.memberprofile).data
        return Response(data)
