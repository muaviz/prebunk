from routers import alerts, digest, forecast
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings

from routers import narratives, vrs, briefs, subscribers, tips, ingest

app = FastAPI(title="Prebunk API")

origins = []
if settings.cors_origins:
    origins = [origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(narratives.router)
app.include_router(vrs.router)
app.include_router(briefs.router)
app.include_router(subscribers.router)
app.include_router(tips.router)
app.include_router(alerts.router)
app.include_router(digest.router)
app.include_router(forecast.router)
app.include_router(ingest.router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}
