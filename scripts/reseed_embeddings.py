import sys
import os
import json

# Add apps/api to path so we can import the model
sys.path.append(os.path.join(os.path.dirname(__file__), '../apps/api'))

from services.embeddings import embed_text
from supabase import create_client

# Load env variables from .env
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Error: Missing Supabase credentials in .env")
    sys.exit(1)

supabase = create_client(url, key)

with open(os.path.join(os.path.dirname(__file__), '../data/claims.json'), 'r', encoding='utf-8') as f:
    claims = json.load(f)

print("Regenerating embeddings with new model (all-MiniLM-L6-v2)...")

for claim in claims:
    print(f"Embedding: {claim['id']} - {claim['title']}")
    # The original seed likely embedded the claim_text or title+description
    text_to_embed = f"{claim['title']}\n{claim['claim_text']}\n{claim['description']}"
    
    embedding = embed_text(text_to_embed)
    
    # Update Supabase
    supabase.table('claims').update({
        'embedding': json.dumps(embedding)
    }).eq('id', claim['id']).execute()

print("Database successfully reseeded with new embeddings!")
