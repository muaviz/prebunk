---
name: local-ml-workflows
description: Instructions for managing the local Python ML models, including SBERT for pattern matching and Prophet for forecasting.
---

# Local ML Workflows

Prebunk uses local Machine Learning models for its analysis layer to ensure privacy and avoid sending sensitive data to third-party APIs.

## Sentence-Transformers (Pattern Matcher)
- **Model Choice:** Use `all-mpnet-base-v2` via the `sentence-transformers` library for generating embeddings.
- **Caching:** Ensure the model weights are downloaded once and cached locally. Avoid re-downloading weights on every script run.
- **Matching Logic:** Compare incoming text embeddings against the taxonomy centroids using cosine similarity. Maintain a tunable threshold to balance false positives and false negatives.

## Prophet (Forecast Model)
- **Time-Series Forecasting:** Use Facebook's `Prophet` library to project 48-72 hour trajectories of the Virality Risk Score (VRS).
- **Seasonality:** Configure Prophet to account for weekly social media seasonality and event-based spikes.

## Environment Management
- Ensure all ML dependencies (e.g., `torch`, `sentence-transformers`, `prophet`, `pandas`) are cleanly managed in a virtual environment (`venv` or `conda`) or documented in a `requirements.txt`.
