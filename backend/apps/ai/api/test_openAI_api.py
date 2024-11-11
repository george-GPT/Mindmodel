import pytest
from django.test import TestCase
from django.conf import settings
from Apps.AI.ai_models.cogGPT import (
    upload_file_to_openai,
    create_fine_tuning_job,
    monitor_fine_tuning_job,
    perform_analysis
)

@pytest.mark.django_db
class TestOpenAIAPI(TestCase):
    def setUp(self):
        """Set up test data"""
        self.api_key = settings.OPENAI_API_KEY
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
        self.test_file = 'test_data.jsonl'

    @pytest.mark.skip(reason="Requires OpenAI API key")
    def test_perform_analysis(self):
        """Test OpenAI analysis function"""
        result = perform_analysis(self.test_data)
        
        # Check structure of response
        self.assertIsInstance(result, dict)
        self.assertIn('insights', result)
        self.assertIn('charts', result)
        
        # Check insights structure
        insights = result['insights']
        self.assertIn('surveys', insights)
        self.assertIn('games', insights)
        self.assertIn('overall', insights)

    @pytest.mark.skip(reason="Requires OpenAI API key")
    def test_upload_file(self):
        """Test file upload to OpenAI"""
        file_id = upload_file_to_openai(self.test_file)
        self.assertIsNotNone(file_id)

    @pytest.mark.skip(reason="Requires OpenAI API key")
    def test_fine_tuning(self):
        """Test fine-tuning job creation"""
        file_id = upload_file_to_openai(self.test_file)
        job_id = create_fine_tuning_job(file_id)
        self.assertIsNotNone(job_id)

    @pytest.mark.skip(reason="Requires OpenAI API key")
    def test_error_handling(self):
        """Test error handling with invalid data"""
        with self.assertRaises(Exception):
            perform_analysis(None)
