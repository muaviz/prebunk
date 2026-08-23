from fastapi import APIRouter, HTTPException
from models.narrative import NarrativeResponse
from db import supabase

router = APIRouter(prefix="/narratives", tags=["narratives"])

@router.get("/", response_model=list[NarrativeResponse])
def list_narratives():
    res = supabase.table("narratives").select("*").execute()
    return res.data

@router.get("/{narrative_id}", response_model=NarrativeResponse)
def get_narrative(narrative_id: str):
    res = supabase.table("narratives").select("*").eq("id", narrative_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Narrative not found")
    return res.data[0]
