# PREBUNK — Complete Code Overhaul Plan

## Vision

Transform Prebunk from an academic analyst dashboard (with jargon like "Taxonomies", "Clusters", "VRS Scores", "Techniques") into a **consumer-facing app** that tells everyday users:

> "This claim is going viral this week. Prepare yourself."

When a user clicks "Prepare Yourself", they see a clean page with:
- A clear description of the claim
- Factual refutations with **real sources** (Wikipedia, Quran verses, Hadith, IslamQA)
- Talking points they can use in real conversations

The Chrome Extension remains: it detects hateful claims on any webpage and shows the refutation popup directly.

---

## Architecture After Overhaul

```
apps/
  web/          → Next.js frontend (simplified: Landing → Threats Feed → Claim Detail)
  api/          → FastAPI backend (simplified: claims + extension + health)
  extension/    → Chrome Extension (keep as-is, minor tweaks)
data/
  claims.json   → New: flat list of claims with refutations (replaces clusters/techniques/narratives split)
supabase/
  migrations/   → Simplified schema (drop 8 unused tables, create 1 new one)
```

---

## PHASE 1: Database Cleanup

**Goal:** Drop all tables and concepts that the public doesn't need. Keep only what powers the Threats Feed and the Extension.

### Tables to DROP (no longer needed)

| Table | Why it's removed |
|---|---|
| `clusters` | Academic grouping. Users don't care that a claim is in the "Demographic Threat" cluster. |
| `techniques` | Academic jargon ("Collective attribution", "Essentialization"). Not user-facing. |
| `vrs_scores` | Complex VRS graphs are removed. We replace with a simple `virality_score` integer on the claim itself. |
| `narrative_events` | Was feeding VRS computation. No longer needed. |
| `subscribers` | No user accounts in the new design. |
| `community_tips` | Was for subscriber-submitted tips. Removed with accounts. |
| `alerts` | Was for VRS-based threshold alerts to subscribers. Removed. |
| `briefs` | The "brief" concept is merged INTO each claim's detail page. No separate briefs table. |

### Tables to KEEP (modified)

| Table | Changes |
|---|---|
| `narratives` | **Renamed to `claims`**. Heavily simplified schema (see below). This is the single core table. |

### New `claims` table schema

Write a new migration `supabase/migrations/20001_create_claims.sql`:

```sql
-- Drop old tables (order matters due to foreign keys)
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS community_tips CASCADE;
DROP TABLE IF EXISTS briefs CASCADE;
DROP TABLE IF EXISTS subscribers CASCADE;
DROP TABLE IF EXISTS narrative_events CASCADE;
DROP TABLE IF EXISTS vrs_scores CASCADE;
DROP TABLE IF EXISTS narratives CASCADE;
DROP TABLE IF EXISTS techniques CASCADE;
DROP TABLE IF EXISTS clusters CASCADE;

CREATE TABLE claims (
  id TEXT PRIMARY KEY,                        -- e.g. "CLM-001"
  title TEXT NOT NULL,                        -- Short name: "The Great Replacement"
  claim_text TEXT NOT NULL,                   -- The actual hateful claim in plain English
  description TEXT NOT NULL,                  -- 2-3 paragraph explanation of why this is harmful
  category TEXT NOT NULL,                     -- Simple category: "Demographic", "Violence", "Cultural", "Conspiracy", "Legal", "Media"
  virality_score INTEGER DEFAULT 0,           -- 0-100, simple integer. Higher = more viral right now.
  is_featured BOOLEAN DEFAULT false,          -- If true, shown on the homepage hero section

  -- Refutation content (THE core value of the app)
  refutations JSONB NOT NULL DEFAULT '[]',    -- Array of {claim, refutation, source_name, source_url, source_type}
                                              -- source_type is one of: "wikipedia", "quran", "hadith", "academic", "news", "islamqa"

  talking_points TEXT[] DEFAULT '{}',         -- Simple bullet points for conversations
  personal_script TEXT,                       -- A ready-to-use reply the user can copy-paste

  -- For the Chrome Extension's SBERT matching
  semantic_anchors TEXT[] DEFAULT '{}',       -- Keywords/phrases that trigger a match
  embedding VECTOR(768),                      -- SBERT embedding for cosine similarity matching

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read claims" ON claims FOR SELECT USING (true);
```

**IMPORTANT:** The `refutations` JSONB column is the most important field. Each entry MUST have:
```json
{
  "claim": "Muslims are taking over Europe through birth rates",
  "refutation": "Birth rates among Muslims in Western countries have been declining...",
  "source_name": "Pew Research Center",
  "source_url": "https://www.pewresearch.org/...",
  "source_type": "academic"
}
```
Valid `source_type` values: `"wikipedia"`, `"quran"`, `"hadith"`, `"academic"`, `"news"`, `"islamqa"`, `"factcheck"`

---

## PHASE 2: Seed Data — Create `data/claims.json`

**Goal:** Replace `data/taxonomy/clusters.json`, `data/taxonomy/techniques.json`, and `data/taxonomy/narratives.json` with a single `data/claims.json` file.

### What to do

1. **Delete** the entire `data/taxonomy/` directory.
2. **Create** `data/claims.json` with 15-20 well-researched claims.

Each claim in the JSON file must follow this exact structure:

```json
{
  "id": "CLM-001",
  "title": "The Great Replacement",
  "claim_text": "Muslims are deliberately immigrating to Europe to replace the native population and establish Islamic dominance.",
  "description": "The 'Great Replacement' is a white supremacist conspiracy theory...",
  "category": "Demographic",
  "virality_score": 82,
  "is_featured": true,
  "refutations": [
    {
      "claim": "Muslims are outbreeding Europeans to take over.",
      "refutation": "Birth rates among Muslim communities in Europe have been steadily declining...",
      "source_name": "Pew Research Center",
      "source_url": "https://www.pewresearch.org/religion/2017/11/29/europes-growing-muslim-population/",
      "source_type": "academic"
    },
    {
      "claim": "Islam commands Muslims to conquer non-Muslim lands.",
      "refutation": "The Quran explicitly states 'There is no compulsion in religion' (2:256)...",
      "source_name": "Quran 2:256",
      "source_url": "https://quran.com/2/256",
      "source_type": "quran"
    },
    {
      "claim": "There is a coordinated plan for demographic replacement.",
      "refutation": "No evidence of any coordinated plan exists...",
      "source_name": "Wikipedia: Great Replacement",
      "source_url": "https://en.wikipedia.org/wiki/Great_Replacement",
      "source_type": "wikipedia"
    }
  ],
  "talking_points": [
    "Birth rates among Muslims in Europe are declining and converging with national averages.",
    "The 'Great Replacement' theory has been linked to multiple terrorist attacks.",
    "Migration is driven by economics and conflict, not a coordinated religious agenda."
  ],
  "personal_script": "I understand the concern about changing demographics, but the data doesn't support the idea of a deliberate 'replacement.'...",
  "semantic_anchors": [
    "great replacement", "replacing us", "outbreeding", "demographic jihad",
    "population replacement", "white genocide", "eurabia", "birth rates muslim"
  ]
}
```

### Categories to use (simple, not academic):
- `"Demographic"` — Claims about population, birth rates, immigration
- `"Violence"` — Claims that Islam is inherently violent / all Muslims are terrorists
- `"Cultural"` — Claims about incompatibility with Western values, Sharia law
- `"Conspiracy"` — Secret plots, global caliphate, taqiyya
- `"Media"` — Claims about media cover-ups, suppression of news
- `"Victimhood"` — Claims that Islamophobia is fake, false flags

### Source types to include in refutations:
For each claim, aim for 2-4 refutations with a MIX of these source types:
- `"quran"` — Direct Quran verse with link to quran.com
- `"hadith"` — Authentic hadith reference with link to sunnah.com
- `"wikipedia"` — Wikipedia article link
- `"academic"` — Pew Research, university studies, think tank reports
- `"islamqa"` — islamqa.info or similar scholarly Islamic Q&A
- `"factcheck"` — Snopes, FullFact, etc.
- `"news"` — Reputable news source (BBC, Reuters, etc.)

### Featured claims:
Set `is_featured: true` on 1-2 claims that you want highlighted on the homepage as "trending this week."
Set `virality_score` to a number between 0-100 for each claim. Featured claims should have scores above 70.

**IMPORTANT:** Take time to write high-quality, well-sourced content here. This is the heart of the product. Every refutation should have a REAL, working URL. Do not use placeholder URLs.

---

## PHASE 3: Backend Overhaul (`apps/api/`)

### 3.1 Files to DELETE entirely

| File/Directory | Reason |
|---|---|
| `routers/alerts.py` | No alerts system |
| `routers/clusters.py` | No clusters |
| `routers/digest.py` | No email digests |
| `routers/forecast.py` | No Prophet forecasting |
| `routers/ingest.py` | No ingestion pipeline in MVP |
| `routers/newsletter.py` | No newsletter signup |
| `routers/subscribers.py` | No user accounts |
| `routers/vrs.py` | No VRS scores |
| `routers/briefs.py` | Briefs merged into claims |
| `routers/narratives.py` | Replaced by `claims.py` |
| `services/brief_generator.py` | Briefs merged into claims |
| `services/brief_validator.py` | No separate brief validation |
| `services/digest_builder.py` | No digests |
| `services/email_service.py` | No emails |
| `services/forecast.py` | No forecasting |
| `services/velocity.py` | No VRS computation |
| `services/discovery/` | Empty directory with only `__pycache__`, delete it |
| `models/brief.py` | No briefs model |
| `models/forecast.py` | No forecast model |
| `models/subscriber.py` | No subscribers model |
| `models/vrs.py` | No VRS model |
| `models/narrative.py` | Replaced by `claim.py` |
| `ingestion/` | Entire directory. No ingestion in simplified MVP. |
| `prompts/step1_technique.txt` | Old 3-step brief prompts |
| `prompts/step2_context.txt` | Old 3-step brief prompts |
| `prompts/step3_action.txt` | Old 3-step brief prompts |
| `prompts/validation.txt` | Old brief validation prompt |
| `prompts/inoculation_v1.py` | Old inoculation prompt |
| `prompts/__init__.py` | No prompts needed for MVP |
| `scripts/generate_demo_data.py` | Old demo data generator |
| `scripts/generate_more_demo_data.py` | Old demo data generator |
| `scripts/run_pipeline.py` | Old ingestion pipeline runner |
| `scripts/seed_user.py` | No user accounts |
| `scripts/send_weekly_digest.py` | No digests |
| `scripts/test_llm.py` | Old test |
| `scripts/test_matcher.py` | Old test |
| `scripts/test_validation.py` | Old test |
| `scripts/seed_taxonomy.py` | Replaced by `seed_claims.py` |
| `test_api.py` | Old test file in api root |
| `test_forecast.py` | Old test file in api root |

### 3.2 Files to KEEP and MODIFY

#### `config.py`
Remove unused config keys. New version:
```python
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="../../.env", env_file_encoding="utf-8", extra="ignore")

    supabase_url: str
    supabase_service_role_key: str
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"
    cors_origins: str = "http://localhost:3000"

settings = Settings()
```

#### `db.py`
Keep as-is. No changes needed.

#### `main.py`
Simplified to only include the routers we keep:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routers import claims, extension

app = FastAPI(title="Prebunk API", docs_url="/docs", redoc_url="/redoc")

origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"chrome-extension://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(claims.router)
app.include_router(extension.router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}
```

#### Create NEW `routers/claims.py`
```python
from fastapi import APIRouter, HTTPException
from db import supabase

router = APIRouter(prefix="/claims", tags=["claims"])

@router.get("/")
def list_claims(featured_only: bool = False):
    query = supabase.table("claims").select(
        "id, title, claim_text, description, category, virality_score, is_featured, "
        "talking_points, personal_script, refutations, semantic_anchors"
    )
    if featured_only:
        query = query.eq("is_featured", True)
    query = query.order("virality_score", desc=True)
    res = query.execute()
    return res.data

@router.get("/{claim_id}")
def get_claim(claim_id: str):
    res = supabase.table("claims").select("*").eq("id", claim_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Claim not found")
    return res.data[0]
```

#### `routers/extension.py` — Rewrite
Modify to query `claims` table instead of `narratives` + `briefs`:
```python
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from db import supabase
from services.matcher import match_text

router = APIRouter(prefix="/extension", tags=["extension"])

class AnalyzeRequest(BaseModel):
    text: str
    threshold: float = 0.40

class ClaimMatch(BaseModel):
    id: str
    title: str
    description: str
    similarity_score: float

class PrebunkResult(BaseModel):
    personal_script: Optional[str] = None
    talking_points: List[str]
    refutations: List[dict]

class AnalyzeResponse(BaseModel):
    matched: bool
    claim: Optional[ClaimMatch] = None
    prebunk: Optional[PrebunkResult] = None

@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_text(req: AnalyzeRequest):
    if not req.text.strip():
        return AnalyzeResponse(matched=False)

    text_to_analyze = req.text[:10000]
    matches = match_text(text_to_analyze, req.threshold)

    if not matches:
        return AnalyzeResponse(matched=False)

    top_match = sorted(matches, key=lambda x: x.similarity_score, reverse=True)[0]

    res = supabase.table("claims").select("*").eq("id", top_match.narrative_id).execute()
    if not res.data:
        return AnalyzeResponse(matched=False)

    claim_data = res.data[0]

    return AnalyzeResponse(
        matched=True,
        claim=ClaimMatch(
            id=claim_data["id"],
            title=claim_data["title"],
            description=claim_data["description"],
            similarity_score=top_match.similarity_score
        ),
        prebunk=PrebunkResult(
            personal_script=claim_data.get("personal_script"),
            talking_points=claim_data.get("talking_points", []),
            refutations=claim_data.get("refutations", [])
        )
    )
```

#### `services/matcher.py` — Modify
Change the DB query from `"narratives"` to `"claims"`, and `"name"` to `"title"`. The `NarrativeMatch` class and its field names (`narrative_id`, `narrative_name`) can stay as-is internally to minimize changes — just update the database query:

In `get_narratives_cache()`:
- Change: `supabase.table("narratives").select("id, name, embedding")` → `supabase.table("claims").select("id, title, embedding")`
- Change: `narrative_names = [n["name"] for n in cache]` → `narrative_names = [n["title"] for n in cache]`

#### `services/embeddings.py`
Keep as-is. No changes needed.

#### `services/llm.py`
Keep as-is. May be used later for AI-generated refutations.

#### Create NEW `models/claim.py`
```python
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
```

#### `models/__init__.py`
Update imports to reference the new model file. Remove old imports.

#### Create NEW `scripts/seed_claims.py`
```python
import json
import sys
from pathlib import Path

api_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(api_dir))

from db import supabase

def seed_claims():
    data_path = api_dir.parent.parent / "data" / "claims.json"
    with open(data_path) as f:
        claims = json.load(f)

    print(f"Seeding {len(claims)} claims...")
    supabase.table("claims").upsert(claims).execute()
    print("Claims seeded successfully.")

if __name__ == "__main__":
    seed_claims()
```

#### `scripts/compute_embeddings.py` — Rewrite
```python
import sys
from pathlib import Path
api_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(api_dir))

from db import supabase
from services.embeddings import embed_text

def compute():
    res = supabase.table("claims").select("id, title, claim_text, semantic_anchors").execute()
    for claim in res.data:
        text = f"{claim['title']}. {claim['claim_text']}. {' '.join(claim.get('semantic_anchors', []))}"
        embedding = embed_text(text)
        if embedding:
            supabase.table("claims").update({"embedding": embedding}).eq("id", claim["id"]).execute()
            print(f"Embedded: {claim['title']}")
        else:
            print(f"FAILED: {claim['title']}")

if __name__ == "__main__":
    compute()
```

---

## PHASE 4: Frontend Overhaul (`apps/web/`)

### 4.1 New Page Structure

The app has 3 pages total (down from ~5):

| Route | Purpose |
|---|---|
| `/` | Landing page + Featured Threats ("Prepare Yourself" hero) |
| `/claims` | Full list of all tracked claims (replaces `/taxonomy`) |
| `/claims/[id]` | Claim detail page with refutations, sources, talking points (replaces `/taxonomy/[id]`) |

### 4.2 Pages/Components to DELETE

| File | Reason |
|---|---|
| `app/taxonomy/` (entire directory) | Replaced by `/claims` |
| `app/briefs/` (entire directory) | Briefs concept removed |
| `components/briefs/` (entire directory) | Briefs concept removed |
| `components/brief/` (entire directory) | Briefs concept removed |
| `components/charts/` (entire directory) | No VRS charts |
| `components/taxonomy/` (entire directory) | Replaced by claims components |
| `components/home/live-tracker.tsx` | No VRS tracker |
| `components/home/latest-briefs.tsx` | No briefs |
| `components/home/newsletter-form.tsx` | No newsletter |
| `components/ui/vrs-badge.tsx` | No VRS |

### 4.3 Update `types/index.ts`

Replace ALL existing types with:
```typescript
export interface Refutation {
  claim: string;
  refutation: string;
  source_name: string;
  source_url: string;
  source_type: "wikipedia" | "quran" | "hadith" | "academic" | "islamqa" | "factcheck" | "news";
}

export interface Claim {
  id: string;
  title: string;
  claim_text: string;
  description: string;
  category: string;
  virality_score: number;
  is_featured: boolean;
  refutations: Refutation[];
  talking_points: string[];
  personal_script?: string;
  semantic_anchors: string[];
  created_at: string;
}
```

### 4.4 New Homepage (`app/page.tsx`)

The homepage structure becomes:

```
SiteHeader (updated nav links)
Hero Section:
  - Big bold text: "Know what's coming before it hits."
  - Subtitle: "We track anti-Muslim claims before they go viral, so you're prepared."
FeaturedThreats Section:
  - Heading: "Trending This Week"
  - 1-2 large cards for claims where is_featured=true
  - Each card shows: title, claim_text (truncated), virality_score as colored bar, category badge
  - Big CTA button: "Prepare Yourself →" linking to /claims/[id]
AllClaims Section:
  - Heading: "All Tracked Claims"
  - Grid of smaller cards for all claims, sorted by virality_score desc
  - Each card: title, category badge, virality bar, "Learn More →" link
ExtensionPromo (keep existing component, minor text tweaks)
SiteFooter (updated links)
```

Data fetching: The page fetches from `GET /claims/` and splits the response into `featured` (where `is_featured === true`) and the rest.

### 4.5 New Components to CREATE

#### `components/claims/featured-threat-card.tsx`
A large, prominent card for featured claims. Should include:
- A warning/alert icon (use Lucide `AlertTriangle`)
- The claim `title` in large text
- The `claim_text` displayed in a distinct "quote" style (italic, indented, different background)
- A colored `virality_score` bar/indicator (red when > 70, orange when 40-70, green when < 40)
- The `category` as a badge
- A large "Prepare Yourself →" button (Next.js `Link` to `/claims/[id]`)

#### `components/claims/claim-card.tsx`
A smaller card for the "All Claims" grid. Shows:
- `title` as heading
- `category` as a badge
- `virality_score` as a small colored indicator/bar
- First 100 chars of `description` as preview text
- "Learn More →" link to `/claims/[id]`

#### `components/claims/refutation-card.tsx`
Used on the claim detail page. For each refutation, shows:
- The sub-claim being refuted (in bold or different color)
- The refutation text
- A source badge with an icon based on `source_type`:
  - 📖 for `"quran"`
  - 📜 for `"hadith"`
  - 🌐 for `"wikipedia"`
  - 🎓 for `"academic"`
  - 🕌 for `"islamqa"`
  - ✅ for `"factcheck"`
  - 📰 for `"news"`
- The `source_name` as clickable link to `source_url` (opens in new tab)

### 4.6 New Claims List Page (`app/claims/page.tsx`)

Simple page that:
1. Fetches all claims from `GET /claims/`
2. Shows a heading: "All Tracked Claims"
3. Optionally has a simple category filter (buttons for each category, or a dropdown)
4. Renders a grid of `claim-card` components

### 4.7 New Claim Detail Page (`app/claims/[id]/page.tsx`)

This is the "Prepare Yourself" page. Structure:

```
SiteHeader
Back link: "← Back to all claims"

Hero area:
  - Category badge + virality score indicator
  - Title (large, bold)
  - The hateful claim in a styled "quote" blockquote (so users know WHAT the claim says)
  - Description (2-3 paragraphs explaining why it's harmful)

Section: "How to Respond"
  - Display the personal_script in a visually distinct card
  - "Copy Response" button that copies to clipboard

Section: "Factual Refutations"
  - List/Grid of refutation-card components (each with source icon + link)

Section: "Quick Talking Points"
  - Numbered or bulleted list of talking_points in a clean card

SiteFooter
```

### 4.8 Update `components/home/site-header.tsx`

Change nav links:
- Remove "Briefs" link
- Remove "Taxonomy" link
- Add "Claims" link → `/claims`
- Keep "Get the Extension" button

### 4.9 Update `components/home/site-footer.tsx`

Change footer links to match new navigation:
- Remove "Briefs" and "Taxonomy" references
- Add "Claims" link

### 4.10 Update `components/landing/hero.tsx`

Change the hero text:
- Main heading: "Know what's coming before it hits." (or similar)
- Subtitle: "We track anti-Muslim claims before they go viral, so you're always prepared."
- CTA button: "See Current Threats ↓" (scrolls to featured threats section)

### 4.11 Update `components/landing/how-it-works.tsx`

Simplify the steps to match the new flow:
1. "We Monitor" — We track social media and forums for emerging anti-Muslim claims.
2. "We Analyze" — AI identifies the claim pattern and finds the facts.
3. "You're Prepared" — Get refutations backed by Quran, Hadith, and academic sources.

### 4.12 Update `components/home/extension-promo.tsx`

Minor text changes:
- Change "tracking taxonomy" → "claim database"
- Ensure links and descriptions match the new language

---

## PHASE 5: Chrome Extension Updates (`apps/extension/`)

### 5.1 Minor Changes Only

The extension mostly works as-is. Changes needed:

#### `popup.html`
- Change "Known Trope Detected" → "Harmful Claim Detected"
- Add a "Sources" section below the talking points that shows 1-2 refutation source links from the API response
- Change "Learn more about this narrative →" link text to "See full refutation →"

#### `popup.js`
- Update to read `claim` instead of `narrative` from the API response (the field name changed)
- Update to read `prebunk.refutations` and render the top 2 refutation source links with their `source_name`
- Update the "Learn more" link to point to `/claims/[id]` instead of `/taxonomy/[id]`
- Specifically:
  - `result.narrative.name` → `result.claim.title`
  - `result.narrative.similarity_score` → `result.claim.similarity_score`
  - `result.narrative.id` → `result.claim.id`
  - Add new section to render `result.prebunk.refutations[0..1]` as source links

#### `background.js`
- No changes needed. The API endpoint `/extension/analyze` stays the same.

#### `manifest.json`
- No changes needed.

---

## PHASE 6: Cleanup Root Directory

### Files to DELETE from project root

| File | Reason |
|---|---|
| `PLAN2.md` | Old plan |
| `TASKS.md` | Old task tracking |
| `workshop.md` | Old workshop notes |
| `report.md` | Old report |
| `STACK.md` | Old stack description |
| `framework.webp` | Old framework diagram |
| `data/taxonomy/` | Entire directory (replaced by `data/claims.json`) |

### Files to KEEP

| File | Notes |
|---|---|
| `.env` | Keep, but update `.env.example` |
| `.env.example` | Simplify (see below) |
| `.gitignore` | Keep |
| `PLAN.md` | This file |

### Simplified `.env.example`

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
CORS_ORIGINS=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## PHASE 7: Seed, Embed, & Test

### 7.1 Run the migration
```bash
# Apply the new migration via Supabase dashboard SQL editor
# Copy the SQL from supabase/migrations/20001_create_claims.sql and run it
# This drops old tables and creates the new `claims` table
```

### 7.2 Seed the claims
```bash
cd apps/api
source .venv/bin/activate
PYTHONPATH=. python scripts/seed_claims.py
```

### 7.3 Compute embeddings
```bash
cd apps/api
source .venv/bin/activate
PYTHONPATH=. python scripts/compute_embeddings.py
```

### 7.4 Start the API and verify
```bash
cd apps/api
source .venv/bin/activate
uvicorn main:app --reload
# Visit http://localhost:8000/docs
# Test: GET /claims/ — should return all claims
# Test: GET /claims/?featured_only=true — should return only featured claims
# Test: GET /claims/CLM-001 — should return one claim with refutations
# Test: POST /extension/analyze with {"text": "Muslims are replacing us"} — should match a claim
```

### 7.5 Start the frontend and verify
```bash
cd apps/web
npm run dev
# Visit http://localhost:3000
# Should see the new "Prepare Yourself" homepage with featured threats
# Click a featured threat → should see the detail page with refutations and sources
# Navigate to /claims → should see grid of all claims
# Click any claim → should see full detail page
```

### 7.6 Test the extension
```bash
# Load the extension in Chrome (chrome://extensions → Developer mode → Load unpacked → select apps/extension/)
# Navigate to any webpage with anti-Muslim content
# Select text → Right click → "Prebunk this text"
# The popup should show "Harmful Claim Detected" with talking points and source links
```

---

## Execution Order Summary

| Phase | What | Estimated Effort |
|---|---|---|
| **Phase 1** | Database migration (drop old tables, create `claims`) | Small |
| **Phase 2** | Write `data/claims.json` with 15-20 real claims + real sources | Medium (research-heavy) |
| **Phase 3** | Backend overhaul (delete 30+ files, create new routers/models) | Medium |
| **Phase 4** | Frontend overhaul (delete old pages/components, build new ones) | Large |
| **Phase 5** | Extension tweaks (text changes, read new API response shape) | Small |
| **Phase 6** | Root cleanup (delete old docs/plans) | Tiny |
| **Phase 7** | Seed, embed, test everything end-to-end | Small |

**CAUTION:** Phase 1 (database migration) drops ALL existing data permanently. The new `claims` table + `data/claims.json` seed will be the only data source going forward.

**Recommended implementation order:** Phase 6 → Phase 1 → Phase 2 → Phase 3 → Phase 7 (seed + test API) → Phase 4 → Phase 5 → Phase 7 (full test). Clean the root first, then build bottom-up from database → backend → frontend → extension.
