from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class CommunityTip(BaseModel):
    id: str
    subscriber_id: Optional[str] = None
    description: str
    matched_narrative_id: Optional[str] = None
    status: str
    reviewer_notes: Optional[str] = None
    created_at: datetime

class TipCreate(BaseModel):
    subscriber_id: Optional[str] = None
    description: str
