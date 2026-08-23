from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel
from db import supabase
import re
import time
from collections import defaultdict

router = APIRouter(prefix="/newsletter", tags=["newsletter"])

class NewsletterRequest(BaseModel):
    email: str

class NewsletterResponse(BaseModel):
    status: str
    message: str

# Simple rate limiter (in-memory, email-based)
RATE_LIMIT = 3
RATE_WINDOW = 300 # 5 minutes
rate_limits = defaultdict(list)

def check_rate_limit(email: str):
    now = time.time()
    # clean up old requests for this email
    rate_limits[email] = [ts for ts in rate_limits[email] if now - ts < RATE_WINDOW]
    if len(rate_limits[email]) >= RATE_LIMIT:
        raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")
    rate_limits[email].append(now)
    
    # periodically clean up the entire dict to prevent memory leak
    if len(rate_limits) > 10000:
        rate_limits.clear()

@router.post("/subscribe", response_model=NewsletterResponse, status_code=201)
def subscribe_newsletter(req: NewsletterRequest, response: Response):
    email = req.email.strip()
    
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        raise HTTPException(status_code=422, detail="A valid email address is required.")
        
    check_rate_limit(email)
    
    existing = supabase.table("subscribers").select("*").eq("contact_email", email).execute()
    
    if existing.data:
        subscriber = existing.data[0]
        if subscriber.get("status") == "approved":
            response.status_code = 200
            return NewsletterResponse(
                status="already_subscribed",
                message="This email is already subscribed."
            )
        else:
            # Update to approved if it was pending or rejected
            supabase.table("subscribers").update({"status": "approved"}).eq("id", subscriber["id"]).execute()
            return NewsletterResponse(
                status="subscribed",
                message="You're subscribed! You'll receive our weekly digest."
            )
            
    # Create new
    new_sub = {
        "org_name": "Newsletter Subscriber",
        "org_type": "individual",
        "contact_email": email,
        "status": "approved",
        "tier": "individual",
        "language_preference": "en",
        "delivery_frequency": "weekly",
        "user_id": None,
        "focus_clusters": []
    }
    
    res = supabase.table("subscribers").insert(new_sub).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to subscribe.")
        
    return NewsletterResponse(
        status="subscribed",
        message="You're subscribed! You'll receive our weekly digest."
    )
