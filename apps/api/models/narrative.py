from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class FactualRefutation(BaseModel):
    claim: str
    refutation: str
    source: str

class Narrative(BaseModel):
    id: str
    name: str
    cluster_id: str
    technique_id: str
    description: str
    variants: list[str] = []
    historical_origin: Optional[str] = None
    propagation_path: Optional[str] = None
    factual_refutations: list[FactualRefutation] = []
    inoculation_hook: Optional[str] = None
    talking_points: list[str] = []
    related_narrative_ids: list[str] = []
    semantic_anchors: list[str] = []
    last_reviewed: Optional[datetime] = None
    created_at: datetime

class NarrativeResponse(Narrative):
    pass
