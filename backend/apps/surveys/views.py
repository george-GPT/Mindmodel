# Backend/Apps/Surveys/views.py

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Survey, SurveyResponse
from .serializers import SurveySerializer, SurveyResponseSerializer

class SurveyView(generics.ListAPIView):
    """
    List all surveys.
    """
    queryset = Survey.objects.filter(is_active=True)
    serializer_class = SurveySerializer
    permission_classes = [IsAuthenticated]

class SurveyDetailView(generics.RetrieveAPIView):
    """
    Retrieve a specific survey.
    """
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer
    permission_classes = [IsAuthenticated]

class SurveyResponseView(generics.CreateAPIView):
    """
    Submit a survey response.
    """
    serializer_class = SurveyResponseSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
