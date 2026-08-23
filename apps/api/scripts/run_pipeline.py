import sys
from pathlib import Path

api_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(api_dir))

from ingestion.pipeline import IngestionPipeline
import logging

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    pipeline = IngestionPipeline()
    pipeline.run()
