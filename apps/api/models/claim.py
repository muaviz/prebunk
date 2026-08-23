from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Refutation(BaseModel):
    claim: str
    refutation: str
    source_name: str
    source_url: str
    source_type: str  # "wikipedia", "quran", "hadith", "academic", "islamqa", "factcheck", "news"

class ClaimResponse(BaseModel):
    id: str
    title: str
    claim_text: str
    description: str
    category: str
    virality_score: int
    is_featured: bool
    refutations: list[Refutation]
    talking_points: list[str]
    personal_script: Optional[str]
    semantic_anchors: list[str]
    created_at: Optional[datetime] = None
