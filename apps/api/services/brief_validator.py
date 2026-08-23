import json
import logging
from pathlib import Path
from services.llm import llm_service

logger = logging.getLogger(__name__)

def load_prompt(filename: str) -> str:
    path = Path(__file__).parent.parent / "prompts" / filename
    with open(path, "r") as f:
        return f.read()

def validate_brief(brief_content: dict) -> bool:
    if not llm_service.is_available():
        logger.warning("No Gemini API key configured. Failing validation.")
        return False
        
    try:
        prompt_template = load_prompt("validation.txt")
        prompt = prompt_template.format(brief_json=json.dumps(brief_content))
        
        result_text = llm_service.generate_content(prompt, json_mode=True, temperature=0.1)
        
        result = json.loads(result_text)
        return result.get("passed", False)
    except Exception as e:
        logger.error(f"Validation failed: {e}")
        return False
