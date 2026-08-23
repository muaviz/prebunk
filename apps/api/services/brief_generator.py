import uuid
import json
import re
import logging
from datetime import datetime
from db import supabase
from google import genai
from config import settings
from services.brief_validator import validate_brief
from models.brief import Brief, BriefContent
from pathlib import Path

logger = logging.getLogger(__name__)

client = None
if settings.gemini_api_key:
    client = genai.Client(api_key=settings.gemini_api_key)

def load_prompt(filename: str) -> str:
    path = Path(__file__).parent.parent / "prompts" / filename
    with open(path, "r") as f:
        return f.read()

def call_gemini(prompt: str, json_mode: bool = False) -> str:
    if not client:
        return ""
        
    model = settings.gemini_model or "gemini-2.5-flash"
    config = genai.types.GenerateContentConfig(
        temperature=0.7,
    )
    if json_mode:
        config.response_mime_type = "application/json"
        
    response = client.models.generate_content(
        model=model,
        contents=prompt,
        config=config,
    )
    text = response.text
    if json_mode:
        match = re.search(r'```json\s*(.*?)\s*```', text, re.DOTALL)
        if match:
            text = match.group(1).strip()
    return text

def generate_brief(narrative_id: str, trigger_type: str = "on_demand", target_audience: str = "community_organization", language: str = "en") -> Brief:
    res = supabase.table("narratives").select("*, techniques(*)").eq("id", narrative_id).execute()
    if not res.data:
        raise ValueError("Narrative not found")
        
    narrative = res.data[0]
    technique = narrative.get("techniques") or {}
    
    # Format refutations
    refutations = "\n".join([f"- Claim: {r['claim']}\n  Refutation: {r['refutation']}\n  Source: {r['source']}" 
                            for r in narrative.get("factual_refutations", [])])

    max_retries = 2
    passed = False
    content_dict = None
    
    for attempt in range(max_retries + 1):
        logger.info(f"Generating brief for {narrative_id}, attempt {attempt + 1}")
        
        # Step 1
        p1 = load_prompt("step1_technique.txt").format(
            technique_name=technique.get("name", "Unknown"),
            technique_desc=technique.get("description", ""),
            narrative_name=narrative["name"]
        )
        step1_output = call_gemini(p1) or "Mock technique explanation."
        
        # Step 2
        p2 = load_prompt("step2_context.txt").format(
            step1_output=step1_output,
            refutations=refutations,
            narrative_name=narrative["name"]
        )
        step2_output = call_gemini(p2) or "Mock narrative context."
        
        # Step 3
        p3 = load_prompt("step3_action.txt").format(
            step1_output=step1_output,
            step2_output=step2_output
        )
        step3_output = call_gemini(p3, json_mode=True)
        
        if not step3_output:
            step3_json = {
                "talking_points": ["Mock 1", "Mock 2", "Mock 3"],
                "personal_script": "Mock script.",
                "discussion_questions": ["Mock Q1", "Mock Q2"],
                "summary": "Mock summary."
            }
        else:
            try:
                step3_json = json.loads(step3_output)
            except Exception:
                step3_json = {
                    "talking_points": [], "personal_script": "", "discussion_questions": [], "summary": ""
                }
        
        content_dict = {
            "technique_explanation": step1_output,
            "narrative_context": step2_output,
            **step3_json
        }
        
        if validate_brief(content_dict):
            passed = True
            break
            
    validation_outcome = "passed" if passed else "failed"
    
    new_brief = {
        "id": str(uuid.uuid4()),
        "narrative_id": narrative_id,
        "trigger_type": trigger_type,
        "vrs_at_generation": None,
        "title": f"Inoculation Brief: {narrative['name']}",
        "content": content_dict,
        "language": language,
        "validation_outcome": validation_outcome,
        "version": 1,
        "created_at": datetime.utcnow().isoformat()
    }
    
    insert_res = supabase.table("briefs").insert(new_brief).execute()
    return Brief(**insert_res.data[0])
