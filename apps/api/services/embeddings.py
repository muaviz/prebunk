import logging
from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)

# Initialize model once at module level (singleton)
logger.info("Loading SBERT model (all-mpnet-base-v2)...")
try:
    model = SentenceTransformer('all-mpnet-base-v2')
    logger.info("Model loaded successfully.")
except Exception as e:
    logger.error(f"Failed to load model: {e}")
    model = None

def embed_text(text: str) -> list[float]:
    """Computes the embedding for a single text."""
    if not model:
        raise RuntimeError("Model is not loaded.")
    embedding = model.encode(text)
    return embedding.tolist()

def embed_texts(texts: list[str]) -> list[list[float]]:
    """Computes embeddings for a batch of texts."""
    if not model:
        raise RuntimeError("Model is not loaded.")
    embeddings = model.encode(texts)
    return embeddings.tolist()
