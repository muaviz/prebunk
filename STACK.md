# Prebunk — Technology Stack

> Every choice below is optimized for **agentic development** (an AI agent doing the
> implementation): typed languages, schema-validated data, managed services, strong
> current documentation, one clear tool per job.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│  VERCEL                                                             │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Next.js 15 (App Router)                                      │  │
│  │  Dashboard · Taxonomy Browser · On-Demand Generator           │  │
│  └──────────────────────────┬────────────────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────────────┘
                              │ HTTPS
┌─────────────────────────────┼───────────────────────────────────────┐
│  RAILWAY                    │                                       │
│  ┌──────────────────────────▼────────────────────────────────────┐  │
│  │  Python FastAPI                                               │  │
│  │  ┌────────────┐ ┌──────────────┐ ┌─────────────────────────┐ │  │
│  │  │ Ingestion  │ │ Analysis     │ │ Content Generation      │ │  │
│  │  │ Reddit     │ │ SBERT Match  │ │ Gemini API → Briefs     │ │  │
│  │  │ RSS        │ │ VRS Engine   │ │ Validation · Multilingual│ │  │
│  │  │ (Mock T/X) │ │ Prophet      │ │                         │ │  │
│  │  └────────────┘ └──────────────┘ └─────────────────────────┘ │  │
│  └──────────────────────────┬────────────────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────────────┘
                              │ Supabase Client
┌─────────────────────────────┼───────────────────────────────────────┐
│  SUPABASE                   │                                       │
│  ┌──────────────────────────▼────────────────────────────────────┐  │
│  │  PostgreSQL 15 + pgvector                                     │  │
│  │  Auth (email + password) · Row Level Security                 │  │
│  │  Tables: narratives, vrs_scores, briefs, subscribers, ...     │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. Frontend

### Next.js 15 — App Router

- **Why:** The report specifies Next.js. App Router provides server components by
  default (fast initial loads, SEO for the public taxonomy browser), file-based routing
  (an agent can reason about URL structure from the directory tree), and built-in
  static generation for the Taxonomy Browser pages.
- **Why not alternatives:** SvelteKit and Remix are strong but have smaller ecosystems
  and less documentation surface for an agent to reference. Next.js has the largest
  body of current, indexed documentation.

### React 19

- Comes with Next.js 15. Server Components reduce client-side JavaScript.
  No additional React libraries needed beyond what Next.js provides.

### TypeScript 5

- **Why:** Type safety means the agent catches errors at compile time rather than
  discovering them at runtime. Pydantic on the backend + TypeScript on the frontend
  means both sides of the API boundary are schema-validated.

### Tailwind CSS v4

- **Why:** Utility-first CSS that an agent can write inline without maintaining
  separate stylesheet files. No naming decisions, no CSS architecture debates.
  Tailwind v4 uses the new CSS-first configuration (no `tailwind.config.js`
  required for basics), but we'll keep a config file for the custom design tokens.
- **Why not component libraries:** We use shadcn/ui for primitive components
  (see below) but override all styling. No pre-built dashboard template.

### shadcn/ui (Primitives Only)

- **Why:** Provides accessible, unstyled component primitives (Button, Input, Card,
  Badge, Dialog, Select, etc.) built on Radix UI. Components are copied into the
  project (no npm dependency), so the agent can modify them freely. Saves time
  on accessibility without imposing a visual style.
- **Critical:** All default shadcn styling is overridden by our custom dark theme.
  No default shadcn "look" in the final product.

### Recharts

- **Why:** Declarative React charting library. The agent writes JSX, not imperative
  D3 code. Supports scatter/bubble charts (for the VRS radar), line charts (for
  trends), and area charts (for forecasts). API is simple enough that an agent
  can produce correct charts reliably.
- **Why not D3:** D3 is more powerful but requires imperative DOM manipulation.
  AI agents produce significantly more bugs with D3 than with declarative APIs.
- **Why not Chart.js:** React integration is weaker; Recharts is React-native.

### @supabase/ssr + @supabase/supabase-js

- **Why:** Official Supabase client for Next.js server components and middleware.
  Handles auth session management, cookie-based auth, and database queries from
  both server and client components.

### next/font (Inter)

- **Why:** Inter is clean, professional, and loads via `next/font/google` with zero
  layout shift. No external font CDN.

---

## 2. Backend

### Python 3.12

- **Why:** The ML dependencies (sentence-transformers, Prophet) are Python-only.
  Running a single Python backend avoids splitting logic across two runtimes.
  Python 3.12 has improved error messages and performance.

### FastAPI

- **Why:** Automatic OpenAPI schema generation (the agent can verify the API contract).
  Pydantic integration for request/response validation. Async support. Excellent
  documentation — one of the best-documented Python frameworks, which is critical
  for agent-generated code.
- **Why not Flask:** No built-in validation, no automatic docs, less typed.
- **Why not Django:** Heavier than needed; we're using Supabase for the database
  layer, not Django ORM.

### Pydantic v2

- **Why:** Schema validation for all API inputs, outputs, and internal data structures.
  When the agent generates a Pydantic model, it enforces types at runtime. This
  catches bugs that would otherwise surface only during integration testing.
  Pydantic v2 is significantly faster than v1.

### Uvicorn

- **Why:** ASGI server for FastAPI. Standard choice, no configuration needed beyond
  the basics.

---

## 3. Database

### Supabase (Hosted PostgreSQL 15)

- **Why:** Managed PostgreSQL with a generous free tier. Provides Auth, Row Level
  Security, real-time subscriptions, and a REST API out of the box. The Supabase
  MCP server is already configured in this workspace, allowing the agent to manage
  schema, run queries, and apply migrations directly.
- **Why not raw PostgreSQL on Railway:** Supabase adds auth, RLS, and admin UI
  at no extra cost. One fewer service to manage.
- **Why not MongoDB:** Relational data (narratives referencing clusters, briefs
  referencing narratives) is naturally tabular. PostgreSQL's JSONB columns handle
  the semi-structured parts (brief content, refutations).

### pgvector Extension

- **Why:** Stores pre-computed SBERT embeddings (768-dimensional vectors) directly
  in PostgreSQL. Enables cosine similarity search in SQL without a separate vector
  database. Supabase supports pgvector natively.

### Supabase Auth (Email + Password)

- **Why:** Built into Supabase, integrates with RLS. Subscriber organizations
  register with email/password. Admin approval workflow uses a `status` field
  on the subscriber record (pending → approved). No third-party auth service
  needed.

### Row Level Security (RLS)

- **Why:** Subscribers see only their own data. Public taxonomy data is readable
  by anyone. Briefs are readable by approved subscribers. RLS policies enforce
  this at the database level, not in application code.

---

## 4. ML / Analysis Layer

### sentence-transformers — `all-mpnet-base-v2`

- **Why:** The report specifies this model. It produces 768-dimensional embeddings
  with strong semantic similarity performance. Runs locally (no API call, no data
  leaves the machine). The model is ~420MB, loaded once at startup.
- **How used:** Pre-compute embedding centroids for each taxonomy entry's semantic
  anchors. At ingestion time, embed incoming text and compute cosine similarity
  against all centroids. Record matches above the threshold.
- **Privacy:** Raw text is embedded and compared locally. Only the match result
  (narrative ID + similarity score) is stored. The text itself is discarded.

### Prophet (Facebook/Meta)

- **Why:** The report specifies Prophet for time-series forecasting of VRS scores.
  It handles weekly seasonality and trend detection out of the box. Configuration
  is minimal — the agent calls `Prophet().fit(df).predict(future)` and gets a
  forecast with confidence intervals.
- **Hackathon scope:** Prophet is a "should-have." A simplified rolling-average
  trend extrapolation is implemented first; Prophet is layered on when sufficient
  VRS history exists (after ~7 days of data collection).

### NumPy + Pandas + scikit-learn

- **Why:** Standard numerical computing stack. Used for VRS computation (weighted
  scoring), data manipulation (time-series aggregation), and cosine similarity
  calculation. Already dependencies of sentence-transformers and Prophet.

---

## 5. Content Generation (LLM)

### Google Gemini API — Gemini 2.5 Flash

- **Why free:** The Gemini API free tier provides sufficient requests per day
  for the hackathon and early usage. No credit card required to start.
- **Why Flash:** Fast inference, low cost, strong instruction following for
  structured content generation. Excellent multilingual support (needed for
  Arabic, Urdu, Turkish brief translations).
- **Why Gemini over Claude/OpenAI:** Free tier availability. Claude API and
  OpenAI API both require paid plans. For a hackathon, zero-cost LLM access
  is decisive.
- **Python SDK:** `google-genai` — the unified Google AI Python SDK. Well
  documented, supports structured output, streaming, and system instructions.
- **Safety constraint:** Only curated taxonomy data (narrative descriptions,
  technique explanations, factual refutations) reaches the Gemini API. No
  raw social media content. This is enforced architecturally: the brief
  generation function accepts only a `BriefSpecification` Pydantic model,
  which is constructed exclusively from taxonomy fields.

### Model Configuration

The model name is stored in an environment variable (`GEMINI_MODEL`) so it
can be swapped without code changes. Default: `gemini-2.5-flash`.

---

## 6. Data Ingestion

### PRAW (Python Reddit API Wrapper)

- **Why:** Official Reddit API client for Python. Well-documented, handles
  authentication and rate limiting. Reddit is freely accessible (no paid
  tier needed for read-only monitoring).
- **What we ingest:** Post titles and selftext from monitored subreddits.
  Upvote counts and comment counts for velocity signals. Content is embedded,
  matched, scored, and discarded — never stored.

### feedparser

- **Why:** Standard Python library for parsing RSS/Atom feeds. No API key
  needed. Parses headlines and summaries from news outlets.
- **What we ingest:** Headlines and article summaries from ~20 curated news
  sources (hackathon scope; 120 post-hackathon). Full article content is never
  fetched.

### Mock Data Generators

- **Why:** Twitter/X API requires a paid developer account ($100/month minimum).
  Telegram's Telethon requires careful setup. For the hackathon, these two
  sources are mocked with realistic synthetic data generators that produce
  the same data shape as the real APIs.
- **Post-hackathon:** Twitter (Tweepy) and Telegram (Telethon) integrations
  replace the mocks.

---

## 7. Email / Delivery

### Resend

- **Why:** Developer-friendly email API with a free tier (100 emails/day,
  sufficient for hackathon). Excellent DX — send an email in 3 lines of Python.
  Supports HTML emails for the weekly digest format. React Email templates
  can be used for the digest layout.
- **Python SDK:** `resend` (PyPI package).

---

## 8. Hosting / Deployment

### Vercel (Frontend)

- **Why:** Native Next.js hosting. Zero-config deployment from GitHub. Free
  tier supports the hackathon. Automatic preview deployments for every commit.
  Edge network for fast global access (important since subscribers are
  worldwide).

### Railway (Backend)

- **Why:** Supports Python containers with zero Docker knowledge needed (it
  auto-detects Python projects). Also supports Docker for more control (needed
  to bake in the SBERT model). Free trial tier covers the hackathon. Built-in
  cron jobs for scheduled ingestion and VRS computation. Simple environment
  variable management.
- **Why not Fly.io:** Railway has simpler DX for a single container. Fly.io
  is better for multi-region but unnecessary for the hackathon.
- **Why not AWS/GCP:** Too much configuration overhead for a 48-hour build.

### Docker (Backend Container)

- **Why:** The SBERT model (~420MB) needs to be pre-downloaded at build time,
  not at startup. A Dockerfile bakes the model into the image so cold starts
  don't download it.

---

## 9. Design System

> The user's directive: "minimal, clear, built specifically for this product —
> not the generic default look an AI agent produces. No default purple gradients,
> no generic dashboard template feel. It should read as a serious, human-made
> intelligence tool."

### Visual Direction

Think signals intelligence dashboard, not SaaS template. Dark, dense with data,
no decorative elements. Every pixel earns its place.

### Color Tokens

```
Background (page):     slate-950  (#020617)
Surface (cards):       slate-900  (#0f172a)
Surface hover:         slate-800  (#1e293b)
Borders:               slate-700/50 (semi-transparent)
Text primary:          slate-50   (#f8fafc)
Text secondary:        slate-400  (#94a3b8)
Accent (links, active): sky-400   (#38bdf8)  — used sparingly
VRS Green (0–30):      emerald-500 (#22c55e)
VRS Amber (30–60):     amber-500   (#f59e0b)
VRS Orange (60–80):    orange-500  (#f97316)
VRS Red (80–100):      red-500     (#ef4444)
```

### Typography

- **Font:** Inter via `next/font/google`
- **Headings:** font-semibold, not bold. Restrained sizing.
- **Data values:** font-mono (tabular numbers for VRS scores, counts, dates)
- **Body:** text-sm (14px) as the base. Dense but readable.

### Layout Principles

- Sidebar navigation for the dashboard (collapsed on mobile)
- No rounded-xl cards. Use rounded-md (4px radius) or sharp corners.
- Minimal shadows. Use borders for card separation.
- Tight padding (p-3, p-4). Not the spacious p-8 defaults.
- Information density over whitespace. The dashboard should feel like a
  tool you use for work, not a marketing page.

---

## 10. Monorepo Structure

```
prebunk/
├── apps/
│   ├── web/                        # Next.js 15 frontend
│   │   ├── src/
│   │   │   ├── app/                # App Router pages
│   │   │   ├── components/         # React components
│   │   │   ├── lib/                # Utilities, Supabase clients
│   │   │   └── types/              # TypeScript type definitions
│   │   ├── public/
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   └── tailwind.config.ts
│   │
│   └── api/                        # Python FastAPI backend
│       ├── routers/                # Route handlers
│       ├── services/               # Business logic (matcher, VRS, brief gen)
│       ├── ingestion/              # Data collection (Reddit, RSS, mocks)
│       ├── models/                 # Pydantic models
│       ├── prompts/                # LLM prompt templates
│       ├── scripts/                # Seed, embedding computation, etc.
│       ├── tests/                  # Unit tests
│       ├── main.py                 # FastAPI app entry
│       ├── config.py               # Settings from env vars
│       ├── db.py                   # Supabase client
│       ├── requirements.txt
│       └── Dockerfile
│
├── data/
│   └── taxonomy/                   # Taxonomy JSON seed files
│       ├── clusters.json
│       ├── techniques.json
│       └── narratives.json
│
├── supabase/
│   ├── migrations/                 # SQL migration files
│   ├── seed.sql                    # Seed data SQL
│   └── config.toml                # Supabase CLI config
│
├── .env.example                    # Template for all env vars
├── .gitignore
├── report.md
├── STACK.md
├── PLAN.md
├── TASKS.md
├── DISCLOSURES.md                  # Required: all tools/services used
└── README.md
```

---

## 11. Environment Variables

All secrets are stored in `.env` files (never committed). The `.env.example`
at the repo root lists every variable needed.

### Supabase

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...                    # Public (used by frontend)
SUPABASE_SERVICE_ROLE_KEY=eyJ...            # Secret (used by backend only)
```

### Google Gemini API

```
GEMINI_API_KEY=AI...
GEMINI_MODEL=gemini-2.5-flash              # Changeable without code edits
```

### Resend (Email)

```
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=forecast@prebunk.org     # Or a verified domain
```

### App Configuration

```
API_BASE_URL=http://localhost:8000          # FastAPI URL (local dev)
NEXT_PUBLIC_API_URL=http://localhost:8000   # Exposed to Next.js client
NEXT_PUBLIC_SUPABASE_URL=...               # Same as SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=...          # Same as SUPABASE_ANON_KEY
CORS_ORIGINS=http://localhost:3000          # Allowed frontend origins
```

---

## 12. MCP Servers (Agent Tooling)

These MCP servers are already configured in this workspace and will be used
during development:

| Server | Purpose |
| --- | --- |
| **supabase** | Apply migrations, execute SQL, manage schema, query data |
| **playwright** | Run E2E tests against the local dev server |
| **github** | Manage repo, create issues, PRs |
| **context7** | Look up current library documentation |
| **filesystem** | Read/write files during development |

### Agent Skills (Pre-configured)

The `.agents/plugins/prebunk-dev-kit/skills/` directory contains skill
files that guide agent behavior for specific subsystems:

- `nextjs-dashboard-dev` — Frontend conventions (App Router, Tailwind, SSG)
- `data-ingestion-pipelines` — Ingestion rules (no raw data storage, rate limits)
- `local-ml-workflows` — SBERT and Prophet setup
- `supabase-schema-management` — Migration and RLS guidelines
- `prompt-engineering` — LLM prompt structure and validation
- `playwright-e2e-testing` — E2E test patterns

---

## 13. Full Disclosure List

> Required by hackathon rules: every tool, library, dataset, and AI service must
> be disclosed.

### Languages & Runtimes

| Tool | Version | Purpose |
| --- | --- | --- |
| Python | 3.12 | Backend, ML, ingestion |
| Node.js | 22 LTS | Frontend build tooling |
| TypeScript | 5.x | Frontend type safety |

### Frontend Libraries

| Library | Purpose | License |
| --- | --- | --- |
| Next.js 15 | React framework, App Router, SSG | MIT |
| React 19 | UI rendering | MIT |
| Tailwind CSS v4 | Utility-first styling | MIT |
| shadcn/ui | Accessible component primitives | MIT |
| Radix UI | Headless UI primitives (shadcn dep) | MIT |
| Recharts | Declarative charting (bubble, line) | MIT |
| @supabase/ssr | Supabase auth for Next.js | MIT |
| @supabase/supabase-js | Supabase client | MIT |
| next/font | Font loading (Inter) | MIT |

### Backend Libraries

| Library | Purpose | License |
| --- | --- | --- |
| FastAPI | Web framework | MIT |
| Uvicorn | ASGI server | BSD |
| Pydantic v2 | Data validation | MIT |
| supabase-py | Supabase Python client | MIT |
| python-dotenv | Environment variable loading | BSD |
| PRAW | Reddit API client | BSD |
| feedparser | RSS/Atom feed parsing | BSD |
| google-genai | Google Gemini API SDK | Apache 2.0 |
| resend | Email sending SDK | MIT |

### ML Libraries

| Library | Purpose | License |
| --- | --- | --- |
| sentence-transformers | SBERT embeddings | Apache 2.0 |
| torch (PyTorch) | ML backend for SBERT | BSD |
| prophet | Time-series forecasting | MIT |
| NumPy | Numerical computing | BSD |
| Pandas | Data manipulation | BSD |
| scikit-learn | Cosine similarity utilities | BSD |

### Managed Services

| Service | Purpose | Tier |
| --- | --- | --- |
| Supabase | PostgreSQL database + Auth | Free |
| Google Gemini API | LLM for brief generation | Free |
| Vercel | Frontend hosting | Free |
| Railway | Backend hosting | Free trial |
| Resend | Email delivery | Free (100/day) |
| Reddit API | Data source | Free |

### AI Services Used During Development

| Service | Purpose |
|---|---|
| Google Antigravity (Gemini) | Agentic development (code generation, debugging, planning) |

### Datasets

| Dataset | Purpose | Source |
| --- | --- | --- |
| Narrative Taxonomy (custom) | Core knowledge base | Built from academic sources (see report.md §9.4) |
| SBERT model `all-mpnet-base-v2` | Pre-trained embeddings | Hugging Face, trained on 1B+ sentence pairs |

### Academic Sources (Taxonomy Construction)

See report.md §8.4 for the complete list. Key sources:

- BRIDGE UK / CARR
- CAIR Islamophobia reports (2015–2025)
- UC Berkeley Haas Institute research
- SPLC anti-Muslim hate group profiles
- ISD narrative tracking reports
