from config import settings
import tweepy
import logging
from ingestion.base import BaseIngestor

logger = logging.getLogger(__name__)

class TwitterIngestor(BaseIngestor):
    def __init__(self):
        bearer_token = settings.twitter_bearer_token
        if bearer_token:
            self.client = tweepy.Client(bearer_token=bearer_token)
            self.has_keys = True
        else:
            logger.warning("TWITTER_BEARER_TOKEN not found. Twitter ingestor will use mock data.")
            self.has_keys = False

    def fetch_latest(self) -> list[str]:
        if not self.has_keys:
            # Mock data for testing when no API keys are provided
            return [
                "They are secretly replacing our laws with Sharia courts in London",
                "Did you see the stats? The birth rates are completely out of control, demographic replacement is real.",
                "Halal certification is just a tax to fund terrorism.",
                "Completely unrelated tweet about sports today."
            ]

        # In a real implementation, you might search for specific keywords or accounts
        # Here we just do a generic recent search as an example
        query = "sharia OR halal OR replacement -is:retweet"
        try:
            response = self.client.search_recent_tweets(query=query, max_results=20)
            if response.data:
                return [tweet.text for tweet in response.data]
            return []
        except Exception as e:
            logger.error(f"Error fetching from Twitter: {e}")
            return []
