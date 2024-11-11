# Backend/Apps/AI/urls.py

from django.urls import path
from .views import AggregateDataView, AnalysisView

app_name = 'ai'

urlpatterns = [
    path('aggregate/', AggregateDataView.as_view(), name='aggregate-data'),
    path('analysis/<int:pk>/', AnalysisView.as_view(), name='analysis-detail'),
]
