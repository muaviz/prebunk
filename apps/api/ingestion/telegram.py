import os
import logging
from ingestion.base import BaseIngestor

logger = logging.getLogger(__name__)

class TelegramIngestor(BaseIngestor):
    def __init__(self):
        self.api_id = os.getenv("TELEGRAM_API_ID")
        self.api_hash = os.getenv("TELEGRAM_API_HASH")
        if not self.api_id or not self.api_hash:
            logger.warning("TELEGRAM_API_ID or HASH not found. Telegram ingestor will use mock data.")
            self.has_keys = False
        else:
            self.has_keys = True
            # In a real app, initialize Telethon client here. 
            # Note: requires an interactive session or session string.

    def fetch_latest(self) -> list[str]:
        if not self.has_keys:
            return [
                "Forwarded message: All these refugees are actually an invading army.",
                "Check out this shocking poll on what they really think about our values.",
                "Just having a normal chat in a public group."
            ]
        
        # Real implementation would await client.get_messages(entity, limit=20)
        return []
