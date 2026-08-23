import logging
import re
import json
from google import genai
from google.genai import types
from config import settings

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.client = None
        if settings.gemini_api_key:
            self.client = genai.Client(api_key=settings.gemini_api_key)
        self.model_name = settings.gemini_model or "gemini-2.5-flash"

    def is_available(self):
        return self.client is not None

    def generate_content(self, prompt: str, json_mode: bool = False, temperature: float = 0.7) -> str:
        if not self.is_available():
            raise Exception("Gemini API client not initialized. Check API keys.")

        config = types.GenerateContentConfig(temperature=temperature)
        if json_mode:
            config.response_mime_type = "application/json"

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=config,
        )
        
        text = response.text
        if json_mode:
            match = re.search(r'```(?:json)?\s*(.*?)\s*```', text, re.DOTALL)
            if match:
                text = match.group(1).strip()
            else:
                text = text.strip()
        return text

llm_service = LLMService()
