import json
import logging
from google import genai
from google.genai import types
from config import settings

logger = logging.getLogger(__name__)

client = None
if settings.gemini_api_key:
    client = genai.Client(api_key=settings.gemini_api_key)

VALIDATION_PROMPT = """
You are a content validator. Review the following inoculation brief against 5 strict criteria:
1. Accuracy: Does it strictly use the provided facts?
2. Tone: Is it calm and non-inflammatory?
3. Actionability: Are the talking points useful?
4. Accessibility: Is it written for a general audience?
5. Technique Focus: Does it focus on the manipulation technique rather than attacking people?

Output ONLY valid JSON. 
Ensure the "passed" field is a boolean (true or false, without quotes).
{{
  "passed": true,
  "reason": "explanation"
}}

Brief content to validate:
{brief_json}
"""

def validate_brief(brief_content: dict) -> bool:
    if not client:
        return True
        
    try:
        model = settings.gemini_model or "gemini-2.5-flash"
        prompt = VALIDATION_PROMPT.format(brief_json=json.dumps(brief_content))
        
        response = client.models.generate_content(
            model=model,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.1,
            ),
        )
        
        result_text = response.text
        if result_text.startswith("```json"):
            result_text = result_text.split("```json")[1].split("```")[0].strip()
            
        result = json.loads(result_text)
        return result.get("passed", False)
    except Exception as e:
        logger.error(f"Validation failed: {e}")
        return False
