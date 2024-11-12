# backend/api/tests.py

import pytest
from django.urls import reverse
from rest_framework import status
from apps.ai.models import AnalysisResult
from apps.ai.ai_models.cog_gpt import perform_analysis

@pytest.mark.django_db
class TestAIAnalysis:
    @pytest.fixture(autouse=True)
    def setup(self, member_client, member_user):
        self.client = member_client
        self.user = member_user
        
        # Test data
        self.test_data = {
            'survey_data': [
                {
                    'question': 'How do you feel today?',
                    'answer': 'Good'
                }
            ],
            'game_data': [
                {
                    'game': 'Memory Game',
                    'score': 85,
                    'time_spent': 120,
                    'accuracy': 0.9
                }
            ]
        }
        
        # Create test analysis result
        self.analysis = AnalysisResult.objects.create(
            user=self.user,
            status='COMPLETED',
            insights={'test': 'data'},
            charts={'test_chart': 'https://example.com/chart.png'},
            metadata={'test_meta': 'data'}
        )

    def test_create_analysis(self):
        """Test creating an analysis through the API"""
        url = reverse('ai:generate-analysis')
        response = self.client.post(url, self.test_data, format='json')
        
        assert response.status_code == status.HTTP_202_ACCEPTED
        assert 'task_id' in response.data

    def test_get_analysis_result(self):
        """Test retrieving an analysis result"""
        url = reverse('ai:analysis-result', args=[self.analysis.id])
        response = self.client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['status'] == 'COMPLETED'
        assert response.data['insights'] == {'test': 'data'}
        assert response.data['charts'] == {'test_chart': 'https://example.com/chart.png'}

    def test_perform_analysis_function(self):
        """Test the analysis function directly"""
        result = perform_analysis(self.test_data)
        
        # Check structure of response
        assert isinstance(result, dict)
        assert 'insights' in result
        assert 'charts' in result
        
        # Check insights structure
        insights = result['insights']
        assert 'surveys' in insights
        assert 'games' in insights
        assert 'overall' in insights

    def test_invalid_analysis_request(self):
        """Test error handling for invalid analysis request"""
        url = reverse('ai:generate-analysis')
        response = self.client.post(url, {}, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
