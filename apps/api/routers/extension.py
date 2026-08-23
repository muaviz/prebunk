from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from db import supabase
from services.matcher import match_text

router = APIRouter(prefix="/extension", tags=["extension"])

class AnalyzeRequest(BaseModel):
    text: str
    threshold: float = 0.40

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
    claim: Optional[ClaimMatch] = None
    prebunk: Optional[PrebunkResult] = None

@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_text(req: AnalyzeRequest):
    if not req.text.strip():
        return AnalyzeResponse(matched=False)

    text_to_analyze = req.text[:10000]
    matches = match_text(text_to_analyze, req.threshold)

    if not matches:
        return AnalyzeResponse(matched=False)

    top_match = sorted(matches, key=lambda x: x.similarity_score, reverse=True)[0]

    res = supabase.table("claims").select("*").eq("id", top_match.narrative_id).execute()
    if not res.data:
        return AnalyzeResponse(matched=False)

    claim_data = res.data[0]

    return AnalyzeResponse(
        matched=True,
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
