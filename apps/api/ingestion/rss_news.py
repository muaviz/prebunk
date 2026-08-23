import feedparser
import logging
from ingestion.base import BaseIngestor

logger = logging.getLogger(__name__)

class RSSIngestor(BaseIngestor):
    def __init__(self, feed_urls: list[str] = None):
        # We can add URLs of news sites or blogs to monitor.
        # If none provided, use some defaults or empty list.
        self.feed_urls = feed_urls or [
            # Example default feeds (could be populated from DB or config)
            # "http://feeds.bbci.co.uk/news/rss.xml",
        ]

    def fetch_latest(self) -> list[str]:
        texts = []
        if not self.feed_urls:
            # Provide mock data if no feeds are configured
            return [
                "Breaking: Fake crime stats show massive increase in migrant crime.",
                "Opinion: The gradual takeover of our institutions."
            ]

        for url in self.feed_urls:
            try:
                feed = feedparser.parse(url)
                for entry in feed.entries[:10]: # Limit to top 10 per feed
                    # Combine title and summary
                    content = entry.title
                    if hasattr(entry, 'summary'):
                        content += " " + entry.summary
                    texts.append(content)
            except Exception as e:
                logger.error(f"Error parsing feed {url}: {e}")

        return texts
