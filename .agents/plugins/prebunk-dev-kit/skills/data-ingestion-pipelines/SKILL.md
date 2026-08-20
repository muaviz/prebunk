---
name: data-ingestion-pipelines
description: Runbooks and protocols for developing and maintaining the external data ingestion APIs (Twitter, Reddit, Telegram, RSS) for Prebunk.
---

# Data Ingestion Pipelines

The ingestion layer is responsible for tracking narrative velocity across public social media platforms. When working on these pipelines, observe the following rules:

## General Principles
- **No Raw Data Storage:** Only ingest and process metadata. Immediately discard raw post content after semantic matching. Only retain narrative ID, platform, timestamp, and calculated velocity score to comply with privacy and safety standards.
- **Rate Limiting:** Always implement exponential backoff and adhere strictly to rate limits for each API (e.g., Reddit PRAW limits, Twitter/X API v2 quotas).

## Specific API Integrations
- **Reddit (PRAW):** Monitor specified high-propagation subreddits. Track upvote velocity.
- **Telegram (Telethon):** Connect only to *public* channels. Never attempt to access private chats or user data.
- **Twitter/X:** Use the filtered stream API targeting specific keywords from the Narrative Taxonomy.
- **RSS Feeds:** Parse headlines and summaries only; avoid full-text scraping to respect copyright.

## Testing and Mocking
- When developing or debugging the ingestion layer, use mock data and mock API responses rather than hitting live production endpoints to prevent quota exhaustion or IP bans.
