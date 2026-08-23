import sys
from pathlib import Path
import asyncio

api_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(api_dir))

from ingestion.pipeline import IngestionPipeline

async def main():
    print("Starting ingestion pipeline...")
    pipeline = IngestionPipeline()
    pipeline.run()
    print("Pipeline completed successfully.")

if __name__ == "__main__":
    asyncio.run(main())
