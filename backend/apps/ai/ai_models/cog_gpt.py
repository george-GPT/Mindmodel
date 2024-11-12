import os
import time
import openai
from ..utils import download_from_gcs, load_jsonl_data, prepare_data_for_fine_tuning

# Set up your OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

def perform_analysis(data: dict) -> dict:
    """
    Perform AI analysis on the provided data.
    Returns insights and charts.
    """
    try:
        # Initialize response structure
        analysis_output = {
            "insights": {},
            "charts": {}
        }

        # Process survey data
        if 'survey_data' in data:
            survey_insights = analyze_survey_data(data['survey_data'])
            analysis_output["insights"]["surveys"] = survey_insights

        # Process game data
        if 'game_data' in data:
            game_insights = analyze_game_data(data['game_data'])
            analysis_output["insights"]["games"] = game_insights

        # Generate overall insights
        analysis_output["insights"]["overall"] = generate_overall_insights(
            analysis_output["insights"]
        )

        return analysis_output

    except Exception as e:
        print(f"Error in perform_analysis: {str(e)}")
        raise

def analyze_survey_data(survey_data: list) -> dict:
    """Analyze survey responses and generate insights."""
    # Your survey analysis logic here
    return {
        "summary": "Survey analysis summary",
        "key_findings": ["Finding 1", "Finding 2"],
        "recommendations": ["Recommendation 1", "Recommendation 2"]
    }

def analyze_game_data(game_data: list) -> dict:
    """Analyze game performance data and generate insights."""
    # Your game analysis logic here
    return {
        "summary": "Game performance analysis summary",
        "performance_metrics": {
            "accuracy": "85%",
            "speed": "Above average",
            "consistency": "Good"
        }
    }

def generate_overall_insights(insights: dict) -> dict:
    """Generate overall insights combining survey and game analysis."""
    return {
        "summary": "Overall cognitive profile summary",
        "strengths": ["Strength 1", "Strength 2"],
        "areas_for_improvement": ["Area 1", "Area 2"],
        "recommendations": ["Overall recommendation 1", "Overall recommendation 2"]
    }

def upload_file_to_openai(file_path):
    """
    Upload a file to OpenAI and return the file ID.
    """
    try:
        response = openai.File.create(
            file=open(file_path, "rb"),
            purpose='fine-tune'
        )
        file_id = response["id"]
        print(f"Uploaded file to OpenAI with file ID: {file_id}")
        return file_id
    except Exception as e:
        print(f"Error uploading file: {e}")
        return None

def create_fine_tuning_job(training_file_id, model_name="gpt-4o-mini"):
    """
    Create a fine-tuning job and return the job ID.
    """
    try:
        response = openai.FineTune.create(
            training_file=training_file_id,
            model=model_name
        )
        job_id = response["id"]
        print(f"Created fine-tuning job with ID: {job_id}")
        return job_id
    except Exception as e:
        print(f"Error creating fine-tuning job: {e}")
        return None

def monitor_fine_tuning_job(job_id):
    """
    Monitor the fine-tuning job until it completes.
    """
    status = None
    while status not in ['succeeded', 'failed', 'cancelled']:
        response = openai.FineTune.retrieve(id=job_id)
        status = response["status"]
        print(f"Fine-tuning job status: {status}")
        if status == 'succeeded':
            print("Fine-tuning job succeeded!")
            return response
        elif status == 'failed':
            print("Fine-tuning job failed.")
            return response
        elif status == 'cancelled':
            print("Fine-tuning job was cancelled.")
            return response
        else:
            time.sleep(60)  # Wait for 1 minute before checking again

def main():
    # Configuration
    BUCKET_NAME = 'your-gcs-bucket-name'
    BLOB_NAME = 'path/to/your/data.jsonl'
    LOCAL_FILE_PATH = 'data.jsonl'
    PREPARED_FILE_PATH = 'prepared_data.jsonl'
    MODEL_NAME = 'gpt-4o-mini'

    # Ensure OpenAI API key is set
    if not openai.api_key:
        print("Please set your OpenAI API key as an environment variable.")
        return

    # Download data from GCS
    download_from_gcs(BUCKET_NAME, BLOB_NAME, LOCAL_FILE_PATH)

    # Load data
    data_list = load_jsonl_data(LOCAL_FILE_PATH)

    # Prepare data for fine-tuning
    prepare_data_for_fine_tuning(data_list, PREPARED_FILE_PATH)

    # Upload file to OpenAI
    training_file_id = upload_file_to_openai(PREPARED_FILE_PATH)
    if not training_file_id:
        return

    # Create fine-tuning job using the Batch API
    job_id = create_fine_tuning_job(training_file_id, MODEL_NAME)
    if not job_id:
        return

    # Monitor the fine-tuning job
    job_result = monitor_fine_tuning_job(job_id)

    # Get the fine-tuned model ID
    if job_result and job_result["status"] == "succeeded":
        fine_tuned_model = job_result["fine_tuned_model"]
        print(f"Fine-tuned model ID: {fine_tuned_model}")

        # Save the fine-tuned model ID for future use
        with open('fine_tuned_model.txt', 'w') as f:
            f.write(fine_tuned_model)
    else:
        print("Fine-tuning did not succeed.")

if __name__ == "__main__":
    main()
