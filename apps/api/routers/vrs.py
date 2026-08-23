from fastapi import APIRouter
from models.vrs import VRSScore
from db import supabase

router = APIRouter(prefix="/vrs", tags=["vrs"])

@router.get("/", response_model=list[VRSScore])
def get_vrs_scores():
    res = supabase.table("vrs_scores").select("*").execute()
    return res.data

@router.get("/{narrative_id}/history", response_model=list[VRSScore])
def get_vrs_history(narrative_id: str):
    res = supabase.table("vrs_scores").select("*").eq("narrative_id", narrative_id).order("computed_at").execute()
    return res.data
