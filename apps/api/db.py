from supabase import create_client, Client
from config import settings

# Strip /rest/v1/ or /rest/v1 if present in the URL, as the python client adds it automatically
base_url = settings.supabase_url.split('/rest/v1')[0]
if base_url.endswith('/'):
    base_url = base_url[:-1]

# Initialize the Supabase client with the service role key for backend operations
supabase: Client = create_client(
    base_url,
    settings.supabase_service_role_key
)
