# Backend/Apps/AI/views.py

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Analysis
from .serializers import AnalysisSerializer, AggregateDataSerializer
from django.db.models import Avg, Count

class AggregateDataView(generics.GenericAPIView):
    """
    Aggregate and analyze user data from surveys and games.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = AggregateDataSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Process data and create analysis
            analysis = Analysis.objects.create(
                user=request.user,
                data=serializer.validated_data,
                status='processing'
            )
            # Trigger async analysis task here
            return Response({
                'analysis_id': analysis.id,
                'status': 'processing'
            }, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AnalysisView(generics.RetrieveAPIView):
    """
    Retrieve analysis results.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = AnalysisSerializer
    queryset = Analysis.objects.all()

    def get_queryset(self):
        return Analysis.objects.filter(user=self.request.user)