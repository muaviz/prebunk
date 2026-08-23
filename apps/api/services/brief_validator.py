import json
import logging
import re
from google import genai
from google.genai import types
from config import settings
from pathlib import Path

logger = logging.getLogger(__name__)

client = None
if settings.gemini_api_key:
    client = genai.Client(api_key=settings.gemini_api_key)

def load_prompt(filename: str) -> str:
    path = Path(__file__).parent.parent / "prompts" / filename
    with open(path, "r") as f:
        return f.read()

def validate_brief(brief_content: dict) -> bool:
    if not client:
        return True
        
    try:
        model = settings.gemini_model or "gemini-2.5-flash"
        prompt_template = load_prompt("validation.txt")
        prompt = prompt_template.format(brief_json=json.dumps(brief_content))
        
        response = client.models.generate_content(
            model=model,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.1,
            ),
        )
        
        result_text = response.text
        match = re.search(r'```json\s*(.*?)\s*```', result_text, re.DOTALL)
        if match:
            result_text = match.group(1)
            
        result = json.loads(result_text)
        return result.get("passed", False)
    except Exception as e:
        logger.error(f"Validation failed: {e}")
        return False
