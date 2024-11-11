import os
import json
from google.cloud import storage

def download_from_gcs(bucket_name, blob_name, destination_file):
    """
    Download a file from Google Cloud Storage.
    """
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    blob.download_to_filename(destination_file)
    print(f"Downloaded {blob_name} to {destination_file}")

def load_jsonl_data(file_path):
    """
    Load data from a JSONL file.
    """
    data = []
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            data.append(json.loads(line.strip()))
    return data

def prepare_data_for_fine_tuning(data_list, output_file):
    """
    Prepare data in the format required for fine-tuning gpt-4o-mini.
    Each example should be a JSON object with a 'messages' key,
    which is a list of message dictionaries with 'role' and 'content' keys.
    """
    with open(output_file, 'w', encoding='utf-8') as f:
        for conversation in data_list:
            # Assuming your data is already in the required format.
            # If not, you'll need to adjust this part.
            prepared_item = {
                "messages": conversation["messages"]
            }
            f.write(json.dumps(prepared_item) + '\n')
    print(f"Data prepared and saved to {output_file}")
