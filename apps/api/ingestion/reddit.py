import logging

logger = logging.getLogger(__name__)

class RedditIngestor:
    def __init__(self):
        self.platform = "reddit"
        
    def fetch_recent_posts(self):
        logger.warning("Reddit ingestion is disabled because Reddit no longer offers self-serve API access.")
        return []
