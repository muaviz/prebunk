from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class BriefContent(BaseModel):
    technique_explanation: str
    narrative_context: str
    talking_points: list[str]
    personal_script: str
    discussion_questions: list[str]
    summary: str

class Brief(BaseModel):
    id: str
    narrative_id: str
    trigger_type: str
    vrs_at_generation: Optional[float] = None
    title: str
    content: BriefContent
    language: str
    validation_outcome: str
    version: int
    created_at: datetime

class BriefCreate(BaseModel):
    narrative_id: str
    trigger_type: str
