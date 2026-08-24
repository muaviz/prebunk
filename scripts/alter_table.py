import sys
import os

# Load env variables from .env
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))

from supabase import create_client

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)

res = supabase.rpc("alter_embedding_dim", {}).execute()
print(res)
