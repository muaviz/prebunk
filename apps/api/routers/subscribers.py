from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models.subscriber import Subscriber, SubscriberCreate
from db import supabase

router = APIRouter(prefix="/subscribers", tags=["subscribers"])

class PreferencesUpdate(BaseModel):
    notification_preferences: dict
    focus_clusters: list[str]

@router.post("/", response_model=Subscriber)
def create_subscriber(req: SubscriberCreate):
    # Check if exists
    existing = supabase.table("subscribers").select("*").eq("contact_email", req.contact_email).execute()
    if existing.data:
        # Update instead
        res = supabase.table("subscribers").update(req.model_dump(exclude_unset=True)).eq("contact_email", req.contact_email).execute()
        return res.data[0]
        
    res = supabase.table("subscribers").insert(req.model_dump()).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to create subscriber")
    return res.data[0]

@router.patch("/{id}/approve")
def approve_subscriber(id: str):
    res = supabase.table("subscribers").update({"status": "approved"}).eq("id", id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    return res.data[0]

@router.patch("/{id}/preferences")
def update_preferences(id: str, prefs: PreferencesUpdate):
    res = supabase.table("subscribers").update({
        "notification_preferences": prefs.notification_preferences,
        "focus_clusters": prefs.focus_clusters
    }).eq("id", id).execute()
    
    if not res.data:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    return res.data[0]

@router.get("/user/{user_id}", response_model=Subscriber)
def get_subscriber_by_user_id(user_id: str):
    res = supabase.table("subscribers").select("*").eq("user_id", user_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    return res.data[0]
