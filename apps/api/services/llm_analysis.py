import json
from services.llm import llm_service

SYSTEM_PROMPT = """You are an expert analyst in identifying anti-Muslim hate speech, dog whistles, slurs, and coded harassment.
The user will provide a text snippet. Analyze the text and determine if it contains any anti-Muslim sentiment (explicit or implicit).
If it does, generate a structured response to refute it.

Respond ONLY with a valid JSON object following this schema:
{
  "is_harmful": true/false,
  "theme": "A short 2-5 word title summarizing the theme or trope detected",
  "explanation": "A 1-2 paragraph explanation of why this text is harmful, decoding the dog whistle or slur if applicable.",
  "talking_points": ["Point 1", "Point 2", "Point 3"],
  "personal_script": "A short, polite but firm suggested reply the user can copy-paste to refute this."
}
"""

def analyze_with_llm(text: str) -> dict:
    prompt = f"{SYSTEM_PROMPT}\n\nText to analyze:\n\"{text}\""
    try:
        response_text = llm_service.generate_content(prompt, json_mode=True)
        return json.loads(response_text)
    except Exception as e:
        print(f"LLM Analysis failed: {e}")
        return {"is_harmful": False}
