from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Refutation(BaseModel):
    claim: str
    refutation: str
    source_name: str
    source_url: str
    source_type: str  # "wikipedia", "quran", "hadith", "academic", "islamqa", "factcheck", "news"

class PromoterLink(BaseModel):
    name: str
    url: str
    platform: str # "twitter", "reddit", "news", etc

class ClaimResponse(BaseModel):
    id: str
    title: str
    claim_text: str
    description: str
    category: str
    virality_score: int
    is_featured: bool
    refutations: list[Refutation] = []
    promoter_links: list[PromoterLink] = []
    talking_points: list[str] = []
    personal_script: Optional[str] = None
    semantic_anchors: list[str] = []
    created_at: Optional[datetime] = None
