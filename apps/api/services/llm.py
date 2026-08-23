import json
import logging
from google import genai
from google.genai import types
from config import settings
from prompts.inoculation_v1 import build_inoculation_prompt

logger = logging.getLogger(__name__)

# We instantiate the client if the key is available
client = None
if settings.gemini_api_key:
    client = genai.Client(api_key=settings.gemini_api_key)

def generate_brief_content(narrative_name: str, technique_name: str, technique_desc: str, refutations: list) -> dict:
    """
    Calls the Gemini API to generate the brief content based on taxonomy data.
    """
    if not client:
        logger.warning("GEMINI_API_KEY is not set. Generating mock brief content.")
        return _mock_brief_content(narrative_name, technique_name)

    prompt = build_inoculation_prompt(narrative_name, technique_name, technique_desc, refutations)
    
    try:
        model = settings.gemini_model or "gemini-2.5-flash"
        
        # We request JSON response format
        response = client.models.generate_content(
            model=model,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2, # Low temperature for more factual/consistent output
            ),
        )
        
        result_text = response.text
        # Safety fallback in case the model wraps it in markdown despite instructions
        if result_text.startswith("```json"):
            result_text = result_text.split("```json")[1].split("```")[0].strip()
            
        return json.loads(result_text)
    except Exception as e:
        logger.error(f"Failed to generate brief via Gemini API: {e}")
        # Fallback to mock data on error
        return _mock_brief_content(narrative_name, technique_name)

def _mock_brief_content(narrative_name: str, technique_name: str) -> dict:
    return {
        "technique_explanation": f"Mock explanation for {technique_name}.",
        "narrative_context": f"Mock context for {narrative_name}.",
        "talking_points": ["Point 1", "Point 2", "Point 3"],
        "personal_script": "This is a mock personal script.",
        "discussion_questions": ["Question 1?", "Question 2?"],
        "summary": "Mock summary."
    }
