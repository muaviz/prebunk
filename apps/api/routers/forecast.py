from fastapi import APIRouter
from models.forecast import ForecastResponse
from services.forecast import get_forecast

router = APIRouter(prefix="/forecast", tags=["forecast"])

@router.get("/{narrative_id}", response_model=ForecastResponse)
async def get_forecast_endpoint(narrative_id: str, hours: int = 72):
    return get_forecast(narrative_id, hours)
