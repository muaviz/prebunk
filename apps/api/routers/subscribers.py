from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models.subscriber import Subscriber, SubscriberCreate
from db import supabase

router = APIRouter(prefix="/subscribers", tags=["subscribers"])

@router.post("/", response_model=Subscriber)
def create_subscriber(req: SubscriberCreate):
    # Check if exists
    existing = supabase.table("subscribers").select("*").eq("user_id", req.user_id).execute()
    if existing.data:
        # Update instead
        res = supabase.table("subscribers").update(req.model_dump(exclude_unset=True)).eq("user_id", req.user_id).execute()
        return res.data[0]
        
    res = supabase.table("subscribers").insert(req.model_dump()).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to create subscriber")
    return res.data[0]
