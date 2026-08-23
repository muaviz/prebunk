import logging
from datetime import datetime
from ingestion.x_twitter import TwitterIngestor
from ingestion.telegram import TelegramIngestor
from ingestion.rss_news import RSSIngestor
from services.matcher import match_text
from services.velocity import compute_vrs_scores
from db import supabase

logger = logging.getLogger(__name__)

class IngestionPipeline:
    def __init__(self):
        self.ingestors = {
            "twitter": TwitterIngestor(),
            "telegram": TelegramIngestor(),
            "rss": RSSIngestor()
        }

    def run(self):
        logger.info("Starting ingestion pipeline...")
        new_events = []
        
        for platform, ingestor in self.ingestors.items():
            logger.info(f"Fetching from {platform}...")
            try:
                texts = ingestor.fetch_latest()
                logger.info(f"Fetched {len(texts)} items from {platform}.")
                
                for text in texts:
                    matches = match_text(text, threshold=0.5)
                    for match in matches:
                        new_events.append({
                            "narrative_id": match.narrative_id,
                            "platform": platform,
                            "similarity_score": match.similarity_score,
                            "country": "Unknown",
                            "recorded_at": datetime.utcnow().isoformat()
                        })
                        
            except Exception as e:
                logger.error(f"Error processing {platform}: {e}")
                
        if new_events:
            logger.info(f"Found {len(new_events)} semantic matches. Recording events.")
            try:
                supabase.table("narrative_events").insert(new_events).execute()
                logger.info("Events recorded successfully.")
            except Exception as e:
                logger.error(f"Failed to record events to database: {e}")
        else:
            logger.info("No matches found above threshold.")
            
        logger.info("Computing new VRS scores...")
        try:
            scores = compute_vrs_scores()
            logger.info(f"Computed {len(scores)} VRS scores.")
        except Exception as e:
            logger.error(f"Failed to compute VRS scores: {e}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    pipeline = IngestionPipeline()
    pipeline.run()
