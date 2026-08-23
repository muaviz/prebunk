import json
import os
import sys
from pathlib import Path

# Add the apps/api directory to the path so we can import config and db
api_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(api_dir))

from config import settings
from db import supabase

def seed_taxonomy():
    data_dir = api_dir.parent.parent / "data" / "taxonomy"
    
    with open(data_dir / "clusters.json") as f:
        clusters = json.load(f)
    with open(data_dir / "techniques.json") as f:
        techniques = json.load(f)
    with open(data_dir / "narratives.json") as f:
        narratives = json.load(f)

    print("Seeding clusters...")
    supabase.table("clusters").upsert(clusters).execute()
    
    print("Seeding techniques...")
    supabase.table("techniques").upsert(techniques).execute()
    
    print("Seeding narratives...")
    # Add a mock embedding for now just so it inserts successfully if the schema is strict, 
    # but the embedding column can be null. We'll rely on it being null until phase 3.
    for n in narratives:
        if 'embedding' not in n:
            pass # Keep it null
    supabase.table("narratives").upsert(narratives).execute()

    print("Taxonomy seeded successfully.")

if __name__ == "__main__":
    seed_taxonomy()
