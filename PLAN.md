# Prebunk — Build Plan

> This plan is written for execution by an AI agent. Every phase lists exact file
> paths, exact commands, and a concrete verification step. No implicit knowledge
> is assumed. Execute phases in order — each phase depends on the previous one.

---

## Pre-Build: API Keys & Accounts

Before Phase 0, the human operator must set up these accounts and provide the
credentials. The agent cannot do this.

### 1. Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project" → choose a name (e.g., `prebunk`) and a database password
3. Once created, go to **Settings → API**
4. Copy: `Project URL` → this is `SUPABASE_URL`
5. Copy: `anon public` key → this is `SUPABASE_ANON_KEY`
6. Copy: `service_role` key → this is `SUPABASE_SERVICE_ROLE_KEY`
7. Go to **Database → Extensions** → search for `vector` → enable `pgvector`

### 2. Google Gemini API

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with a Google account
3. Click "Get API Key" → "Create API key"
4. Copy the key → this is `GEMINI_API_KEY`
5. No billing setup needed — the free tier is sufficient

### 3. Reddit API

1. Go to [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps)
2. Log in (create a Reddit account if needed)
3. Scroll to bottom → click "create another app..."
4. Fill in:
   - Name: `prebunk`
   - Type: select **script**
   - Description: `Narrative monitoring for anti-Islamophobia research`
   - Redirect URI: `http://localhost:8000`
5. Click "create app"
6. Copy the ID under the app name → this is `REDDIT_CLIENT_ID`
7. Copy the secret → this is `REDDIT_CLIENT_SECRET`
8. Set `REDDIT_USER_AGENT` to: `prebunk:v0.1 (by /u/YOUR_REDDIT_USERNAME)`

### 4. Resend

1. Go to [resend.com](https://resend.com) and create a free account
2. Go to **API Keys** → create a new key
3. Copy the key → this is `RESEND_API_KEY`
4. For hackathon, use the default `onboarding@resend.dev` sender (no domain needed)
5. Set `RESEND_FROM_EMAIL=onboarding@resend.dev`

### 5. Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. No API key needed — deployment is done via `vercel` CLI or GitHub integration
3. Install CLI later: `npm i -g vercel`

### 6. Railway

1. Go to [railway.app](https://railway.app) and sign up with GitHub
2. No API key needed for CLI-based deployment
3. Install CLI later: `npm i -g @railway/cli`

---

## Phase 0: Project Scaffolding

**Goal:** Create the monorepo directory structure, initialize both apps, and
configure environment variables. After this phase, both dev servers start
without errors (serving empty pages / empty API).

### Files to Create

```
prebunk/
├── .env.example
├── .gitignore
├── apps/
│   ├── web/                          # Created by create-next-app
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── layout.tsx        # Root layout (modify after scaffold)
│   │   │   │   └── page.tsx          # Landing page placeholder
│   │   │   ├── lib/
│   │   │   │   └── supabase/
│   │   │   │       ├── client.ts     # Browser Supabase client
│   │   │   │       └── server.ts     # Server Supabase client
│   │   │   └── types/
│   │   │       └── index.ts          # Shared TypeScript types
│   │   ├── .env.local.example
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts        # Custom design tokens
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── api/
│       ├── main.py                   # FastAPI app entry point
│       ├── config.py                 # Pydantic Settings from env
│       ├── db.py                     # Supabase client init
│       ├── requirements.txt
│       ├── .env.example
│       ├── routers/
│       │   └── __init__.py
│       ├── services/
│       │   └── __init__.py
│       ├── ingestion/
│       │   └── __init__.py
│       ├── models/
│       │   └── __init__.py
│       ├── prompts/
│       │   └── (empty dir)
│       ├── scripts/
│       │   └── __init__.py
│       └── tests/
│           └── __init__.py
│
├── data/
│   └── taxonomy/
│       └── (empty dir, populated in Phase 1)
│
└── supabase/
    └── (created by supabase init)
```

### Commands

```bash
# All commands run from the repo root: /home/muaviz/dev/based/inprogress/prebunk

# 1. Create directory structure
mkdir -p apps/api/{routers,services,ingestion,models,prompts,scripts,tests}
mkdir -p data/taxonomy

# 2. Create Python __init__.py files
touch apps/api/routers/__init__.py
touch apps/api/services/__init__.py
touch apps/api/ingestion/__init__.py
touch apps/api/models/__init__.py
touch apps/api/scripts/__init__.py
touch apps/api/tests/__init__.py

# 3. Scaffold Next.js app inside apps/web
cd apps && npx create-next-app@latest web --typescript --tailwind --eslint \
  --app --src-dir --import-alias "@/*" --use-pnpm --yes
cd ..

# 4. Install additional frontend dependencies
cd apps/web && pnpm add @supabase/supabase-js @supabase/ssr recharts
cd ../..

# 5. Initialize shadcn/ui (select "New York" style, slate color, CSS variables yes)
cd apps/web && pnpm dlx shadcn@latest init
cd ../..

# 6. Add common shadcn components
cd apps/web && pnpm dlx shadcn@latest add button card input badge \
  select dialog tabs separator skeleton
cd ../..

# 7. Set up Python virtual environment and install dependencies
cd apps/api
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn[standard] supabase pydantic pydantic-settings \
  python-dotenv httpx
pip freeze > requirements.txt
deactivate
cd ../..

# 8. Initialize Supabase
npx supabase init
```

### Files to Write Manually (Agent Creates These)

**`.env.example`** (repo root):
Contains all environment variable names with placeholder values (see STACK.md §11).

**`.gitignore`**:
Must include: `node_modules/`, `.env`, `.env.local`, `.venv/`, `__pycache__/`,
`.next/`, `.vercel/`, `*.pyc`, `supabase/.temp/`.

**`apps/api/main.py`**:
Minimal FastAPI app with a single health check endpoint (`GET /health`),
CORS middleware configured from `CORS_ORIGINS` env var.

**`apps/api/config.py`**:
Pydantic `Settings` class that reads all env vars from `.env` using
`pydantic-settings`. Fields: `supabase_url`, `supabase_service_role_key`,
`gemini_api_key`, `gemini_model` (default `gemini-2.5-flash`),
`reddit_client_id`, `reddit_client_secret`, `reddit_user_agent`,
`resend_api_key`, `resend_from_email`, `cors_origins`.

**`apps/api/db.py`**:
Initializes the Supabase client using `supabase.create_client()` with
the URL and service role key from config.

**`apps/web/tailwind.config.ts`**:
Extends the default config with the custom color tokens from STACK.md §9
(slate-950 background, VRS colors, sky-400 accent). Sets Inter as the
default font family.

**`apps/web/src/app/layout.tsx`**:
Root layout with Inter font, dark background (`bg-slate-950 text-slate-50`),
metadata title "Prebunk — Narrative Intelligence."

**`apps/web/src/lib/supabase/client.ts`**:
Browser-side Supabase client using `createBrowserClient` from `@supabase/ssr`.

**`apps/web/src/lib/supabase/server.ts`**:
Server-side Supabase client using `createServerClient` from `@supabase/ssr`
with cookie handling.

**`apps/web/.env.local.example`**:
Contains `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`NEXT_PUBLIC_API_URL`.

### Verification

1. Run `cd apps/api && source .venv/bin/activate && uvicorn main:app --reload`
   → Server starts on port 8000
2. Open `http://localhost:8000/health` → returns `{"status": "ok"}`
3. Open `http://localhost:8000/docs` → shows FastAPI Swagger UI
4. Run `cd apps/web && pnpm dev` → Server starts on port 3000
5. Open `http://localhost:3000` → shows a dark page with "Prebunk" text (placeholder)

### Decisions Made

- **pnpm** chosen over npm/yarn for the frontend (faster, stricter dependency resolution)
- **pydantic-settings** used for config management (typed env vars with defaults)
- **shadcn "New York" style** selected (denser than "Default," fits intelligence tool aesthetic)
- **Slate color palette** selected for shadcn base (overridden by our custom dark theme)

---

## Phase 1: Database Schema & Taxonomy Seed Data

**Goal:** Create all database tables in Supabase via migrations. Generate the
initial taxonomy data (7 clusters, 8 techniques, ~20 narrative entries) as JSON
files and seed them into the database. After this phase, the taxonomy data is
queryable in Supabase.

**Prerequisites:** Phase 0 complete. Supabase project created with pgvector enabled.

### Files to Create

```
supabase/
├── migrations/
│   ├── 00001_enable_extensions.sql
│   ├── 00002_create_clusters.sql
│   ├── 00003_create_techniques.sql
│   ├── 00004_create_narratives.sql
│   ├── 00005_create_narrative_events.sql
│   ├── 00006_create_vrs_scores.sql
│   ├── 00007_create_briefs.sql
│   ├── 00008_create_subscribers.sql
│   ├── 00009_create_community_tips.sql
│   ├── 00010_create_alerts.sql
│   └── 00011_create_rls_policies.sql
│
data/
├── taxonomy/
│   ├── clusters.json
│   ├── techniques.json
│   └── narratives.json
│
apps/api/
├── scripts/
│   └── seed_taxonomy.py
```

### Migration SQL Details

**`00001_enable_extensions.sql`:**
```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

**`00002_create_clusters.sql`:**
```sql
CREATE TABLE clusters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**`00003_create_techniques.sql`:**
```sql
CREATE TABLE techniques (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**`00004_create_narratives.sql`:**
```sql
CREATE TABLE narratives (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  cluster_id TEXT NOT NULL REFERENCES clusters(id),
  technique_id TEXT NOT NULL REFERENCES techniques(id),
  description TEXT NOT NULL,
  variants TEXT[] DEFAULT '{}',
  historical_origin TEXT,
  propagation_path TEXT,
  factual_refutations JSONB DEFAULT '[]',
  inoculation_hook TEXT,
  talking_points TEXT[] DEFAULT '{}',
  related_narrative_ids TEXT[] DEFAULT '{}',
  semantic_anchors TEXT[] DEFAULT '{}',
  embedding VECTOR(768),
  last_reviewed TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**`00005_create_narrative_events.sql`:**
```sql
CREATE TABLE narrative_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  narrative_id TEXT NOT NULL REFERENCES narratives(id),
  platform TEXT NOT NULL,
  similarity_score FLOAT NOT NULL,
  country TEXT,
  recorded_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_narrative_events_narrative_id ON narrative_events(narrative_id);
CREATE INDEX idx_narrative_events_recorded_at ON narrative_events(recorded_at);
```

**`00006_create_vrs_scores.sql`:**
```sql
CREATE TABLE vrs_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  narrative_id TEXT NOT NULL REFERENCES narratives(id),
  score FLOAT NOT NULL CHECK (score >= 0 AND score <= 100),
  raw_volume INT DEFAULT 0,
  acceleration FLOAT DEFAULT 0,
  cross_platform_count INT DEFAULT 0,
  computed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_vrs_scores_narrative_id ON vrs_scores(narrative_id);
CREATE INDEX idx_vrs_scores_computed_at ON vrs_scores(computed_at);
```

**`00007_create_briefs.sql`:**
```sql
CREATE TABLE briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  narrative_id TEXT NOT NULL REFERENCES narratives(id),
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('scheduled', 'alert', 'on_demand')),
  vrs_at_generation FLOAT,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  language TEXT DEFAULT 'en',
  validation_outcome TEXT DEFAULT 'pending',
  version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_briefs_narrative_id ON briefs(narrative_id);
```

**`00008_create_subscribers.sql`:**
```sql
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  org_name TEXT NOT NULL,
  org_type TEXT NOT NULL,
  country TEXT,
  language_preference TEXT DEFAULT 'en',
  tier TEXT DEFAULT 'individual' CHECK (tier IN ('individual', 'organization', 'research')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  focus_clusters TEXT[] DEFAULT '{}',
  delivery_frequency TEXT DEFAULT 'weekly' CHECK (delivery_frequency IN ('weekly', 'realtime')),
  contact_email TEXT NOT NULL,
  team_size INT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_subscribers_user_id ON subscribers(user_id);
```

**`00009_create_community_tips.sql`:**
```sql
CREATE TABLE community_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID REFERENCES subscribers(id),
  description TEXT NOT NULL,
  matched_narrative_id TEXT REFERENCES narratives(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'confirmed', 'rejected')),
  reviewer_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**`00010_create_alerts.sql`:**
```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  narrative_id TEXT NOT NULL REFERENCES narratives(id),
  alert_level TEXT NOT NULL CHECK (alert_level IN ('orange', 'red')),
  vrs_score FLOAT NOT NULL,
  brief_id UUID REFERENCES briefs(id),
  subscribers_notified INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**`00011_create_rls_policies.sql`:**
```sql
-- Enable RLS on all tables
ALTER TABLE clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE techniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE narratives ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE vrs_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE narrative_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Public read access for taxonomy (clusters, techniques, narratives)
CREATE POLICY "Public read clusters" ON clusters FOR SELECT USING (true);
CREATE POLICY "Public read techniques" ON techniques FOR SELECT USING (true);
CREATE POLICY "Public read narratives" ON narratives FOR SELECT USING (true);

-- Briefs readable by authenticated users
CREATE POLICY "Auth read briefs" ON briefs FOR SELECT
  USING (auth.role() = 'authenticated');

-- VRS scores readable by authenticated users
CREATE POLICY "Auth read vrs" ON vrs_scores FOR SELECT
  USING (auth.role() = 'authenticated');

-- Subscribers can read their own record
CREATE POLICY "Own subscriber read" ON subscribers FOR SELECT
  USING (auth.uid() = user_id);

-- Community tips: submitter can read their own
CREATE POLICY "Own tips read" ON community_tips FOR SELECT
  USING (subscriber_id IN (SELECT id FROM subscribers WHERE user_id = auth.uid()));

-- Alerts readable by authenticated users
CREATE POLICY "Auth read alerts" ON alerts FOR SELECT
  USING (auth.role() = 'authenticated');

-- Service role (backend) can do everything (implicit — service role bypasses RLS)
```

### Taxonomy JSON Files

**`data/taxonomy/clusters.json`:**
The agent generates this file containing 7 cluster objects, each with fields:
`id` (CLU-01 through CLU-07), `name`, `description`.
Content is drawn directly from report.md §9.2 (Demographic Threat, Legal System
Threat, Violent Extremism Attribution, Loyalty and Allegiance, Cultural
Incompatibility, Manufactured Statistics, Victimhood Inversion).

**`data/taxonomy/techniques.json`:**
The agent generates this file containing 8 technique objects, each with fields:
`id` (TEC-01 through TEC-08), `name`, `description`.
Content is drawn from report.md §9.3 (collective attribution, false equivalence,
manufactured consensus, essentialization, conspiratorial intent, statistical
manipulation, motive inversion, slippery slope).

**`data/taxonomy/narratives.json`:**
The agent generates ~20 narrative entries, distributing them across the 7 clusters
(at least 2 per cluster, more for the larger clusters). Each entry follows the
schema from report.md §9.1:
```json
{
  "id": "NAR-001",
  "name": "Great Replacement Theory",
  "cluster_id": "CLU-01",
  "technique_id": "TEC-06",
  "description": "...",
  "variants": ["Eurabia", "demographic jihad", "Islamization of Europe"],
  "historical_origin": "...",
  "propagation_path": "...",
  "factual_refutations": [
    {"claim": "...", "refutation": "...", "source": "..."}
  ],
  "inoculation_hook": "...",
  "talking_points": ["...", "...", "..."],
  "related_narrative_ids": ["NAR-002"],
  "semantic_anchors": ["replacement", "birth rates", "demographic change", "outbreeding"]
}
```

The narrative content is based on the descriptions in report.md §9.2 and general
knowledge of documented Islamophobic narratives. These are curated educational
descriptions, not raw hate content.

**`apps/api/scripts/seed_taxonomy.py`:**
Python script that:
1. Reads the three JSON files from `data/taxonomy/`
2. Inserts clusters, then techniques, then narratives into Supabase
3. Uses the service role key (bypasses RLS)
4. Handles upserts (can be re-run safely)

### Commands

```bash
# Apply migrations via Supabase MCP or CLI
# Option A: Using Supabase MCP (preferred — agent runs these directly)
# Option B: Using Supabase CLI
cd /home/muaviz/dev/based/inprogress/prebunk
npx supabase db push

# Seed taxonomy data
cd apps/api
source .venv/bin/activate
python scripts/seed_taxonomy.py
deactivate
```

### Verification

1. Open the Supabase dashboard → Table Editor
2. Verify all 10 tables exist: `clusters`, `techniques`, `narratives`,
   `narrative_events`, `vrs_scores`, `briefs`, `subscribers`, `community_tips`,
   `alerts`
3. Verify `clusters` table has 7 rows
4. Verify `techniques` table has 8 rows
5. Verify `narratives` table has ~20 rows
6. Run a test query: `SELECT n.name, c.name as cluster FROM narratives n JOIN clusters c ON n.cluster_id = c.id` → returns all narratives with their cluster names

### Decisions Made

- **Separate migration files per table** (not one big file) — easier to debug if one fails
- **TEXT primary keys** for clusters, techniques, narratives (CLU-01, TEC-01, NAR-001) instead of UUIDs — human-readable IDs that match the report's notation
- **UUID primary keys** for event data (narrative_events, vrs_scores, briefs, etc.) — high-volume tables where human-readable IDs aren't useful
- **JSONB for `factual_refutations`** — structured but variable-length data; array of objects with claim/refutation/source
- **JSONB for `briefs.content`** — the brief has multiple sections (technique explanation, narrative context, talking points, discussion questions) that vary by type
- **pgvector `embedding` column on `narratives`** — embeddings are computed in Phase 3 and stored here for fast similarity search

---

## Phase 2: Backend API Foundation

**Goal:** Build the FastAPI route structure with Pydantic models for all entities.
Create CRUD endpoints for narratives, VRS scores, and briefs. After this phase,
the API serves real data from Supabase.

**Prerequisites:** Phase 1 complete (tables exist and are seeded).

### Files to Create

```
apps/api/
├── models/
│   ├── narrative.py              # Pydantic models: Narrative, NarrativeCreate, etc.
│   ├── vrs.py                    # Pydantic models: VRSScore, VRSHistory
│   ├── brief.py                  # Pydantic models: Brief, BriefCreate, BriefContent
│   ├── subscriber.py             # Pydantic models: Subscriber, SubscriberCreate
│   └── tip.py                    # Pydantic models: CommunityTip, TipCreate
├── routers/
│   ├── narratives.py             # GET /narratives, GET /narratives/{id}
│   ├── vrs.py                    # GET /vrs, GET /vrs/{narrative_id}/history
│   ├── briefs.py                 # GET /briefs, GET /briefs/{id}, POST /briefs/generate
│   ├── subscribers.py            # POST /subscribers, GET /subscribers/me
│   └── tips.py                   # POST /tips, GET /tips
├── main.py                       # Updated: register all routers
```

### Implementation Details

**Pydantic Models (`models/narrative.py`):**
```python
class FactualRefutation(BaseModel):
    claim: str
    refutation: str
    source: str

class Narrative(BaseModel):
    id: str
    name: str
    cluster_id: str
    technique_id: str
    description: str
    variants: list[str]
    historical_origin: str | None
    propagation_path: str | None
    factual_refutations: list[FactualRefutation]
    inoculation_hook: str | None
    talking_points: list[str]
    related_narrative_ids: list[str]
    semantic_anchors: list[str]
    last_reviewed: datetime | None
    created_at: datetime
```

Similar Pydantic models for VRS, Brief, Subscriber, Tip — each with a base model
and a response model.

**Router Pattern (`routers/narratives.py`):**
Each router follows this pattern:
```python
router = APIRouter(prefix="/narratives", tags=["narratives"])

@router.get("/", response_model=list[NarrativeResponse])
async def list_narratives():
    # Query Supabase, return typed response
    ...

@router.get("/{narrative_id}", response_model=NarrativeResponse)
async def get_narrative(narrative_id: str):
    # Query Supabase by ID, 404 if not found
    ...
```

**`main.py` updates:**
Register all routers:
```python
app.include_router(narratives.router)
app.include_router(vrs.router)
app.include_router(briefs.router)
app.include_router(subscribers.router)
app.include_router(tips.router)
```

### Commands

```bash
# Install any new dependencies (if needed)
cd apps/api && source .venv/bin/activate
pip install httpx  # for any async HTTP needs
pip freeze > requirements.txt

# Run the API server
uvicorn main:app --reload --port 8000
```

### Verification

1. `GET http://localhost:8000/narratives` → returns JSON array of ~20 narratives
2. `GET http://localhost:8000/narratives/NAR-001` → returns single narrative object
3. `GET http://localhost:8000/vrs` → returns empty array (no scores computed yet)
4. `GET http://localhost:8000/docs` → Swagger UI shows all endpoints with typed schemas
5. All responses match Pydantic model shapes (verify via Swagger "Try it out")

### Decisions Made

- **All Supabase queries use the service role key** on the backend (bypasses RLS). RLS protects the frontend's direct Supabase access, not the backend API.
- **Response models are separate from database models** — the API never exposes raw database rows; it returns typed Pydantic models.
- **No authentication on API routes yet** — auth is added in Phase 7 when the frontend needs it. For now, all endpoints are open for development convenience.

---

## Phase 3: Analysis Layer — Pattern Matching

**Goal:** Set up the SBERT model, compute embeddings for all taxonomy entries,
store them in Supabase, and build the pattern matching function. After this phase,
you can pass any text to the matcher and get back matched narratives with
similarity scores.

**Prerequisites:** Phase 1 complete (narratives seeded). Phase 2 complete (API serves data).

### Files to Create

```
apps/api/
├── services/
│   ├── matcher.py                # SBERT embedding + cosine similarity matching
│   └── embeddings.py             # Embedding computation utilities
├── scripts/
│   └── compute_embeddings.py     # One-time script: compute + store taxonomy embeddings
├── requirements.txt              # Updated with ML dependencies
```

### Implementation Details

**`services/embeddings.py`:**
- Loads the `all-mpnet-base-v2` model via `SentenceTransformer`
- Provides `embed_text(text: str) -> list[float]` function
- Provides `embed_texts(texts: list[str]) -> list[list[float]]` for batch processing
- Model is loaded once at module level (singleton pattern)

**`services/matcher.py`:**
- `match_text(text: str, threshold: float = 0.45) -> list[NarrativeMatch]`
- Loads all narrative embeddings from Supabase (cached in memory, refreshed every hour)
- Embeds the input text using `embed_text()`
- Computes cosine similarity against all narrative centroids
- Returns all matches above the threshold, sorted by similarity score descending
- `NarrativeMatch` is a Pydantic model: `narrative_id`, `narrative_name`, `similarity_score`

**`scripts/compute_embeddings.py`:**
- Reads all narratives from Supabase
- For each narrative, combines its `semantic_anchors` into a single text block
- Computes the embedding of that combined text (this is the "centroid")
- Updates the `embedding` column in the `narratives` table via Supabase

**Cosine similarity threshold:**
Default 0.45 — this is a starting point. The threshold can be tuned later by
examining match quality. It is configurable via the `MATCH_THRESHOLD` env var.

### Commands

```bash
cd apps/api
source .venv/bin/activate

# Install ML dependencies (this takes a few minutes)
pip install sentence-transformers torch numpy scikit-learn
pip freeze > requirements.txt

# Compute and store embeddings for all taxonomy entries
python scripts/compute_embeddings.py

deactivate
```

### Verification

1. Run `compute_embeddings.py` → script prints "Computed embeddings for 20 narratives"
2. In Supabase Table Editor, check `narratives` table → `embedding` column is no longer null for any row
3. Test the matcher manually:
   ```bash
   cd apps/api && source .venv/bin/activate
   python -c "
   from services.matcher import match_text
   results = match_text('Muslims are replacing the white population through immigration')
   for r in results:
       print(f'{r.narrative_name}: {r.similarity_score:.3f}')
   "
   ```
   → Should return "Great Replacement Theory" (or similar) as the top match with score > 0.5
4. Test with unrelated text:
   ```bash
   python -c "
   from services.matcher import match_text
   results = match_text('The weather forecast for tomorrow is sunny')
   print(f'Matches: {len(results)}')
   "
   ```
   → Should return 0 matches (all below threshold)

### Decisions Made

- **Semantic anchors are concatenated for centroid computation** — each narrative's `semantic_anchors` array is joined into a paragraph, embedded once, and stored. This is simpler and faster than maintaining multiple embeddings per narrative.
- **Threshold 0.45** — conservative starting point. Lower catches more but risks false positives. This can be tuned after observing real ingestion data.
- **Model loaded at module import time** — first import is slow (~10s to load model). Subsequent calls are fast. In production (Railway), the model stays loaded because Uvicorn keeps the process alive.

---

## Phase 4: VRS Engine & Data Ingestion

**Goal:** Build the ingestion pipeline (Reddit + RSS), the VRS computation engine,
and wire them together: ingest → match → score → store. After this phase, the
system can collect real data, match it against the taxonomy, and compute VRS scores.

**Prerequisites:** Phase 3 complete (matcher works). Reddit API credentials obtained.

### Files to Create

```
apps/api/
├── ingestion/
│   ├── reddit.py                 # Reddit PRAW client
│   ├── rss.py                    # RSS feed parser
│   ├── mock.py                   # Mock data generators (Twitter/Telegram)
│   └── pipeline.py              # Orchestrator: ingest → match → store
├── services/
│   └── velocity.py              # VRS computation engine
├── routers/
│   ├── ingest.py                # POST /ingest/run — trigger pipeline manually
│   └── vrs.py                   # Updated: GET /vrs now returns real data
├── data/
│   └── rss_feeds.json           # Curated list of RSS feed URLs
├── scripts/
│   └── run_pipeline.py          # CLI script to run the full pipeline once
```

### Implementation Details

**`ingestion/reddit.py`:**
- Uses PRAW (Python Reddit API Wrapper) to monitor subreddits
- Target subreddits (hackathon scope, ~10):
  `worldnews`, `europe`, `news`, `ukpolitics`, `conservative`,
  `conspiracy`, `islam`, `exmuslim`, `geopolitics`, `immigration`
- For each subreddit, fetches the latest 50 posts (title + selftext)
- For each post: run through `matcher.match_text()`, discard the text,
  store only the match result (narrative_id, platform="reddit",
  similarity_score, recorded_at) in `narrative_events`
- Rate limit: 60 requests/minute (PRAW handles this automatically)
- **Critical: the post text is NEVER stored. Only the match result is stored.**

**`ingestion/rss.py`:**
- Uses `feedparser` to parse RSS feeds from `data/rss_feeds.json`
- Fetches latest entries from each feed
- For each entry: match title + summary against taxonomy, store match results
- `data/rss_feeds.json` contains ~20 news sources for hackathon scope:
  BBC, Al Jazeera, Guardian, Reuters, AP News, CNN, Fox News, Daily Mail,
  New York Times, The Intercept, Middle East Eye, plus a few known
  high-propagation sources

**`ingestion/mock.py`:**
- Generates realistic mock ingestion data for Twitter and Telegram
- Each mock entry has: a synthetic text (derived from taxonomy semantic anchors +
  random variation), platform, timestamp, and geographic region
- Used to populate the dashboard with multi-platform data for the demo
- Mock data is clearly labeled (platform="twitter_mock", "telegram_mock")

**`ingestion/pipeline.py`:**
- `run_pipeline(sources: list[str] = ["reddit", "rss", "mock"])`:
  1. Calls each ingestion source
  2. Collects all match results
  3. Calls `velocity.compute_vrs()` for all narratives
  4. Stores VRS scores in `vrs_scores` table
  5. Returns a summary: total items processed, matches found, VRS scores computed

**`services/velocity.py`:**
- `compute_vrs(narrative_id: str, window_hours: int = 24) -> VRSScore`:
  1. Query `narrative_events` for this narrative in the last `window_hours`
  2. Compute four dimensions:
     - **Raw volume:** count of events
     - **Acceleration:** compare last 12h vs. previous 12h (ratio)
     - **Cross-platform spread:** count distinct platforms
     - **Network concentration:** (deferred — set to 0 for hackathon)
  3. Weighted formula: `VRS = min(100, (volume_norm * 40) + (acceleration_norm * 30) + (cross_platform * 30))`
     - `volume_norm`: volume / max_expected_volume (configurable, default 100), capped at 1.0
     - `acceleration_norm`: acceleration ratio capped at 1.0 (>1 = accelerating)
     - `cross_platform`: (platform_count - 1) / 3, capped at 1.0 (1 platform = 0, 4+ platforms = 1.0)
  4. Store result in `vrs_scores` table

**`routers/ingest.py`:**
```python
@router.post("/ingest/run")
async def trigger_pipeline(sources: list[str] = ["reddit", "rss"]):
    result = await run_pipeline(sources)
    return result
```

### Commands

```bash
cd apps/api
source .venv/bin/activate

# Install ingestion dependencies
pip install praw feedparser
pip freeze > requirements.txt

# Test Reddit connection (requires API credentials in .env)
python -c "
import praw
from config import settings
reddit = praw.Reddit(
    client_id=settings.reddit_client_id,
    client_secret=settings.reddit_client_secret,
    user_agent=settings.reddit_user_agent
)
for post in reddit.subreddit('worldnews').hot(limit=3):
    print(post.title[:80])
"

# Run the full pipeline once
python scripts/run_pipeline.py

deactivate
```

### Verification

1. Run `python scripts/run_pipeline.py` → prints summary:
   "Processed X items, Y matches found, VRS scores computed for Z narratives"
2. `GET http://localhost:8000/vrs` → returns array of VRS score objects, each with
   `narrative_id`, `score`, `raw_volume`, `acceleration`, `cross_platform_count`, `computed_at`
3. `GET http://localhost:8000/vrs/NAR-001/history` → returns array of historical
   VRS scores for NAR-001 (may be just 1 entry at this point)
4. In Supabase Table Editor, `narrative_events` table has rows with platform="reddit"
   and/or platform="rss"
5. **Critical check:** `narrative_events` table contains NO raw text — only
   narrative_id, platform, similarity_score, country, recorded_at

### Decisions Made

- **10 subreddits** for hackathon scope (expandable post-hackathon)
- **20 RSS feeds** for hackathon scope (expandable to 120)
- **VRS formula weights** (volume 40%, acceleration 30%, cross-platform 30%) — these are initial weights based on the report's description. Can be tuned by observing real data.
- **Mock data for Twitter/Telegram** — avoids needing paid API keys during hackathon. Mock data uses platform names `twitter_mock` and `telegram_mock` so it's clearly distinguishable.
- **Pipeline is triggered manually or via cron** — not a persistent streaming connection. This is simpler and uses fewer API quota.
- **24-hour window** for VRS computation — sufficient granularity for the hackathon. Production would use rolling 6-hour windows.

---

## Phase 5: Content Generation — Brief Pipeline

**Goal:** Build the inoculation brief generation pipeline using the Gemini API.
Implement the 3-step prompt chain (technique explanation → narrative context →
talking points), the validation step, and brief storage. After this phase, you
can generate a complete, validated inoculation brief for any narrative.

**Prerequisites:** Phase 2 complete (briefs table exists, API serves data).
Gemini API key obtained.

### Files to Create

```
apps/api/
├── services/
│   ├── brief_generator.py        # Core brief generation logic
│   └── brief_validator.py        # Validation prompt + retry logic
├── prompts/
│   ├── step1_technique.txt       # Prompt template: technique explanation
│   ├── step2_context.txt         # Prompt template: narrative context
│   ├── step3_action.txt          # Prompt template: talking points + scripts
│   └── validation.txt            # Prompt template: quality validation
├── models/
│   └── brief.py                  # Updated: BriefContent schema
├── routers/
│   └── briefs.py                 # Updated: POST /briefs/generate works
```

### Implementation Details

**`services/brief_generator.py`:**
- `generate_brief(narrative_id: str, trigger_type: str, target_audience: str = "community_organization", language: str = "en") -> Brief`
- Steps:
  1. Load the narrative from Supabase (including cluster, technique, refutations)
  2. Build a `BriefSpecification` Pydantic model from taxonomy data ONLY
     (no raw content — this enforces the safety constraint architecturally)
  3. Call Gemini API with `step1_technique.txt` prompt → get technique explanation
  4. Call Gemini API with `step2_context.txt` prompt → get narrative context
  5. Call Gemini API with `step3_action.txt` prompt → get talking points + scripts
  6. Assemble all three into a `BriefContent` object
  7. Call `brief_validator.validate(brief_content)` → PASS or list of issues
  8. If validation fails: re-generate with issues appended (max 2 retries)
  9. Store the final brief in `briefs` table
  10. Return the Brief object

**`BriefContent` schema (in `models/brief.py`):**
```python
class BriefContent(BaseModel):
    technique_explanation: str      # Step 1 output
    narrative_context: str          # Step 2 output
    talking_points: list[str]       # Step 3: 3 short cards (max 30 words each)
    personal_script: str            # Step 3: "what to say" script
    discussion_questions: list[str] # Step 3: 2 discussion questions
    summary: str                    # One-sentence executive summary
```

**Prompt templates** — stored as `.txt` files with `{variable}` placeholders.
Content follows the exact prompt structure from report.md §10.3:

`step1_technique.txt`: System role + technique explanation request (2 paragraphs,
general examples first, then applied to the narrative's domain).

`step2_context.txt`: Injects taxonomy data (narrative name, description,
factual_refutations, historical_origin). Requests 3 paragraphs grounded strictly
in the provided source material.

`step3_action.txt`: Requests talking point cards (3, max 30 words each), a
personal script (4–6 sentences), and discussion questions (2).

`validation.txt`: The 5-criteria validation prompt from report.md §10.4
(accuracy, tone, actionability, accessibility, technique focus).

**Gemini API client setup:**
```python
from google import genai

client = genai.Client(api_key=settings.gemini_api_key)

def call_gemini(prompt: str, system_instruction: str = "") -> str:
    response = client.models.generate_content(
        model=settings.gemini_model,
        contents=prompt,
        config=genai.types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.7,
            max_output_tokens=2000,
        )
    )
    return response.text
```

### Commands

```bash
cd apps/api
source .venv/bin/activate

# Install Gemini SDK
pip install google-genai
pip freeze > requirements.txt

# Test Gemini API connection
python -c "
from google import genai
from config import settings
client = genai.Client(api_key=settings.gemini_api_key)
response = client.models.generate_content(
    model=settings.gemini_model,
    contents='Say hello in one sentence.'
)
print(response.text)
"

# Test brief generation for one narrative
python -c "
from services.brief_generator import generate_brief
brief = generate_brief('NAR-001', trigger_type='on_demand')
print(f'Title: {brief.title}')
print(f'Validation: {brief.validation_outcome}')
print(f'Talking points: {len(brief.content.talking_points)}')
"

deactivate
```

### Verification

1. Gemini API test returns a response (confirms API key works)
2. Brief generation for NAR-001 completes without errors
3. Generated brief has all 6 fields in `BriefContent` populated (non-empty)
4. Validation passes (or retries and then passes)
5. `GET http://localhost:8000/briefs` → returns the generated brief
6. `GET http://localhost:8000/briefs/{id}` → returns the brief with full content
7. **Safety check:** Inspect the actual Gemini API calls (via logging or debug print).
   Verify that NO raw social media text appears in any prompt — only taxonomy-derived
   content (narrative name, description, technique name, refutations).

### Decisions Made

- **Three separate Gemini API calls per brief** (not one monolithic prompt) — this follows the report's chain-of-thought design and produces better output. Each step's output feeds into the next.
- **Prompt templates as `.txt` files** — not hardcoded Python strings. Easier to iterate on prompts without touching code. Uses Python `str.format()` for variable interpolation.
- **Temperature 0.7** — balances creativity (talking points should be engaging) with consistency (factual content should be grounded). Can be tuned per step.
- **Max 2 validation retries** — if the brief fails validation twice, it's stored with `validation_outcome = "failed"` and flagged for human review. This prevents infinite retry loops.
- **`google-genai` SDK** — the unified Google AI Python SDK (not the older `google-generativeai` package). Correct import is `from google import genai`.

---

## Phase 6: Frontend Foundation

**Goal:** Build the Next.js app shell: dark theme, auth flow (login/register),
dashboard layout with sidebar navigation, and the Supabase middleware for session
management. After this phase, users can register, log in, and see an empty
dashboard skeleton.

**Prerequisites:** Phase 0 complete (Next.js scaffolded). Supabase Auth working.

### Files to Create

```
apps/web/src/
├── app/
│   ├── layout.tsx                    # Updated: Inter font, dark bg, metadata
│   ├── page.tsx                      # Landing page (minimal for now)
│   ├── login/
│   │   └── page.tsx                  # Login form
│   ├── register/
│   │   └── page.tsx                  # Registration form (org details)
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts             # Supabase auth callback handler
│   ├── dashboard/
│   │   ├── layout.tsx               # Dashboard layout: sidebar + main area
│   │   └── page.tsx                 # Default dashboard page (radar, placeholder)
│   └── globals.css                  # Updated: dark theme CSS variables
│
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx              # Dashboard sidebar navigation
│   │   ├── header.tsx               # Top bar: page title, user menu
│   │   └── nav-link.tsx             # Sidebar navigation link component
│   └── ui/
│       └── (shadcn components already added in Phase 0)
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Browser Supabase client
│   │   ├── server.ts                # Server Supabase client
│   │   └── middleware.ts            # Session refresh logic
│   ├── api.ts                       # FastAPI client (fetch wrapper with base URL)
│   └── utils.ts                     # Utility functions (cn, formatDate, etc.)
│
├── types/
│   └── index.ts                     # TypeScript types matching Pydantic models
│
└── middleware.ts                     # Next.js middleware: protect /dashboard routes
```

### Implementation Details

**Auth Flow:**
1. User visits `/register` → fills in email, password, org name, org type, country
2. On submit: `supabase.auth.signUp()` creates the user, then inserts a `subscribers`
   row with `status: 'pending'`
3. User is redirected to `/login` with a "check your email" message
4. After email confirmation, user logs in at `/login`
5. `middleware.ts` checks if user is authenticated for `/dashboard/*` routes.
   Unauthenticated users are redirected to `/login`.
6. For the hackathon, skip the email confirmation step — use Supabase dashboard to
   manually confirm users, or disable email confirmation in Supabase Auth settings.

**Dashboard Layout (`dashboard/layout.tsx`):**
- Left sidebar (240px wide, collapsible to 64px on mobile)
- Sidebar links: Radar, Trends, Briefs, Alerts, Tips, Generate, Settings
- Each link uses an icon (from Lucide React, included with shadcn) + label
- Main content area fills remaining width
- Top bar shows current page title + user avatar/logout

**Design Implementation:**
- `globals.css`: Override CSS variables for the dark theme
- Background: `bg-slate-950` on `<body>`
- Card surfaces: `bg-slate-900 border border-slate-800`
- No rounded-xl. Use `rounded-md` (border-radius: 6px)
- Sidebar: `bg-slate-900/50` with `border-r border-slate-800`
- Active nav link: `bg-sky-400/10 text-sky-400 border-l-2 border-sky-400`
- All text: `text-slate-50` (primary), `text-slate-400` (secondary)

**`lib/api.ts`:**
A typed fetch wrapper for the FastAPI backend:
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
```

**`types/index.ts`:**
TypeScript interfaces matching the Pydantic models from Phase 2:
```typescript
export interface Narrative {
  id: string;
  name: string;
  cluster_id: string;
  technique_id: string;
  description: string;
  variants: string[];
  // ... all fields
}

export interface VRSScore {
  id: string;
  narrative_id: string;
  score: number;
  raw_volume: number;
  acceleration: number;
  cross_platform_count: number;
  computed_at: string;
}

export interface Brief { ... }
export interface BriefContent { ... }
```

### Commands

```bash
cd apps/web

# Install additional dependencies
pnpm add lucide-react

# Start dev server
pnpm dev
```

### Verification

1. `http://localhost:3000` → shows a dark landing page with "Prebunk" title
2. `http://localhost:3000/login` → shows a login form (email + password inputs) on dark background
3. `http://localhost:3000/register` → shows a registration form with org details
4. Register a test user → user appears in Supabase Auth dashboard
5. Log in → redirected to `/dashboard`
6. `/dashboard` shows the sidebar layout with navigation links (content area shows placeholder)
7. Clicking sidebar links navigates between dashboard sub-pages (all show placeholders)
8. Visiting `/dashboard` while logged out → redirected to `/login`
9. Visual check: the page is dark (slate-950 background), text is light, no purple gradients,
   no rounded-xl cards, no default Tailwind template appearance

### Decisions Made

- **No email confirmation for hackathon** — disable in Supabase Auth settings to speed up testing. Re-enable post-hackathon.
- **Lucide React for icons** — already a dependency of shadcn/ui (no extra bundle). Clean, consistent icon set.
- **240px sidebar** — wide enough for labels, narrow enough to leave space for data-dense content.
- **No light mode** — dark only for the hackathon. Intelligence tools are traditionally dark-themed and it matches the design direction.
- **Server components by default** — only add `"use client"` when hooks or browser APIs are needed. This reduces client-side JS.

---

## Phase 7: Dashboard Views

**Goal:** Build the four main dashboard views: Radar (bubble chart), Trends
(time series), Brief Archive + Detail, and Alert Log. All views fetch real
data from the FastAPI backend. After this phase, the dashboard is functional
and shows real narrative intelligence.

**Prerequisites:** Phase 4 complete (VRS data exists). Phase 5 complete (briefs
exist). Phase 6 complete (dashboard layout works).

### Files to Create

```
apps/web/src/
├── app/dashboard/
│   ├── page.tsx                      # Radar view (default dashboard page)
│   ├── trends/
│   │   └── page.tsx                  # Trends view with time-series charts
│   ├── briefs/
│   │   ├── page.tsx                  # Brief archive (list view)
│   │   └── [id]/
│   │       └── page.tsx              # Brief detail view
│   └── alerts/
│       └── page.tsx                  # Alert log view
│
├── components/dashboard/
│   ├── radar-chart.tsx               # VRS bubble/scatter chart (Recharts)
│   ├── vrs-badge.tsx                 # Color-coded VRS score badge
│   ├── narrative-card.tsx            # Card showing narrative + VRS summary
│   ├── trend-chart.tsx               # Line chart for VRS history (Recharts)
│   ├── brief-card.tsx                # Brief summary card for archive list
│   ├── alert-card.tsx                # Alert summary card
│   └── stat-widget.tsx               # Key metric display (total narratives, active alerts, etc.)
```

### Implementation Details

**Radar View (`dashboard/page.tsx`):**
- Fetches current VRS scores for all narratives from `GET /vrs`
- Displays a Recharts ScatterChart (bubble chart):
  - X-axis: narrative cluster (categorical)
  - Y-axis: VRS score (0–100)
  - Bubble size: raw volume
  - Bubble color: VRS level (green/amber/orange/red based on score thresholds)
- Below the chart: a grid of `narrative-card` components showing the top narratives
  sorted by VRS score, with VRS badges
- Summary stats at the top: "X narratives monitored", "Y at watch level",
  "Z at alert level"

**VRS Badge (`vrs-badge.tsx`):**
```
Score 0–30:   bg-emerald-500/10 text-emerald-400 border-emerald-500/30  label: "Monitor"
Score 30–60:  bg-amber-500/10 text-amber-400 border-amber-500/30        label: "Watch"
Score 60–80:  bg-orange-500/10 text-orange-400 border-orange-500/30      label: "Alert"
Score 80–100: bg-red-500/10 text-red-400 border-red-500/30               label: "Critical"
```
Font: `font-mono text-xs`. Shows the numeric score next to the label.

**Trend View (`trends/page.tsx`):**
- Selector to choose up to 5 narratives from a dropdown
- Fetches VRS history for each selected narrative from `GET /vrs/{narrative_id}/history`
- Displays a Recharts LineChart:
  - X-axis: time (date/hour)
  - Y-axis: VRS score (0–100)
  - One line per selected narrative, color-coded
  - Horizontal threshold lines at 30, 60, 80 (dashed, labeled)
- Date range selector: 7d / 30d / All time

**Brief Archive (`briefs/page.tsx`):**
- Fetches all briefs from `GET /briefs`
- Displays a list of `brief-card` components, each showing:
  - Brief title (narrative name)
  - Trigger type badge (scheduled / alert / on_demand)
  - VRS at generation
  - Date generated
  - Language
  - Validation status
- Filters: by trigger type, by narrative cluster, by date range
- Click a card → navigates to `/dashboard/briefs/{id}`

**Brief Detail (`briefs/[id]/page.tsx`):**
- Fetches brief from `GET /briefs/{id}`
- Renders the full brief content in a clean, readable layout:
  - Title + metadata bar (narrative, VRS, date, validation status)
  - Section: "The Technique" → `technique_explanation`
  - Section: "What This Narrative Claims" → `narrative_context`
  - Section: "Talking Points" → `talking_points` as a numbered list
  - Section: "What to Say" → `personal_script` in a quote block
  - Section: "Discussion Questions" → `discussion_questions` as a list
- "Share" button: copies public URL to clipboard
- "Generate New Version" button: triggers re-generation

**Alert Log (`alerts/page.tsx`):**
- Fetches alerts from `GET /alerts` (new endpoint needed — add to `routers/alerts.py`)
- Chronological list of alerts with:
  - Alert level badge (orange / red)
  - Narrative name
  - VRS score at alert time
  - Timestamp
  - Link to the associated brief
  - Count of subscribers notified

### New Backend Endpoint Needed

Add `routers/alerts.py`:
```python
@router.get("/alerts", response_model=list[AlertResponse])
async def list_alerts():
    # Query alerts table, join with narratives for name, order by created_at desc
    ...
```

### Commands

```bash
cd apps/web && pnpm dev
# Both frontend (port 3000) and backend (port 8000) must be running
```

### Verification

1. `/dashboard` shows the bubble chart with real VRS data. Bubbles are color-coded.
2. Clicking a bubble or card on the radar view shows narrative details.
3. `/dashboard/trends` shows a time-series chart. Selecting different narratives
   updates the chart.
4. `/dashboard/briefs` shows a list of generated briefs (at least the test brief
   from Phase 5).
5. `/dashboard/briefs/{id}` shows the full brief with all sections rendered.
6. `/dashboard/alerts` shows the alert log (may be empty until alert generation
   is implemented in Phase 9).
7. All VRS badges show correct colors for their score ranges.
8. Visual check: charts use dark backgrounds, not white. Grid lines are subtle
   (slate-700/30). Labels are slate-400. The overall feel is data-dense, not decorative.

### Decisions Made

- **Recharts ScatterChart for the radar** (not a literal radar/spider chart) — bubble chart is more readable for 20+ narratives than a spider chart. The report calls it a "bubble chart" in §12.2.
- **VRS threshold lines at 30/60/80** — matches the report's green/amber/orange/red thresholds.
- **Brief detail as a full-page view** (not a modal) — briefs are long-form content that needs full-width rendering. A modal would be too cramped.
- **No real-time updates for hackathon** — data refreshes on page load. Supabase real-time subscriptions are a post-hackathon enhancement.

---

## Phase 8: Public Features

**Goal:** Build the public Taxonomy Browser (SSG), the On-Demand Brief Generator,
and the landing page. The Taxonomy Browser is accessible without login. The
On-Demand Generator is available to authenticated users. After this phase, the
public-facing product is complete.

**Prerequisites:** Phase 5 complete (brief generation works). Phase 6 complete
(auth works). Phase 7 complete (dashboard UI patterns established).

### Files to Create

```
apps/web/src/
├── app/
│   ├── page.tsx                      # Landing page (rewrite from placeholder)
│   ├── taxonomy/
│   │   ├── page.tsx                  # Taxonomy browser: searchable list (SSG)
│   │   └── [id]/
│   │       └── page.tsx              # Narrative detail page (SSG)
│   ├── dashboard/
│   │   └── generate/
│   │       └── page.tsx              # On-demand brief generator (protected)
│
├── components/
│   ├── taxonomy/
│   │   ├── taxonomy-list.tsx         # Filterable list of narratives
│   │   ├── taxonomy-card.tsx         # Card for a single narrative
│   │   └── taxonomy-search.tsx       # Search input with cluster filter
│   ├── brief/
│   │   └── brief-generator-form.tsx  # Form: paste text → generate brief
│   └── landing/
│       ├── hero.tsx                  # Hero section
│       ├── features.tsx              # Feature highlights
│       └── how-it-works.tsx          # Visual pipeline explanation
```

### Implementation Details

**Taxonomy Browser (`taxonomy/page.tsx`) — Static Generation:**
- Uses `generateStaticParams()` and fetches all narratives at build time
  from Supabase (via server component)
- Renders a searchable, filterable grid of taxonomy cards
- Filters: by cluster (7 options), by technique type (8 options), text search
- No login required — fully public
- Page is statically generated at build time (ISR with revalidation every hour)

**Narrative Detail (`taxonomy/[id]/page.tsx`) — Static Generation:**
- Fetches single narrative by ID at build time
- Renders full taxonomy entry:
  - Name, cluster, technique type (as badges)
  - Description
  - Variants (as tags)
  - Historical origin
  - Propagation path
  - Factual refutations (as expandable cards)
  - Inoculation hook
  - Talking points
  - Related narratives (as links to other taxonomy pages)
- "Generate Brief" button (links to `/dashboard/generate?narrative={id}`, requires login)

**On-Demand Generator (`dashboard/generate/page.tsx`):**
- Protected route (requires auth)
- Two input modes:
  1. **Text input:** Paste any text → submit → backend matches against taxonomy →
     shows matched narrative(s) → user clicks "Generate Brief" → brief generated
  2. **Narrative selector:** Choose from dropdown → submit → brief generated directly
- Flow:
  1. User pastes text and clicks "Analyse"
  2. Frontend sends `POST /match` to FastAPI (new endpoint: accepts text, returns
     matched narratives with similarity scores)
  3. Results shown: matched narrative names, similarity scores, cluster, technique
  4. User clicks "Generate Inoculation Brief" on the best match
  5. Frontend sends `POST /briefs/generate` with `narrative_id` and `trigger_type: "on_demand"`
  6. Loading state while brief generates (~15-30 seconds)
  7. Brief displayed inline using the same `BriefContent` renderer from Phase 7

**New Backend Endpoint:**
Add to `routers/briefs.py`:
```python
@router.post("/match", response_model=list[NarrativeMatch])
async def match_text(request: MatchRequest):
    # request.text → matcher.match_text() → return matches
    ...
```

**Landing Page (`page.tsx`):**
- Hero: "A weather radar for Islamophobia" (the report's core pitch)
  - Subhead: "Forecast which anti-Muslim narratives will go viral — and inoculate
    communities before they do."
  - Two CTAs: "Browse the Taxonomy" → `/taxonomy`, "Dashboard Login" → `/login`
- How It Works: 3-step visual (Monitor → Forecast → Inoculate)
  - Uses simple icons or diagrams, not stock photos
- Features: 4 cards (Narrative Radar, Forecast Engine, Inoculation Briefs, Taxonomy)
- Footer: "Built for the 2026 Harvest Anti-Muslim Hate Hackathon" + links

Design notes for the landing page:
- NOT a generic SaaS landing page with gradient hero and screenshot mockup
- Dark background, minimal. The text and the idea should carry the page.
- Hero uses large, clean typography. No decorative SVGs or blobs.
- Feature cards are text-forward with small icons. Not big illustration cards.
- Color accent: sky-400 for links and CTAs only.

### Commands

```bash
cd apps/web && pnpm dev
# Test taxonomy pages
# Test on-demand generator
# Test landing page
```

### Verification

1. `http://localhost:3000` → landing page renders with hero, features, how-it-works
2. `http://localhost:3000/taxonomy` → shows all ~20 narratives in a searchable grid
3. Typing in the search box filters narratives in real time
4. Selecting a cluster filter shows only narratives from that cluster
5. Clicking a narrative card → navigates to `/taxonomy/NAR-001` (or similar)
6. Narrative detail page shows all fields from the taxonomy entry
7. `http://localhost:3000/dashboard/generate` (logged in) → shows the generator form
8. Paste sample text → click "Analyse" → matched narratives appear
9. Click "Generate Brief" → loading state → brief appears
10. The landing page looks serious and minimal — not a template

### Decisions Made

- **ISR (Incremental Static Regeneration) with 1-hour revalidation** for taxonomy pages — static for performance, but refreshes when taxonomy data changes
- **Text matching via backend API** (not client-side) — the SBERT model runs on the server, not in the browser
- **On-demand generator requires auth** — prevents abuse and tracks usage. The taxonomy browser is fully public.
- **Landing page is minimal and text-forward** — avoids the AI-generated-website look

---

## Phase 9: Delivery & Subscriber System

**Goal:** Build the email delivery system (weekly digest via Resend), subscriber
management (registration approval, preferences), and the community tip line.
After this phase, the weekly forecast can be sent to subscribers and community
members can submit tips.

**Prerequisites:** Phase 5 complete (brief generation). Phase 6 complete (auth +
registration). Resend API key obtained.

### Files to Create

```
apps/api/
├── services/
│   ├── email_service.py              # Resend integration + digest builder
│   └── digest_builder.py             # Builds the weekly forecast email content
├── routers/
│   ├── subscribers.py                # Updated: approval workflow, preferences
│   └── digest.py                     # POST /digest/send — trigger weekly digest
├── scripts/
│   └── send_weekly_digest.py         # CLI script to send the weekly digest
├── templates/
│   └── weekly_digest.html            # HTML email template for the digest

apps/web/src/
├── app/dashboard/
│   ├── tips/
│   │   └── page.tsx                  # Community tip submission + history
│   └── settings/
│       └── page.tsx                  # Subscriber settings (preferences)
```

### Implementation Details

**`services/email_service.py`:**
- `send_email(to: str, subject: str, html: str) -> bool` using Resend SDK
- `send_digest(subscriber: Subscriber, digest_content: DigestContent) -> bool`
- Simple wrapper around the Resend API

**`services/digest_builder.py`:**
- `build_weekly_digest() -> DigestContent`:
  1. Get top 3 narratives by VRS score (descending)
  2. For each, get (or generate) a current brief
  3. Categorize each into red/amber/green based on VRS thresholds
  4. Build the digest email using the format from report.md §11.2
  5. Return structured content (subject line, HTML body)

**Weekly Digest HTML Template (`templates/weekly_digest.html`):**
- Clean, dark-themed HTML email (not a bright white marketing email)
- Matches the dashboard aesthetic
- Sections: "This Week's Narrative Radar" → top 3 narratives with VRS badges →
  full brief for the #1 narrative → talking points
- Footer: link to dashboard, unsubscribe link

**Subscriber Management (`routers/subscribers.py` updates):**
- `POST /subscribers` — creates subscriber (already exists, update if needed)
- `PATCH /subscribers/{id}/approve` — admin approves subscriber (sets status to "approved")
- `PATCH /subscribers/{id}/preferences` — update notification preferences
- `GET /subscribers/me` — get current subscriber's record

**Community Tips (`tips/page.tsx` + `routers/tips.py`):**
- Frontend: form to submit a tip (text description of the narrative observed,
  where it was seen, optional related narrative selection)
- Backend: `POST /tips` stores the tip, `GET /tips` returns tips for the current user
- Tips page also shows submission history with status badges (pending/reviewed/confirmed/rejected)

**Settings Page (`settings/page.tsx`):**
- Language preference selector
- Delivery frequency toggle (weekly / realtime)
- Focus clusters multi-select (which narrative clusters to prioritize)
- Contact email display

### Commands

```bash
cd apps/api
source .venv/bin/activate

# Install Resend SDK
pip install resend
pip freeze > requirements.txt

# Test email delivery
python -c "
import resend
from config import settings
resend.api_key = settings.resend_api_key
r = resend.Emails.send({
    'from': settings.resend_from_email,
    'to': 'your-test-email@example.com',
    'subject': 'Prebunk Test',
    'html': '<p>Test email from Prebunk</p>'
})
print(f'Email sent: {r}')
"

# Build and send a test weekly digest
python scripts/send_weekly_digest.py --test

deactivate
```

### Verification

1. Test email is received in inbox (confirms Resend integration)
2. `python scripts/send_weekly_digest.py --test` → digest email is received
3. Digest email contains: top 3 narratives with VRS scores, full brief for #1,
   talking points
4. `/dashboard/tips` → shows tip submission form
5. Submit a tip → it appears in the tips list with "pending" status
6. `/dashboard/settings` → shows current preferences, changes save successfully
7. In Supabase: `subscribers` table shows the test user with correct preferences

### Decisions Made

- **HTML email (not plain text)** — the digest format from the report is visual (colored VRS badges, structured sections). HTML is necessary.
- **Dark-themed email** — matches the product's visual identity. Most email clients support dark backgrounds.
- **Resend's `onboarding@resend.dev` sender** for hackathon — no custom domain needed. Switch to a verified domain post-hackathon.
- **Manual admin approval** for subscribers — during hackathon, approve via Supabase dashboard or a direct API call. Admin UI is post-hackathon scope.
- **Tip submission is free-text** — no structured form beyond description. Manual review handles classification. This matches the report's design (§5.8).

---

## Phase 10: Forecast Engine

**Goal:** Implement the VRS forecasting system. Start with a simplified trend
extrapolation (rolling average + linear projection), then layer on Prophet for
more sophisticated forecasting. Add forecast overlays to the dashboard trends view.
After this phase, the system can predict which narratives will escalate.

**Prerequisites:** Phase 4 complete (VRS history data exists — needs several days
of ingestion to be meaningful). Phase 7 complete (trends view exists).

### Files to Create

```
apps/api/
├── services/
│   └── forecast.py                   # Forecasting engine
├── routers/
│   └── forecast.py                   # GET /forecast/{narrative_id}
├── models/
│   └── forecast.py                   # Pydantic models for forecast response

apps/web/src/
├── components/dashboard/
│   └── forecast-overlay.tsx          # Forecast line overlay for trend chart
├── app/dashboard/trends/
│   └── page.tsx                      # Updated: adds forecast overlay
```

### Implementation Details

**`services/forecast.py`:**
Two forecasting approaches, used based on data availability:

1. **Simple trend extrapolation** (always available):
   - Takes the last 7 days of VRS scores for a narrative
   - Computes a rolling 24-hour average
   - Fits a linear regression to the rolling averages
   - Projects 72 hours forward
   - Returns predicted VRS scores at 12-hour intervals with a simple confidence band
     (±15% of predicted value)

2. **Prophet forecasting** (when sufficient data exists — ≥30 days):
   - Uses Prophet to model the time series with daily and weekly seasonality
   - Projects 72 hours forward with proper confidence intervals
   - Falls back to simple trend extrapolation if Prophet fails or data is insufficient

**`routers/forecast.py`:**
```python
@router.get("/forecast/{narrative_id}", response_model=ForecastResponse)
async def get_forecast(narrative_id: str, hours: int = 72):
    # Returns historical VRS + predicted VRS with confidence bands
    ...
```

**`ForecastResponse` model:**
```python
class ForecastPoint(BaseModel):
    timestamp: datetime
    predicted_vrs: float
    lower_bound: float
    upper_bound: float

class ForecastResponse(BaseModel):
    narrative_id: str
    narrative_name: str
    current_vrs: float
    method: str  # "linear" or "prophet"
    forecast: list[ForecastPoint]
    predicted_peak: float
    predicted_peak_time: datetime
    breakout_risk: str  # "low", "moderate", "high"
```

**`breakout_risk` classification:**
- "low": predicted peak VRS < 30
- "moderate": predicted peak VRS 30–60
- "high": predicted peak VRS > 60

**Forecast Overlay on Trend Chart:**
- The trend chart (Phase 7) is updated to optionally show the forecast
- Forecast line is rendered as a dashed line with a shaded confidence band
- Toggle: "Show Forecast" checkbox on the trends view

### Commands

```bash
cd apps/api
source .venv/bin/activate

# Install Prophet (can be slow due to compilation)
pip install prophet
pip freeze > requirements.txt

# Test simple forecast (works with minimal data)
python -c "
from services.forecast import get_forecast
result = get_forecast('NAR-001')
print(f'Current VRS: {result.current_vrs}')
print(f'Method: {result.method}')
print(f'Predicted peak: {result.predicted_peak}')
print(f'Breakout risk: {result.breakout_risk}')
for p in result.forecast[:3]:
    print(f'  {p.timestamp}: {p.predicted_vrs:.1f} ({p.lower_bound:.1f}-{p.upper_bound:.1f})')
"

deactivate
```

### Verification

1. `GET /forecast/NAR-001` → returns a forecast response with predicted VRS values
2. Forecast uses "linear" method initially (insufficient data for Prophet)
3. After 30+ days of data: forecast switches to "prophet" method
4. `/dashboard/trends` → selecting a narrative and toggling "Show Forecast" renders
   a dashed projection line beyond the current data
5. Confidence bands are visible as a shaded area around the forecast line

### Decisions Made

- **Two-tier forecast** (simple first, Prophet second) — matches the report's recommendation (§14: "Prophet is optional stretch"). Ensures the forecast feature works from day 1 with minimal data.
- **72-hour default projection** — matches the report's "48–72 hours" specification.
- **`breakout_risk` as a simple classification** — gives a human-readable summary without requiring the user to interpret raw numbers.
- **Prophet installation is optional** — the simple forecast works without it. If Prophet installation fails (it can be finicky), the system degrades gracefully.

---

## Phase 11: Integration, Polish & Submission

**Goal:** Run the full end-to-end pipeline, generate demo content, write the
README and disclosure documents, deploy to production, and prepare for submission.
After this phase, the project is complete and deployable.

**Prerequisites:** All previous phases complete.

### Files to Create

```
prebunk/
├── README.md                         # Project documentation
├── DISCLOSURES.md                    # Required: all tools/services used
├── apps/api/
│   ├── Dockerfile                    # Docker image for Railway deployment
│   └── scripts/
│       └── generate_demo_data.py     # Script to generate realistic demo content
├── apps/web/
│   └── .env.production               # Production environment variables
```

### Step-by-Step

**Step 1: End-to-End Pipeline Test**

Run the complete pipeline manually and verify every stage:

```bash
cd apps/api && source .venv/bin/activate

# 1. Run ingestion (Reddit + RSS + mock)
python scripts/run_pipeline.py

# 2. Check VRS scores
curl http://localhost:8000/vrs | python -m json.tool

# 3. Generate brief for highest-VRS narrative
curl -X POST http://localhost:8000/briefs/generate \
  -H "Content-Type: application/json" \
  -d '{"narrative_id": "NAR-001", "trigger_type": "on_demand"}'

# 4. Send test digest
python scripts/send_weekly_digest.py --test

# 5. Run forecast
curl http://localhost:8000/forecast/NAR-001 | python -m json.tool
```

All 5 steps must succeed. If any fail, fix before proceeding.

**Step 2: Generate Demo Content**

`scripts/generate_demo_data.py`:
- Generates 7 days of realistic `narrative_events` data (backdated) to populate
  the dashboard with meaningful charts
- Generates VRS scores for each day (showing trends — some narratives rising,
  some falling, one hitting "red")
- Generates 3–5 briefs for the top narratives
- This data makes the demo compelling even if real ingestion has only run for
  a few hours

```bash
python scripts/generate_demo_data.py
```

**Step 3: Deploy Backend to Railway**

Create `apps/api/Dockerfile`:
```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download SBERT model during build (bake into image)
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-mpnet-base-v2')"

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
# Deploy to Railway
cd apps/api
railway login
railway init
railway up

# Note the deployed URL (e.g., https://prebunk-api.up.railway.app)
# Update NEXT_PUBLIC_API_URL in Vercel env vars to this URL
```

**Step 4: Deploy Frontend to Vercel**

```bash
cd apps/web
vercel login
vercel

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# NEXT_PUBLIC_API_URL (Railway backend URL)
```

**Step 5: Write README.md**

Structure:
```markdown
# Prebunk — Narrative Forecast and Inoculation System

> A weather radar for Islamophobia.

## What It Does
[2 paragraphs from report §1]

## Live Demo
- Dashboard: [Vercel URL]
- Taxonomy Browser: [Vercel URL]/taxonomy
- API Docs: [Railway URL]/docs

## Tech Stack
[Summary table from STACK.md]

## How It Works
[4-step diagram: Ingest → Analyse → Generate → Deliver]

## The Science
[1 paragraph on inoculation theory, key citations]

## Running Locally
[Step-by-step dev setup instructions]

## Ethical Framework
[Summary from report §13]

## Disclosures
See [DISCLOSURES.md](./DISCLOSURES.md)

## License
MIT (code) + CC BY 4.0 (taxonomy data)
```

**Step 6: Write DISCLOSURES.md**

Copy the disclosure table from STACK.md §13, formatted as required by hackathon
rules. Include:
- All libraries with versions and licenses
- All managed services with tier (free/paid)
- All AI services used during development and in the product
- All datasets and their sources
- All academic sources used in taxonomy construction

**Step 7: Final Checks**

- [ ] All pages load on the production URL (Vercel)
- [ ] API responds on the production URL (Railway)
- [ ] Login/register works in production
- [ ] Dashboard shows data (VRS, charts, briefs)
- [ ] Taxonomy browser loads (public, no login)
- [ ] On-demand generator works (logged in)
- [ ] Weekly digest email sends successfully
- [ ] No raw hate content visible anywhere in the app
- [ ] No raw content sent to any external API (Gemini)
- [ ] README is complete and accurate
- [ ] DISCLOSURES.md lists everything

### Verification

1. Visit the Vercel production URL → landing page loads
2. Navigate to `/taxonomy` → all narratives visible, search works
3. Log in → dashboard loads with charts and data
4. Generate a brief on-demand → brief appears
5. API docs at `[Railway URL]/docs` → Swagger UI loads
6. Send a test digest → email arrives
7. README renders correctly on GitHub
8. DISCLOSURES.md is complete

### Decisions Made

- **Docker for Railway** (not Procfile) — needed to bake in the SBERT model. Railway auto-detects Dockerfiles.
- **Demo data script** — ensures the demo is compelling even with limited real ingestion time. Demo data is realistic but clearly synthetic.
- **Dual license** — MIT for code (standard open-source), CC BY 4.0 for taxonomy data (matches the report's §9.4 specification for open research use).
