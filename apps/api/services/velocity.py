import math
from datetime import datetime, timedelta
from db import supabase

def compute_vrs_scores():
    """
    Computes Velocity & Reach Score (VRS) for all narratives based on recent events.
    Formula weights: Volume (40%) + Acceleration (30%) + Cross-Platform (30%)
    """
    # For simplicity in this demo, we'll fetch events from the last 7 days
    now = datetime.utcnow()
    seven_days_ago = (now - timedelta(days=7)).isoformat()
    
    # Get all active narratives
    narratives_res = supabase.table("narratives").select("id").execute()
    narratives = [n['id'] for n in narratives_res.data]
    
    # Get recent events
    events_res = supabase.table("narrative_events").select("*").gte("recorded_at", seven_days_ago).execute()
    events = events_res.data
    
    # Process events per narrative
    new_vrs_scores = []
    
    for n_id in narratives:
        n_events = [e for e in events if e["narrative_id"] == n_id]
        
        raw_volume = len(n_events)
        platforms = set(e["platform"] for e in n_events)
        cross_platform_count = len(platforms)
        
        # Simple acceleration: compare last 24 hours to previous 6 days
        one_day_ago = (now - timedelta(days=1)).isoformat()
        recent_events = sum(1 for e in n_events if e["recorded_at"] >= one_day_ago)
        older_events = raw_volume - recent_events
        
        # Avoid division by zero
        if older_events == 0:
            acceleration = float(recent_events)
        else:
            acceleration = recent_events / (older_events / 6.0)
            
        # Normalize scores (0-100 scale heuristics)
        norm_volume = min(100, raw_volume * 5) # 20 events = 100 volume score
        norm_accel = min(100, acceleration * 20) # 5x acceleration = 100 score
        norm_platform = min(100, cross_platform_count * 33.3) # 3 platforms = ~100 score
        
        # Compute final VRS
        score = (norm_volume * 0.40) + (norm_accel * 0.30) + (norm_platform * 0.30)
        
        new_vrs_scores.append({
            "narrative_id": n_id,
            "score": round(score, 2),
            "raw_volume": raw_volume,
            "acceleration": round(acceleration, 2),
            "cross_platform_count": cross_platform_count,
            "computed_at": now.isoformat()
        })
        
    if new_vrs_scores:
        supabase.table("vrs_scores").insert(new_vrs_scores).execute()
        
    return new_vrs_scores
