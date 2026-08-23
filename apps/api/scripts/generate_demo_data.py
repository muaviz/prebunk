import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import supabase
from datetime import datetime, timedelta
import uuid
import random

def run():
    print("Fetching narratives...")
    res = supabase.table("narratives").select("id, name").execute()
    narratives = res.data
    
    if not narratives:
        print("No narratives found. Run seed_taxonomy.py first.")
        return
        
    print(f"Found {len(narratives)} narratives. Generating 7 days of VRS history...")
    
    # We want a mix of trends.
    # 2 trending up, 2 stable, rest declining or flat.
    
    now = datetime.utcnow()
    vrs_records = []
    
    for i, nar in enumerate(narratives):
        base_score = random.uniform(10.0, 40.0)
        trend = 0
        if i == 0 or i == 1:
            trend = random.uniform(5.0, 10.0) # Upward
            base_score = 40.0
        elif i == 2 or i == 3:
            trend = random.uniform(-1.0, 1.0) # Stable
            base_score = 60.0
        else:
            trend = random.uniform(-5.0, -2.0) # Downward
            base_score = 50.0
            
        current_score = base_score
        
        # Start from 7 days ago and go to today
        for day_offset in range(7, -1, -1):
            date = now - timedelta(days=day_offset)
            
            # Add some noise
            noise = random.uniform(-3.0, 3.0)
            score = max(0.0, min(100.0, current_score + noise))
            
            # Update base for next day
            current_score = max(0.0, min(100.0, current_score + trend))
            
            vrs_records.append({
                "id": str(uuid.uuid4()),
                "narrative_id": nar["id"],
                "score": round(score, 1),
                "raw_volume": int(score * random.uniform(10, 50)),
                "acceleration": round(trend + random.uniform(-1.0, 1.0), 2),
                "cross_platform_count": random.randint(1, 4),
                "computed_at": date.isoformat(),
                "created_at": date.isoformat()
            })
            
    # Clear existing VRS data and insert new
    print("Clearing existing VRS scores...")
    supabase.table("vrs_scores").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    
    print("Inserting new VRS scores...")
    # Chunk insert
    chunk_size = 50
    for i in range(0, len(vrs_records), chunk_size):
        supabase.table("vrs_scores").insert(vrs_records[i:i+chunk_size]).execute()
        
    print("Generating demo briefs...")
    # Clear existing briefs
    supabase.table("briefs").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    
    briefs = []
    
    # Generate briefs for the top 3 narratives
    top_narratives = narratives[:3]
    for nar in top_narratives:
        brief_id = str(uuid.uuid4())
        
        content = {
            "summary": f"This brief addresses the '{nar['name']}' narrative, which is currently trending. It relies on structural conspiracy tropes.",
            "technique_explanation": "This narrative uses emotional manipulation and out-of-context statistics to present isolated incidents as a coordinated threat.",
            "narrative_context": "Recently, this narrative has spiked across secondary platforms and is being laundered into mainstream discourse through 'just asking questions' tactics.",
            "talking_points": [
                "The core claim misrepresents established demographic data.",
                "Similar claims have been repeatedly debunked by independent fact-checkers.",
                "The narrative frequently recycles imagery from unrelated events."
            ],
            "personal_script": "I understand you're concerned about this, but the information being shared actually misrepresents the facts. The original source was shown to have altered the context to create fear. Let's look at the verified data together.",
            "discussion_questions": [
                "Why do you think the original author chose to omit the broader context?",
                "How does this narrative benefit the platforms hosting it?"
            ]
        }
        
        briefs.append({
            "id": brief_id,
            "narrative_id": nar["id"],
            "trigger_type": "on_demand",
            "vrs_at_generation": random.uniform(65.0, 85.0),
            "title": f"Inoculation Brief: {nar['name']}",
            "content": content,
            "language": "en",
            "validation_outcome": "passed",
            "version": 1,
            "created_at": (now - timedelta(days=random.randint(0, 3))).isoformat()
        })
        
    print("Inserting briefs...")
    supabase.table("briefs").insert(briefs).execute()
    
    print("Demo data generation complete!")

if __name__ == "__main__":
    run()
