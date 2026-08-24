from fastapi import APIRouter, HTTPException
from db import supabase
from models import ClaimResponse

router = APIRouter(prefix="/claims", tags=["claims"])

@router.get("/", response_model=list[ClaimResponse])
def list_claims(featured_only: bool = False):
    query = supabase.table("claims").select(
        "id, title, claim_text, description, category, virality_score, is_featured, "
        "talking_points, personal_script, refutations, semantic_anchors, promoter_links"
    )
    if featured_only:
        query = query.eq("is_featured", True)
    query = query.order("virality_score", desc=True)
    res = query.execute()
    return res.data

@router.get("/{claim_id}", response_model=ClaimResponse)
def get_claim(claim_id: str):
    res = supabase.table("claims").select("*").eq("id", claim_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Claim not found")
    return res.data[0]
