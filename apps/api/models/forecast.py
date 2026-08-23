from datetime import datetime
from pydantic import BaseModel
from typing import List

class ForecastPoint(BaseModel):
    timestamp: datetime
    predicted_vrs: float
    lower_bound: float
    upper_bound: float

class ForecastResponse(BaseModel):
    narrative_id: str
    narrative_name: str
    current_vrs: float
    method: str  # "linear" or "prophet"
    forecast: List[ForecastPoint]
    predicted_peak: float
    predicted_peak_time: datetime
    breakout_risk: str  # "low", "moderate", "high"
