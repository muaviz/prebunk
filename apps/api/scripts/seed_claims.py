import json
import sys
from pathlib import Path

api_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(api_dir))

from db import supabase

def seed_claims():
    data_path = api_dir.parent.parent / "data" / "claims.json"
    with open(data_path) as f:
        claims = json.load(f)

    print(f"Seeding {len(claims)} claims...")
    supabase.table("claims").upsert(claims).execute()
    print("Claims seeded successfully.")

if __name__ == "__main__":
    seed_claims()
