#
# Module: template_types
#
# This module implements the TemplateType class for defining the type of template.
#
# Title: Template Types
# Summary: Template types implementation.
# Authors:
#     - @TheBlockRhino
# Created: 2024-12-31
# Last edited by: @TheBlockRhino
# Last edited date: 2025-01-12
# URLs:
#     - https://arai-ai.io
#     - https://github.com/ARAI-DevHub/arai-ai-agents
#     - https://x.com/TheBlockRhino

import requests
import os
import dotenv
import time
import json
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# custom ARAI imports
from utils.content_generator import ContentGenerator
from utils.template_types import TemplateType

dotenv.load_dotenv()

# Define the Lambda endpoint URL
get_inconsistent_image_lambda_url = "https://46i9cnowhh.execute-api.us-east-1.amazonaws.com/getImageInconsistent"

# Function to call the AWS Lambda
def generate_inconsistent_image_lambda(prompt, model_id, style_uuid, num_images):

    url = get_inconsistent_image_lambda_url

    headers = {
        "Content-Type": "application/json"
    }

    payload = {
        "prompt": prompt,
        "modelId": model_id,
        "styleUUID": style_uuid,
        "num_images": num_images
    }

    try:
        # Send the POST request with the payload
        # Use dumpts to convert the payload to a string
        response = requests.post(url, headers=headers, data=json.dumps(payload))

        # Check for HTTP errors
        if not response.ok:
            print(f"HTTP error! Status: {response.status_code}, Response: {response.text}")
            response.raise_for_status()

        # Parse and return the response JSON
        data = response.json()
        return data

    except requests.RequestException as error:
        print("Error calling Lambda:", error)
        raise error

#--------------------------------
# Generate multiple images from a prompt that are inconsistent with each other
#--------------------------------
def generated_image_inconsistent(prompt, model_id, style_uuid, num_images):
    url = "https://cloud.leonardo.ai/api/rest/v1/generations"

    payload = {
      "modelId": model_id,
      "presetStyle": "DYNAMIC",
      "scheduler": "LEONARDO",
      "sd_version": "SDXL_LIGHTNING",
      "contrast": 1.3,
      "prompt": prompt,
      "num_images": num_images,
      "width": 512,
      "height": 512,
      "alchemy": True,
      "styleUUID": style_uuid,
      "enhancePrompt": False,
      "nsfw": True,
      "public": False,
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": "Bearer " + os.getenv("LEONARDO_API_KEY", "")
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        return response.json(), payload
    except Exception as e:
        print("Error:", str(e))
        return None, payload

#--------------------------------
# Generate multiple images from a prompt that are consistent with each other
#--------------------------------
def generated_image_consistent(prompt, model_id, style_uuid, num_images):
    url = "https://cloud.leonardo.ai/api/rest/v1/generations"

    payload = {
      "modelId": model_id,
      "presetStyle": "DYNAMIC",
      "scheduler": "LEONARDO",
      "sd_version": "SDXL_LIGHTNING",
      "contrast": 1.3,
      "prompt": prompt,
      "num_images": num_images,
      "width": 1024,
      "height": 1024,
      "alchemy": True,
      "styleUUID": style_uuid,
      "enhancePrompt": False,
      "nsfw": True,
      "public": False,
      "num_inference_steps": 10,
      "guidance_scale": 7,

    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": "Bearer " + os.getenv("LEONARDO_API_KEY", "")
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        return response.json(), payload
    except Exception as e:
        print("Error:", str(e))
        return None, payload

#--------------------------------
# Get the image URL from a generation ID
#--------------------------------
def get_image_url(generation_id):
    url = "https://cloud.leonardo.ai/api/rest/v1/generations/" + generation_id

    headers = {
        "accept": "application/json",
        "authorization": "Bearer " + os.getenv("LEONARDO_API_KEY", "")
    }

    response = requests.get(url, headers=headers)

    return response.json()

#--------------------------------
# Get list of models
#--------------------------------
def get_models():
    url = "https://cloud.leonardo.ai/api/rest/v1/platformModels"

    headers = {
        "accept": "application/json",
        "authorization": "Bearer " + os.getenv("LEONARDO_API_KEY", "")
    }

    response = requests.get(url, headers=headers)

    return response.json()

# Get a list of model styles
#--------------------------------
def get_model_styles(model_id):
    url = "https://cloud.leonardo.ai/api/rest/v1/platformModels/" + model_id + "/styles"

    headers = {
        "accept": "application/json",
        "authorization": "Bearer " + os.getenv("LEONARDO_API_KEY", "")
    }

    response = requests.get(url, headers=headers)

    return response.json()

#--------------------------------
# Get list of elements
#--------------------------------
def get_elements():
    url = "https://cloud.leonardo.ai/api/rest/v1/elements"

    headers = {
        "accept": "application/json",
        "authorization": "Bearer " + os.getenv("LEONARDO_API_KEY", "")
    }

    response = requests.get(url, headers=headers)

    return response.json()
