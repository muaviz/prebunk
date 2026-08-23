import sys
from pathlib import Path
api_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(api_dir))

from db import supabase
from services.embeddings import embed_text

def compute():
    res = supabase.table("claims").select("id, title, claim_text, semantic_anchors").execute()
    for claim in res.data:
        text = f"{claim['title']}. {claim['claim_text']}. {' '.join(claim.get('semantic_anchors', []))}"
        embedding = embed_text(text)
        if embedding:
            supabase.table("claims").update({"embedding": embedding}).eq("id", claim["id"]).execute()
            print(f"Embedded: {claim['title']}")
        else:
            print(f"FAILED: {claim['title']}")

if __name__ == "__main__":
    compute()
