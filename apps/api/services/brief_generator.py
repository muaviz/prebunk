import uuid
import logging
from datetime import datetime
from db import supabase
from services.llm import generate_brief_content
from services.brief_validator import validate_brief
from models.brief import Brief

logger = logging.getLogger(__name__)

def generate_brief(narrative_id: str, trigger_type: str = "on_demand"):
    # Fetch narrative and technique info
    res = supabase.table("narratives").select("*, techniques(*)").eq("id", narrative_id).execute()
    if not res.data:
        raise ValueError("Narrative not found")
        
    narrative = res.data[0]
    technique = narrative.get("techniques", {})
    
    # Validation loop (max 2 retries)
    max_retries = 2
    passed = False
    content = None
    
    for attempt in range(max_retries + 1):
        logger.info(f"Generating brief for {narrative_id}, attempt {attempt + 1}")
        content = generate_brief_content(
            narrative_name=narrative["name"],
            technique_name=technique.get("name", "Unknown Technique"),
            technique_desc=technique.get("description", ""),
            refutations=narrative.get("factual_refutations", [])
        )
        
        if validate_brief(content):
            passed = True
            break
            
    validation_outcome = "passed" if passed else "failed"
    
    # Save to database
    new_brief = {
        "id": str(uuid.uuid4()),
        "narrative_id": narrative_id,
        "trigger_type": trigger_type,
        "vrs_at_generation": None,
        "title": f"Inoculation Brief: {narrative['name']}",
        "content": content,
        "language": "en",
        "validation_outcome": validation_outcome,
        "version": 1,
        "created_at": datetime.utcnow().isoformat()
    }
    
    insert_res = supabase.table("briefs").insert(new_brief).execute()
    # return the Pydantic model so the user's test works
    return Brief(**insert_res.data[0])
