from sentence_transformers import SentenceTransformer
import logging
import threading

logger = logging.getLogger(__name__)

_model = None
_model_lock = threading.Lock()

def get_model():
    global _model
    if _model is None:
        with _model_lock:
            if _model is None:
                logger.info("Loading SBERT model...")
                _model = SentenceTransformer('all-mpnet-base-v2')
                logger.info("SBERT model loaded.")
    return _model

def embed_text(text: str) -> list[float]:
    model = get_model()
    try:
        embedding = model.encode(text)
        return embedding.tolist()
    except Exception as e:
        logger.error(f"Failed to embed text: {e}")
        return []

def embed_texts(texts: list[str]) -> list[list[float]]:
    model = get_model()
    try:
        embeddings = model.encode(texts)
        return embeddings.tolist()
    except Exception as e:
        logger.error(f"Failed to embed texts: {e}")
        return []
