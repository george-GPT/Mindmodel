import os
import json
from google.cloud import storage
from django.core.cache import cache
from .models import AnalysisResult
import logging

logger = logging.getLogger(__name__)

def download_from_gcs(bucket_name, blob_name, destination_file):
    """Download a file from Google Cloud Storage."""
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    blob.download_to_filename(destination_file)
    print(f"Downloaded {blob_name} to {destination_file}")

def load_jsonl_data(file_path):
    """Load data from a JSONL file."""
    data = []
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            data.append(json.loads(line.strip()))
    return data

def prepare_data_for_fine_tuning(data_list, output_file):
    """Prepare data for fine-tuning."""
    with open(output_file, 'w', encoding='utf-8') as f:
        for conversation in data_list:
            prepared_item = {
                "messages": conversation["messages"]
            }
            f.write(json.dumps(prepared_item) + '\n')
    print(f"Data prepared and saved to {output_file}") 

def cleanup_analysis(user_id: int):
    """Clean up resources after analysis failure or timeout"""
    try:
        # Clear cache
        cache_key = f"analysis_data_{user_id}"
        cache.delete(cache_key)
        
        # Update analysis status
        AnalysisResult.objects.filter(
            user_id=user_id,
            status='PROCESSING'
        ).update(status='FAILED')
        
    except Exception as e:
        logger.error(f"Cleanup error: {str(e)}")