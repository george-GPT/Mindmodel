from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import User
from ..services.email_service import EmailService

class EmailVerificationView(APIView):
    def post(self, request):
        """Handle email verification"""
        token = request.data.get('token')
        if not token:
            return Response(
                {'error': 'Verification token is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(verification_token=token)
            if user.verify_email(token):
                return Response({'message': 'Email verified successfully'})
            return Response(
                {'error': 'Invalid or expired token'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid token'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class ResendVerificationView(APIView):
    def post(self, request):
        """Resend verification email"""
        email = request.data.get('email')
        if not email:
            return Response(
                {'error': 'Email is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
            if user.email_verified:
                return Response(
                    {'message': 'Email is already verified'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            user.set_verification_token()
            EmailService.send_verification_email(user, user.verification_token)
            return Response({'message': 'Verification email sent'})
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'}, 
                status=status.HTTP_404_NOT_FOUND
            ) 