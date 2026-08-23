from fastapi import APIRouter, HTTPException
from models.tip import CommunityTip, TipCreate
from db import supabase

router = APIRouter(prefix="/tips", tags=["tips"])

@router.post("/", response_model=CommunityTip)
async def create_tip(req: TipCreate):
    res = supabase.table("community_tips").insert(req.model_dump()).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to create tip")
    return res.data[0]

@router.get("/", response_model=list[CommunityTip])
async def list_tips():
    res = supabase.table("community_tips").select("*").execute()
    return res.data
