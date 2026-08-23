import time
import json
import numpy as np
from db import supabase
from services.embeddings import embed_text
from models.narrative import NarrativeMatch

# Cache embeddings in memory to avoid fetching from DB on every match
_narratives_cache = []
_last_cache_update = 0
CACHE_TTL = 3600  # 1 hour

def _refresh_cache_if_needed():
    global _narratives_cache, _last_cache_update
    now = time.time()
    if now - _last_cache_update > CACHE_TTL or not _narratives_cache:
        res = supabase.table("narratives").select("id, name, embedding").execute()
        if res.data:
            # Only keep narratives that have an embedding
            _narratives_cache = [n for n in res.data if n.get("embedding")]
            _last_cache_update = now

def cosine_similarity(a: list[float], b: list[float]) -> float:
    a_vec = np.array(a)
    b_vec = np.array(b)
    if np.linalg.norm(a_vec) == 0 or np.linalg.norm(b_vec) == 0:
        return 0.0
    return float(np.dot(a_vec, b_vec) / (np.linalg.norm(a_vec) * np.linalg.norm(b_vec)))

def match_text(text: str, threshold: float = 0.45) -> list[NarrativeMatch]:
    _refresh_cache_if_needed()
    if not _narratives_cache:
        return []

    input_embedding = embed_text(text)
    
    matches = []
    for narrative in _narratives_cache:
        emb = narrative["embedding"]
        if isinstance(emb, str):
            # Parse string representation of vector if returned as such
            emb = json.loads(emb)
            
        score = cosine_similarity(input_embedding, emb)
        if score >= threshold:
            matches.append(NarrativeMatch(
                narrative_id=narrative["id"],
                narrative_name=narrative["name"],
                similarity_score=score
            ))

    # Sort matches by similarity score descending
    matches.sort(key=lambda x: x.similarity_score, reverse=True)
    return matches
