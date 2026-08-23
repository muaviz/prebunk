from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class Subscriber(BaseModel):
    id: str
    user_id: Optional[str] = None
    org_name: str
    org_type: str
    country: Optional[str] = None
    language_preference: str
    tier: str
    status: str
    focus_clusters: list[str]
    delivery_frequency: str
    contact_email: str
    team_size: Optional[int] = None
    created_at: datetime

class SubscriberCreate(BaseModel):
    user_id: Optional[str] = None
    org_name: str
    org_type: str
    country: Optional[str] = None
    language_preference: str = "en"
    tier: str = "individual"
    contact_email: str
    team_size: Optional[int] = None
