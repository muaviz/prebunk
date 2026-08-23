import datetime
import random
import math
import sys
from pathlib import Path

api_dir = Path("apps/api").resolve()
sys.path.append(str(api_dir))

from db import supabase

def seed():
    print("Fetching narratives...")
    n_res = supabase.table("narratives").select("id").execute()
    narratives = [n['id'] for n in n_res.data]
    
    if not narratives:
        print("No narratives found!")
        return
        
    print(f"Generating 40 days of history for {len(narratives)} narratives...")
    
    now = datetime.datetime.utcnow()
    
    new_scores = []
    
    for n_id in narratives:
        # Base score varies per narrative
        base_score = random.uniform(5.0, 20.0)
        volatility = random.uniform(2.0, 10.0)
        
        # Add a spike if this is one of the top narratives
        has_spike = random.random() > 0.7
        spike_day = random.randint(5, 30)
        
        for day in range(40, -1, -1):
            dt = now - datetime.timedelta(days=day)
            
            # Sine wave trend + noise
            trend = math.sin(day / 5.0) * volatility
            score = base_score + trend + random.uniform(-2, 2)
            
            if has_spike and abs(day - spike_day) < 3:
                score += random.uniform(30, 50)
                
            score = max(0.0, min(100.0, score))
            
            new_scores.append({
                "narrative_id": n_id,
                "score": round(score, 2),
                "raw_volume": int(score / 5),
                "acceleration": round(random.uniform(0.5, 3.0), 2),
                "cross_platform_count": random.randint(1, 4),
                "computed_at": dt.isoformat()
            })
            
    print(f"Inserting {len(new_scores)} historical records...")
    
    # Chunk inserts (Supabase limit is usually 1000)
    chunk_size = 500
    for i in range(0, len(new_scores), chunk_size):
        chunk = new_scores[i:i+chunk_size]
        supabase.table("vrs_scores").insert(chunk).execute()
        
    print("Done!")

if __name__ == "__main__":
    seed()
