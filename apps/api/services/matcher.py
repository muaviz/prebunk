import time
from db import supabase
from pydantic import BaseModel
from services.embeddings import embed_text
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class NarrativeMatch(BaseModel):
    narrative_id: str
    narrative_name: str
    similarity_score: float

_narratives_cache = []
_last_cache_update = 0
_cache_initialized = False
CACHE_TTL = 3600  # 1 hour

def get_narratives_cache():
    global _narratives_cache, _last_cache_update, _cache_initialized
    now = time.time()
    
    if now - _last_cache_update > CACHE_TTL or not _cache_initialized:
        res = supabase.table("narratives").select("id, name, embedding").execute()
        if res.data is not None:
            _narratives_cache = [n for n in res.data if n.get("embedding")]
            _last_cache_update = now
            _cache_initialized = True
            
    return _narratives_cache

def match_text(text: str, threshold: float = 0.45) -> list[NarrativeMatch]:
    cache = get_narratives_cache()
    if not cache:
        return []
        
    query_embedding = embed_text(text)
    if not query_embedding:
        return []
        
    # Prepare matrix
    narrative_ids = [n["id"] for n in cache]
    narrative_names = [n["name"] for n in cache]
    import json
    embeddings_matrix = np.array([json.loads(n["embedding"]) if isinstance(n["embedding"], str) else n["embedding"] for n in cache])
    
    # Compute cosine similarity
    query_vec = np.array([query_embedding])
    similarities = cosine_similarity(query_vec, embeddings_matrix)[0]
    
    matches = []
    for i, score in enumerate(similarities):
        if score >= threshold:
            matches.append(NarrativeMatch(
                narrative_id=narrative_ids[i],
                narrative_name=narrative_names[i],
                similarity_score=float(score)
            ))
            
    # Sort by score descending
    matches.sort(key=lambda x: x.similarity_score, reverse=True)
    return matches

from services.embeddings import embed_texts

def match_texts(texts: list[str], threshold: float = 0.45) -> list[list[NarrativeMatch]]:
    cache = get_narratives_cache()
    if not cache or not texts:
        return [[] for _ in texts]
        
    query_embeddings = embed_texts(texts)
    if not query_embeddings:
        return [[] for _ in texts]
        
    narrative_ids = [n["id"] for n in cache]
    narrative_names = [n["name"] for n in cache]
    import json
    embeddings_matrix = np.array([json.loads(n["embedding"]) if isinstance(n["embedding"], str) else n["embedding"] for n in cache])
    
    query_matrix = np.array(query_embeddings)
    similarities_matrix = cosine_similarity(query_matrix, embeddings_matrix)
    
    all_matches = []
    for similarities in similarities_matrix:
        matches = []
        for i, score in enumerate(similarities):
            if score >= threshold:
                matches.append(NarrativeMatch(
                    narrative_id=narrative_ids[i],
                    narrative_name=narrative_names[i],
                    similarity_score=float(score)
                ))
        matches.sort(key=lambda x: x.similarity_score, reverse=True)
        all_matches.append(matches)
        
    return all_matches
