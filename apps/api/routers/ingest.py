from fastapi import APIRouter, BackgroundTasks
from ingestion.pipeline import IngestionPipeline

router = APIRouter(prefix="/ingest", tags=["ingest"])

def run_pipeline_task():
    pipeline = IngestionPipeline()
    pipeline.run()

@router.post("/run")
async def trigger_ingestion(background_tasks: BackgroundTasks):
    background_tasks.add_task(run_pipeline_task)
    return {"status": "accepted", "message": "Ingestion pipeline triggered in background"}
