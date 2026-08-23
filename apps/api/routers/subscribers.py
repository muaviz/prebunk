from fastapi import APIRouter, HTTPException
from models.subscriber import Subscriber, SubscriberCreate
from db import supabase

router = APIRouter(prefix="/subscribers", tags=["subscribers"])

@router.post("/", response_model=Subscriber)
async def create_subscriber(req: SubscriberCreate):
    res = supabase.table("subscribers").insert(req.model_dump()).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to create subscriber")
    return res.data[0]

@router.get("/me", response_model=list[Subscriber])
async def get_my_subscriber():
    res = supabase.table("subscribers").select("*").execute()
    return res.data
