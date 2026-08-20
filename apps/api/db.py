from supabase import create_client, Client
from config import settings

# Initialize the Supabase client with the service role key for backend operations
supabase: Client = create_client(
    settings.supabase_url,
    settings.supabase_service_role_key
)
