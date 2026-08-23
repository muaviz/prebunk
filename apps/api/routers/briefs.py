from fastapi import APIRouter, HTTPException
from models.brief import Brief, BriefCreate
from db import supabase

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

@router.post("/generate")
async def generate_brief(req: BriefCreate):
    return {"status": "pending", "message": "Phase 5 will implement brief generation."}
