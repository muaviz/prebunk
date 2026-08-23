from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from ingestion.pipeline import IngestionPipeline

router = APIRouter(prefix="/ingest", tags=["ingest"])

class IngestRequest(BaseModel):
    sources: list[str] = ["rss", "mock"]

class IngestResponse(BaseModel):
    status: str
    message: str
    sources_triggered: list[str]

def run_pipeline_task(sources: list[str]):
    pipeline = IngestionPipeline()
    pipeline.run(sources=sources)

@router.post("/run", response_model=IngestResponse)
async def trigger_ingestion(req: IngestRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(run_pipeline_task, req.sources)
    return IngestResponse(
        status="accepted", 
        message="Ingestion pipeline triggered in background",
        sources_triggered=req.sources
    )
