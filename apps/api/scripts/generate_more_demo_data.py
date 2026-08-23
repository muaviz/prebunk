import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import supabase
from datetime import datetime, timedelta, timezone
import uuid
import random

def run():
    print("Fetching narratives...")
    res = supabase.table("narratives").select("id, name").execute()
    narratives = res.data
    
    if not narratives:
        return
        
    print(f"Generating briefs for all {len(narratives)} narratives...")
    now = datetime.now(timezone.utc)
    briefs = []
    
    for nar in narratives:
        num_briefs = random.randint(1, 3)
        for _ in range(num_briefs):
            brief_id = str(uuid.uuid4())
            
            content = {
                "summary": f"This brief addresses the '{nar['name']}' narrative, which is currently seeing increased volume across platforms.",
                "technique_explanation": "This narrative relies heavily on emotional manipulation and out-of-context statistics.",
                "narrative_context": "Recently, this narrative has spiked across secondary platforms and is being laundered into mainstream discourse.",
                "talking_points": [
                    "The core claim misrepresents established data.",
                    "Similar claims have been repeatedly debunked by independent fact-checkers.",
                    "The narrative frequently recycles imagery from unrelated events."
                ],
                "personal_script": "I understand you're concerned about this, but the information being shared actually misrepresents the facts. Let's look at the verified data together.",
                "discussion_questions": [
                    "Why do you think the original author chose to omit the broader context?",
                    "How does this narrative benefit the platforms hosting it?"
                ]
            }
            
            briefs.append({
                "id": brief_id,
                "narrative_id": nar["id"],
                "trigger_type": "on_demand",
                "vrs_at_generation": random.uniform(50.0, 95.0),
                "title": f"Inoculation Brief: {nar['name']} ({random.randint(100, 999)})",
                "content": content,
                "language": "en",
                "validation_outcome": "passed",
                "version": 1,
                "created_at": (now - timedelta(days=random.randint(0, 30))).isoformat()
            })
            
    print("Inserting briefs...")
    chunk_size = 50
    for i in range(0, len(briefs), chunk_size):
        supabase.table("briefs").insert(briefs[i:i+chunk_size]).execute()
    
    print("Generating extra VRS scores for older history (30 days)...")
    vrs_records = []
    for nar in narratives:
        current_score = random.uniform(10.0, 30.0)
        for day_offset in range(30, 7, -1):
            date = now - timedelta(days=day_offset)
            trend = random.uniform(-2.0, 2.5)
            noise = random.uniform(-5.0, 5.0)
            score = max(0.0, min(100.0, current_score + noise))
            current_score = max(0.0, min(100.0, current_score + trend))
            
            vrs_records.append({
                "id": str(uuid.uuid4()),
                "narrative_id": nar["id"],
                "score": round(score, 1),
                "raw_volume": int(score * random.uniform(5, 40)),
                "acceleration": round(trend + random.uniform(-0.5, 0.5), 2),
                "cross_platform_count": random.randint(1, 4),
                "computed_at": date.isoformat(),
                "created_at": date.isoformat()
            })

    print("Inserting older VRS scores...")
    for i in range(0, len(vrs_records), chunk_size):
        supabase.table("vrs_scores").insert(vrs_records[i:i+chunk_size]).execute()

    print("Generation complete!")

if __name__ == "__main__":
    run()
