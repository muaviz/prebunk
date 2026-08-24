from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

ROOT_ENV = Path(__file__).resolve().parent.parent.parent / ".env"

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=ROOT_ENV, env_file_encoding="utf-8", extra="ignore")

    supabase_url: str
    supabase_service_role_key: str
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"
    cors_origins: str = "http://localhost:3000,https://prebunk.vercel.app"

settings = Settings()
