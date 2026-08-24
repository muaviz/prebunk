from fastapi import APIRouter, Request
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from db import supabase
from services.matcher import match_text
from services.llm_analysis import analyze_with_llm

router = APIRouter(prefix="/extension", tags=["extension"])

class AnalyzeRequest(BaseModel):
    text: str
    threshold: float = Field(default=0.55, ge=0.0, le=1.0)

class ClaimMatch(BaseModel):
    id: str
    title: str
    description: str
    similarity_score: float

class PrebunkResult(BaseModel):
    personal_script: Optional[str] = None
    talking_points: List[str]
    refutations: List[Dict[str, Any]]

class AnalyzeResponse(BaseModel):
    matched: bool
    is_llm_generated: bool = False
    claim: Optional[ClaimMatch] = None
    prebunk: Optional[PrebunkResult] = None

from limiter import limiter

@router.post("/analyze", response_model=AnalyzeResponse)
@limiter.limit("10/minute")
def analyze_text(request: Request, req: AnalyzeRequest):
    if not req.text.strip():
        return AnalyzeResponse(matched=False)

    text_to_analyze = req.text[:10000]
    
    # 1. Try SBERT Matching against known claims with higher threshold
    matches = match_text(text_to_analyze, req.threshold)

    if matches:
        top_match = sorted(matches, key=lambda x: x.similarity_score, reverse=True)[0]
        res = supabase.table("claims").select("*").eq("id", top_match.narrative_id).execute()
        
        if res.data:
            claim_data = res.data[0]
            return AnalyzeResponse(
                matched=True,
                is_llm_generated=False,
                claim=ClaimMatch(
                    id=claim_data["id"],
                    title=claim_data["title"],
                    description=claim_data["description"],
                    similarity_score=top_match.similarity_score
                ),
                prebunk=PrebunkResult(
                    personal_script=claim_data.get("personal_script"),
                    talking_points=claim_data.get("talking_points", []),
                    refutations=claim_data.get("refutations", [])
                )
            )

    # 2. Fallback to LLM Analysis for unknown dog whistles/slurs or vague phrases
    llm_result = analyze_with_llm(text_to_analyze)
    
    if llm_result.get("is_harmful"):
        return AnalyzeResponse(
            matched=True,
            is_llm_generated=True,
            claim=ClaimMatch(
                id="LLM-GENERATED",
                title=llm_result.get("theme", "Harmful Content Detected"),
                description=llm_result.get("explanation", ""),
                similarity_score=0.99
            ),
            prebunk=PrebunkResult(
                personal_script=llm_result.get("personal_script"),
                talking_points=llm_result.get("talking_points", []),
                refutations=[] 
            )
        )

    return AnalyzeResponse(matched=False)
