import time
import datetime
import numpy as np
import pandas as pd
from typing import List, Tuple
import logging
from db import supabase
from models.forecast import ForecastPoint, ForecastResponse


logger = logging.getLogger(__name__)

_forecast_cache = {}
CACHE_TTL = 3600

def get_forecast(narrative_id: str, hours: int = 72) -> ForecastResponse:
    cache_key = f"{narrative_id}_{hours}"
    now = time.time()
    
    if cache_key in _forecast_cache:
        cached_result, timestamp = _forecast_cache[cache_key]
        if now - timestamp < CACHE_TTL:
            logger.info(f"Returning cached forecast for {narrative_id}")
            return cached_result

    # Get narrative info
    narrative_res = supabase.table("narratives").select("name").eq("id", narrative_id).execute()
    if not narrative_res.data:
        raise ValueError(f"Narrative not found: {narrative_id}")
    narrative_name = narrative_res.data[0]["name"]
    
    # Get all history
    history_res = supabase.table("vrs_scores").select("computed_at, score").eq("narrative_id", narrative_id).order("computed_at").execute()
    data = history_res.data
    
    if not data:
        # No history, return empty forecast
        now = datetime.datetime.now(datetime.timezone.utc)
        return ForecastResponse(
            narrative_id=narrative_id,
            narrative_name=narrative_name,
            current_vrs=0.0,
            method="linear",
            forecast=[],
            predicted_peak=0.0,
            predicted_peak_time=now,
            breakout_risk="low"
        )
        
    current_vrs = float(data[-1]["score"])
    
    # Convert to dataframe
    df = pd.DataFrame(data)
    df["ds"] = pd.to_datetime(df["computed_at"]).dt.tz_localize(None)
    df["y"] = df["score"]
    
    method = "linear"
    forecast_points = []
    
    # Try Prophet if we have enough data (e.g. > 30 points)
    if len(df) >= 30:
        try:
            from prophet import Prophet
            m = Prophet(daily_seasonality=True)
            m.fit(df[["ds", "y"]])
            
            # Predict
            future = m.make_future_dataframe(periods=hours, freq='h')
            forecast = m.predict(future)
            
            # Filter to only future predictions
            last_dt = df["ds"].max()
            future_forecast = forecast[forecast["ds"] > last_dt].head(hours)
            
            for _, row in future_forecast.iterrows():
                # Cap minimum at 0, max at 100
                pred = max(0.0, min(100.0, row["yhat"]))
                lb = max(0.0, min(100.0, row["yhat_lower"]))
                ub = max(0.0, min(100.0, row["yhat_upper"]))
                forecast_points.append(ForecastPoint(
                    timestamp=row["ds"],
                    predicted_vrs=pred,
                    lower_bound=lb,
                    upper_bound=ub
                ))
            method = "prophet"
        except Exception as e:
            logger.warning(f"Prophet forecast failed for {narrative_id}: {e}. Falling back to linear.")
    
    # Linear fallback
    if method == "linear":
        # We need to project 72 hours.
        # Let's take the last 7 days of data.
        seven_days_ago = df["ds"].max() - datetime.timedelta(days=7)
        recent_df = df[df["ds"] >= seven_days_ago].copy()
        
        if len(recent_df) < 2:
            # Not enough to do linear fit, just flatline
            slope = 0
            intercept = current_vrs
            start_time = df["ds"].max()
        else:
            # Convert time to hours since start for regression
            start_time = recent_df["ds"].min()
            recent_df["hours"] = (recent_df["ds"] - start_time).dt.total_seconds() / 3600.0
            
            x = recent_df["hours"].values
            y = recent_df["y"].values
            
            # Fit line
            coef = np.polyfit(x, y, 1)
            slope = coef[0]
            intercept = coef[1]
            
        last_dt = df["ds"].max()
        if len(recent_df) >= 2:
            last_hours = (last_dt - start_time).total_seconds() / 3600.0
        else:
            last_hours = 0
            
        # Generate points every 12 hours
        for h in range(12, hours + 12, 12):
            future_dt = last_dt + datetime.timedelta(hours=h)
            target_hours = last_hours + h
            pred = max(0.0, min(100.0, slope * target_hours + intercept))
            
            # Simple confidence band: +/- 15% of prediction, bounded
            lb = max(0.0, pred * 0.85 - 5)
            ub = min(100.0, pred * 1.15 + 5)
            
            forecast_points.append(ForecastPoint(
                timestamp=future_dt,
                predicted_vrs=pred,
                lower_bound=lb,
                upper_bound=ub
            ))
            
    # Calculate peak
    if forecast_points:
        peak_point = max(forecast_points, key=lambda p: p.predicted_vrs)
        predicted_peak = peak_point.predicted_vrs
        predicted_peak_time = peak_point.timestamp
    else:
        predicted_peak = current_vrs
        predicted_peak_time = datetime.datetime.now(datetime.timezone.utc)
        
    # Breakout risk
    if predicted_peak > 60:
        breakout_risk = "high"
    elif predicted_peak >= 30:
        breakout_risk = "moderate"
    else:
        breakout_risk = "low"
        
    result = ForecastResponse(
        narrative_id=narrative_id,
        narrative_name=narrative_name,
        current_vrs=current_vrs,
        method=method,
        forecast=forecast_points,
        predicted_peak=predicted_peak,
        predicted_peak_time=predicted_peak_time,
        breakout_risk=breakout_risk
    )
    _forecast_cache[cache_key] = (result, now)
    return result
