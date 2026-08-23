from fastapi import APIRouter
from models.vrs import VRSScore
from db import supabase

router = APIRouter(prefix="/vrs", tags=["vrs"])

@router.get("/", response_model=list[VRSScore])
def get_vrs_scores(latest: bool = True):
    res = supabase.table("vrs_scores").select("*").order("computed_at", desc=True).limit(1000).execute()
    if not latest:
        return res.data
        
    seen = set()
    latest_scores = []
    for row in res.data:
        if row["narrative_id"] not in seen:
            seen.add(row["narrative_id"])
            latest_scores.append(row)
    return latest_scores

@router.get("/{narrative_id}/history", response_model=list[VRSScore])
def get_vrs_history(narrative_id: str):
    res = supabase.table("vrs_scores").select("*").eq("narrative_id", narrative_id).order("computed_at").execute()
    return res.data
