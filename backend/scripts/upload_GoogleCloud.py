from google.cloud import storage
import os
from pathlib import Path

# Set the path to your service account key file
service_account_key_path = Path("C:/Users/Georg/Projects/mm_dev/evident-trees-439500-k8-ad822a896660.json")
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = str(service_account_key_path)

# Initialize the storage client and bucket once to improve performance
storage_client = storage.Client()
bucket_name = "cognitive_research"  # Replace with your Google Cloud Storage bucket name
bucket = storage_client.bucket(bucket_name)

# Function to upload a file to Google Cloud Storage
def upload_to_gcs(bucket, source_file_path, destination_blob_name):
    """Uploads a file to the specified bucket, skips if it already exists."""
    try:
        blob = bucket.blob(destination_blob_name)
        
        # Check if the blob already exists in the bucket
        if blob.exists(storage_client):
            print(f"ℹ️ File '{destination_blob_name}' already exists in bucket '{bucket.name}'. Skipping upload.")
            return  # Skip uploading this file

        # Upload the file since it doesn't exist
        blob.upload_from_filename(str(source_file_path))
        print(f"✅ File '{source_file_path}' uploaded to '{destination_blob_name}'.")
    except Exception as e:
        print(f"❌ Failed to upload '{source_file_path}': {e}")

# Set up configuration
local_directory = Path("C:/Users/Georg/Projects/mm_dev/training_data")  # Corrected path

# Verify that the local directory exists
if not local_directory.is_dir():
    print(f"❗ The directory '{local_directory}' does not exist.")
    exit(1)

# Iterate over all files in the directory and upload them
for source_file_path in local_directory.rglob('*'):
    if source_file_path.is_file():
        # Set destination_blob_name to the path of the file relative to local_directory
        destination_blob_name = source_file_path.relative_to(local_directory).as_posix()
        # Upload to Google Cloud Storage
        upload_to_gcs(bucket, source_file_path, destination_blob_name)

print("📦 All files have been processed.")
