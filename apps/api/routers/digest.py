from fastapi import APIRouter, BackgroundTasks, HTTPException
from services.digest_builder import build_weekly_digest
from services.email_service import send_email
from db import supabase

router = APIRouter(prefix="/digest", tags=["digest"])

def send_digest_background():
    subject, html = build_weekly_digest()
    if not html:
        return
        
    # Get all approved subscribers wanting weekly digests
    res = supabase.table("subscribers").select("email").eq("status", "approved").execute()
    
    # In a real app, we'd check preferences here
    for sub in res.data:
        send_email(sub["email"], subject, html)

@router.post("/send")
def trigger_digest(background_tasks: BackgroundTasks):
    background_tasks.add_task(send_digest_background)
    return {"status": "Weekly digest generation started in background"}
