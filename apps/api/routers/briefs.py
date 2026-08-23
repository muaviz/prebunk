from fastapi import APIRouter, HTTPException, BackgroundTasks
from models.brief import Brief, BriefCreate
from db import supabase
from services.brief_generator import generate_brief
from pydantic import BaseModel
from services.matcher import match_text, NarrativeMatch

class MatchRequest(BaseModel):
    text: str
    threshold: float = 0.45



router = APIRouter(prefix="/briefs", tags=["briefs"])

@router.get("/", response_model=list[Brief])
def list_briefs():
    res = supabase.table("briefs").select("*").execute()
    return res.data

@router.get("/{id}", response_model=Brief)
def get_brief(id: str):
    res = supabase.table("briefs").select("*").eq("id", id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Brief not found")
    return res.data[0]

@router.post("/generate", response_model=Brief)
def trigger_brief(req: BriefCreate):
    try:
        brief = generate_brief(req.narrative_id, trigger_type=req.trigger_type)
        return brief
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate brief: {e}")


@router.post("/match", response_model=list[NarrativeMatch])
def match_text_endpoint(req: MatchRequest):
    return match_text(req.text, req.threshold)
