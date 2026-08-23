from fastapi import APIRouter, HTTPException, BackgroundTasks
from models.brief import Brief, BriefCreate
from db import supabase
from services.brief_generator import generate_brief

router = APIRouter(prefix="/briefs", tags=["briefs"])

@router.get("/", response_model=list[Brief])
async def list_briefs():
    res = supabase.table("briefs").select("*").execute()
    return res.data

@router.get("/{id}", response_model=Brief)
async def get_brief(id: str):
    res = supabase.table("briefs").select("*").eq("id", id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Brief not found")
    return res.data[0]

@router.post("/generate", response_model=Brief)
async def trigger_brief(req: BriefCreate):
    try:
        brief = generate_brief(req.narrative_id, trigger_type=req.trigger_type)
        return brief
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate brief: {e}")
