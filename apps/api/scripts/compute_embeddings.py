import os
import sys
from pathlib import Path
import json

api_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(api_dir))

from db import supabase
from services.embeddings import embed_text

def compute_and_store_embeddings():
    print("Fetching narratives from database...")
    res = supabase.table("narratives").select("id, semantic_anchors").execute()
    narratives = res.data
    
    if not narratives:
        print("No narratives found.")
        return

    print(f"Computing embeddings for {len(narratives)} narratives...")
    updated_count = 0
    for narrative in narratives:
        anchors = narrative.get("semantic_anchors", [])
        if not anchors:
            text = ""
        else:
            text = " ".join(anchors)
            
        if text.strip():
            embedding = embed_text(text)
            # Store embedding as string to easily upsert back into pgvector via REST
            embedding_str = json.dumps(embedding)
            
            supabase.table("narratives").update({"embedding": embedding_str}).eq("id", narrative["id"]).execute()
            updated_count += 1
            print(f"Updated embedding for {narrative['id']}")
            
    print(f"Computed embeddings for {updated_count} narratives.")

if __name__ == "__main__":
    compute_and_store_embeddings()
