from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="../../.env", env_file_encoding="utf-8", extra="ignore")

    supabase_url: str
    supabase_service_role_key: str
    
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"
    reddit_client_id: str | None = None
    reddit_client_secret: str | None = None
    reddit_user_agent: str | None = None
    
    twitter_bearer_token: str | None = None
    telegram_api_id: str | None = None
    telegram_api_hash: str | None = None
    
    resend_api_key: str = ""
    resend_from_email: str = "onboarding@resend.dev"
    
    cors_origins: str = "http://localhost:3000"
    frontend_base_url: str = "http://localhost:3000"

settings = Settings()
