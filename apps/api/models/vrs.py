from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class VRSScore(BaseModel):
    id: str
    narrative_id: str
    score: float
    raw_volume: int
    acceleration: float
    cross_platform_count: int
    computed_at: datetime
    created_at: datetime

class VRSHistory(BaseModel):
    narrative_id: str
    history: list[VRSScore]
