import json
import logging
from google import genai
from google.genai import types
from config import settings

client = genai.Client(api_key=settings.gemini_api_key)
prompt = """
You are a content validator. Review the following inoculation brief against 5 strict criteria:
1. Accuracy: Does it strictly use the provided facts?

Output ONLY valid JSON. 
Ensure the "passed" field is a boolean (true or false, without quotes).
{
  "passed": true,
  "reason": "explanation"
}

Brief content to validate:
{"technique_explanation": "Statistical manipulation is a deceptive technique"}
"""

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=prompt,
    config=types.GenerateContentConfig(
        response_mime_type="application/json",
        temperature=0.1,
    ),
)
print("RAW:")
print(repr(response.text))
