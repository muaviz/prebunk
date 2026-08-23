import sys
from pathlib import Path

api_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(api_dir))

from db import supabase

def seed_admin_user():
    email = "admin@prebunk.org"
    password = "password123"
    
    try:
        user = supabase.auth.admin.create_user({
            "email": email,
            "password": password,
            "email_confirm": True
        })
        print(f"Successfully created test user: {email} / {password}")
    except Exception as e:
        if "already registered" in str(e).lower() or "already exists" in str(e).lower():
            print(f"User {email} already exists! You can log in with password: {password}")
        else:
            print(f"Failed to create user: {e}")

if __name__ == "__main__":
    seed_admin_user()
