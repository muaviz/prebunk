from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from db import supabase

router = APIRouter(prefix="/alerts", tags=["alerts"])

class AlertResponse(BaseModel):
    id: str
    narrative_id: str
    narrative_name: str
    alert_level: str
    vrs_score: float
    brief_id: str | None
    subscribers_notified: int
    created_at: datetime

@router.get("/", response_model=list[AlertResponse])
def list_alerts():
    res = supabase.table("alerts").select("*, narratives(name)").order("created_at", desc=True).execute()
    
    alerts = []
    for row in res.data:
        alerts.append(AlertResponse(
            id=row["id"],
            narrative_id=row["narrative_id"],
            narrative_name=(row.get("narratives") or {}).get("name", "Unknown"),
            alert_level=row["alert_level"],
            vrs_score=row["vrs_score"],
            brief_id=row.get("brief_id"),
            subscribers_notified=row.get("subscribers_notified", 0),
            created_at=row["created_at"]
        ))
    return alerts
