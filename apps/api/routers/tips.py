from fastapi import APIRouter, HTTPException
from typing import Optional
from models.tip import CommunityTip, TipCreate
from db import supabase

router = APIRouter(prefix="/tips", tags=["tips"])

from pydantic import BaseModel

class TipCreateRequest(BaseModel):
    user_id: str
    description: str

@router.post("/", response_model=CommunityTip)
def create_tip(req: TipCreateRequest):
    # Lookup subscriber_id from user_id
    sub_res = supabase.table("subscribers").select("id").eq("user_id", req.user_id).execute()
    subscriber_id = sub_res.data[0]["id"] if sub_res.data else None
    
    if not subscriber_id:
        raise HTTPException(status_code=404, detail="Subscriber record not found for this user")
        
    res = supabase.table("community_tips").insert({
        "subscriber_id": subscriber_id,
        "description": req.description,
        "status": "pending"
    }).execute()
    
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to create tip")
    return res.data[0]

@router.get("/", response_model=list[CommunityTip])
def list_tips(user_id: Optional[str] = None):
    query = supabase.table("community_tips").select("*")
    if user_id:
        query = query.eq("subscriber_id", user_id)
    res = query.order("created_at", desc=True).execute()
    return res.data
