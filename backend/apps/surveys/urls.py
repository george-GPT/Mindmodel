# Backend/Apps/Surveys/urls.py

from django.urls import path
from .views import (
    SurveyView,
    SurveyDetailView,
    SurveyResponseView
)

app_name = 'surveys'

urlpatterns = [
    path('', SurveyView.as_view(), name='survey-list'),
    path('<int:pk>/', SurveyDetailView.as_view(), name='survey-detail'),
    path('<int:pk>/submit/', SurveyResponseView.as_view(), name='survey-submit'),
]
