from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from db import supabase
from services.matcher import match_text

router = APIRouter(prefix="/extension", tags=["extension"])

class AnalyzeRequest(BaseModel):
    text: str
    threshold: float = 0.40

class NarrativeResult(BaseModel):
    id: str
    name: str
    description: str
    cluster_id: str
    similarity_score: float

class PrebunkResult(BaseModel):
    personal_script: Optional[str] = None
    talking_points: List[str]
    inoculation_hook: Optional[str] = None
    brief_id: Optional[str] = None

class AnalyzeResponse(BaseModel):
    matched: bool
    narrative: Optional[NarrativeResult] = None
    prebunk: Optional[PrebunkResult] = None

@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_text(req: AnalyzeRequest):
    if not req.text.strip():
        return AnalyzeResponse(matched=False)
        
    # Truncate to first 10,000 characters to prevent huge payloads
    text_to_analyze = req.text[:10000]
        
    matches = match_text(text_to_analyze, req.threshold)
    
    if not matches:
        return AnalyzeResponse(matched=False)
        
    # Get top match
    top_match = sorted(matches, key=lambda x: x.similarity_score, reverse=True)[0]
    
    # Fetch narrative details
    nar_res = supabase.table("narratives").select("*").eq("id", top_match.narrative_id).execute()
    if not nar_res.data:
        return AnalyzeResponse(matched=False)
        
    narrative = nar_res.data[0]
    
    narrative_result = NarrativeResult(
        id=narrative["id"],
        name=narrative["name"],
        description=narrative.get("description", ""),
        cluster_id=narrative.get("cluster_id", "Unknown"),
        similarity_score=top_match.similarity_score
    )
    
    # Fetch most recent passed brief
    brief_res = supabase.table("briefs").select("*")\
        .eq("narrative_id", narrative["id"])\
        .eq("validation_outcome", "passed")\
        .order("created_at", desc=True)\
        .limit(1).execute()
        
    if brief_res.data:
        brief = brief_res.data[0]
        content = brief.get("content", {})
        prebunk = PrebunkResult(
            personal_script=content.get("personal_script"),
            talking_points=content.get("talking_points", []),
            inoculation_hook=narrative.get("inoculation_hook"),
            brief_id=brief["id"]
        )
    else:
        # Fallback to narrative's default talking points
        prebunk = PrebunkResult(
            personal_script=None,
            talking_points=narrative.get("talking_points", []),
            inoculation_hook=narrative.get("inoculation_hook")
        )
        
    return AnalyzeResponse(
        matched=True,
        narrative=narrative_result,
        prebunk=prebunk
    )
