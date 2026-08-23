# Prebunk — Task Checklist

> Flat, sequential checklist. Check off tasks as you complete them. Each task
> corresponds to a step in [PLAN.md](./PLAN.md). Reference the plan for full
> details on any task.

---

## Pre-Build: API Keys & Accounts

- [ ] Create Supabase project → get `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Enable pgvector extension in Supabase (Database → Extensions → vector)
- [ ] Get Google Gemini API key from aistudio.google.com → `GEMINI_API_KEY`
- [ ] Create Reddit app at reddit.com/prefs/apps → `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`
- [ ] Create Resend account → `RESEND_API_KEY`
- [ ] Create Vercel account (sign up with GitHub)
- [ ] Create Railway account (sign up with GitHub)

---

## Phase 0: Project Scaffolding

- [x] Create directory structure: `apps/api/{routers,services,ingestion,models,prompts,scripts,tests}`, `data/taxonomy`
- [x] Create `__init__.py` files in all Python package directories
- [x] Scaffold Next.js app in `apps/web` using `create-next-app` (TypeScript, Tailwind, App Router, src dir, pnpm)
- [x] Install frontend deps: `@supabase/supabase-js`, `@supabase/ssr`, `recharts`, `lucide-react`
- [x] Initialize shadcn/ui (New York style, slate color) and add components: button, card, input, badge, select, dialog, tabs, separator, skeleton
- [x] Create Python venv in `apps/api/.venv` and install: fastapi, uvicorn, supabase, pydantic, pydantic-settings, python-dotenv, httpx
- [x] Run `supabase init` at repo root
- [x] Create `.env.example` at repo root with all environment variable names
- [x] Create `.gitignore` (node_modules, .env, .env.local, .venv, __pycache__, .next, .vercel, *.pyc)
- [x] Write `apps/api/main.py` — minimal FastAPI app with `GET /health` endpoint and CORS middleware
- [x] Write `apps/api/config.py` — Pydantic Settings class loading all env vars
- [x] Write `apps/api/db.py` — Supabase client initialization
- [x] Write `apps/web/tailwind.config.ts` — custom dark theme tokens (slate-950 bg, VRS colors, sky-400 accent)
- [x] Update `apps/web/src/app/layout.tsx` — Inter font, dark background, "Prebunk" metadata
- [x] Write `apps/web/src/lib/supabase/client.ts` — browser Supabase client
- [x] Write `apps/web/src/lib/supabase/server.ts` — server Supabase client
- [x] Write `apps/web/.env.local.example`
- [x] **Verify:** FastAPI serves `GET /health` → `{"status":"ok"}` on port 8000
- [x] **Verify:** Next.js dev server runs on port 3000, shows dark page

---

## Phase 1: Database Schema & Taxonomy Seed

- [x] Write migration `00001_enable_extensions.sql` — enable pgvector and uuid-ossp
- [x] Write migration `00002_create_clusters.sql`
- [x] Write migration `00003_create_techniques.sql`
- [x] Write migration `00004_create_narratives.sql` (with VECTOR(768) embedding column)
- [x] Write migration `00005_create_narrative_events.sql` (with indexes on narrative_id, recorded_at)
- [x] Write migration `00006_create_vrs_scores.sql` (with indexes)
- [x] Write migration `00007_create_briefs.sql` (with indexes)
- [x] Write migration `00008_create_subscribers.sql`
- [x] Write migration `00009_create_community_tips.sql`
- [x] Write migration `00010_create_alerts.sql`
- [x] Write migration `00011_create_rls_policies.sql` — public read for taxonomy, auth read for briefs/vrs/alerts, own-record for subscribers/tips
- [x] Apply all migrations to Supabase (`supabase db push` or via MCP)
- [x] Generate `data/taxonomy/clusters.json` — 7 clusters from report §9.2
- [x] Generate `data/taxonomy/techniques.json` — 8 techniques from report §9.3
- [x] Generate `data/taxonomy/narratives.json` — ~20 narrative entries across all clusters
- [x] Write `apps/api/scripts/seed_taxonomy.py` — reads JSON files, inserts into Supabase
- [x] Run seed script to populate database
- [x] **Verify:** Supabase Table Editor shows all 10 tables
- [x] **Verify:** `clusters` has 7 rows, `techniques` has 8 rows, `narratives` has ~20 rows

---

## Phase 2: Backend API Foundation

- [x] Write `apps/api/models/narrative.py` — Pydantic models (Narrative, FactualRefutation, NarrativeResponse)
- [x] Write `apps/api/models/vrs.py` — Pydantic models (VRSScore, VRSHistory)
- [x] Write `apps/api/models/brief.py` — Pydantic models (Brief, BriefContent, BriefCreate)
- [x] Write `apps/api/models/subscriber.py` — Pydantic models (Subscriber, SubscriberCreate)
- [x] Write `apps/api/models/tip.py` — Pydantic models (CommunityTip, TipCreate)
- [x] Write `apps/api/routers/narratives.py` — `GET /narratives`, `GET /narratives/{id}`
- [x] Write `apps/api/routers/vrs.py` — `GET /vrs`, `GET /vrs/{narrative_id}/history`
- [x] Write `apps/api/routers/briefs.py` — `GET /briefs`, `GET /briefs/{id}`
- [x] Write `apps/api/routers/subscribers.py` — `POST /subscribers`, `GET /subscribers/me`
- [x] Write `apps/api/routers/tips.py` — `POST /tips`, `GET /tips`
- [x] Update `apps/api/main.py` — register all routers
- [x] **Verify:** `GET /narratives` returns JSON array of ~20 narratives
- [x] **Verify:** `GET /narratives/NAR-001` returns a single narrative
- [x] **Verify:** Swagger UI at `/docs` shows all endpoints with typed schemas

---

## Phase 3: Analysis Layer — Pattern Matching

- [ ] Install ML dependencies: sentence-transformers, torch, numpy, scikit-learn
- [ ] Write `apps/api/services/embeddings.py` — SBERT model loader + `embed_text()` function
- [ ] Write `apps/api/services/matcher.py` — `match_text()` with cosine similarity against taxonomy centroids
- [ ] Write `apps/api/scripts/compute_embeddings.py` — compute centroid embeddings for all narratives, store in Supabase
- [ ] Run `compute_embeddings.py` → all narratives have non-null embeddings
- [ ] **Verify:** `match_text("Muslims are replacing the population")` returns Demographic Threat narrative with score > 0.5
- [ ] **Verify:** `match_text("Weather forecast for tomorrow")` returns 0 matches

---

## Phase 4: VRS Engine & Data Ingestion

- [ ] Install ingestion dependencies: praw, feedparser
- [ ] Write `apps/api/ingestion/reddit.py` — PRAW client, fetch posts from 10 subreddits, match and discard text
- [ ] Write `apps/api/ingestion/rss.py` — feedparser client, parse ~20 RSS feeds
- [ ] Create `apps/api/data/rss_feeds.json` — curated list of ~20 news source RSS URLs
- [ ] Write `apps/api/ingestion/mock.py` — mock data generators for Twitter/Telegram
- [ ] Write `apps/api/services/velocity.py` — VRS computation (volume 40% + acceleration 30% + cross-platform 30%)
- [ ] Write `apps/api/ingestion/pipeline.py` — orchestrator: run sources → match → compute VRS → store
- [ ] Write `apps/api/routers/ingest.py` — `POST /ingest/run`
- [ ] Write `apps/api/scripts/run_pipeline.py` — CLI script to run the full pipeline
- [ ] Update `apps/api/routers/vrs.py` — ensure `GET /vrs` returns real computed data
- [ ] Run pipeline once: `python scripts/run_pipeline.py`
- [ ] **Verify:** `narrative_events` table has rows (reddit and/or rss platform)
- [ ] **Verify:** `GET /vrs` returns VRS scores for narratives with matches
- [ ] **Verify:** `narrative_events` table contains NO raw text content

---

## Phase 5: Content Generation — Brief Pipeline

- [ ] Install Gemini SDK: google-genai
- [ ] Write `apps/api/prompts/step1_technique.txt` — technique explanation prompt template
- [ ] Write `apps/api/prompts/step2_context.txt` — narrative context prompt template (injects taxonomy data)
- [ ] Write `apps/api/prompts/step3_action.txt` — talking points + scripts prompt template
- [ ] Write `apps/api/prompts/validation.txt` — 5-criteria validation prompt
- [ ] Update `apps/api/models/brief.py` — add `BriefContent` schema (technique_explanation, narrative_context, talking_points, personal_script, discussion_questions, summary)
- [ ] Write `apps/api/services/brief_generator.py` — 3-step Gemini API chain, assembles BriefContent
- [ ] Write `apps/api/services/brief_validator.py` — validation call + retry logic (max 2 retries)
- [ ] Update `apps/api/routers/briefs.py` — add `POST /briefs/generate` endpoint
- [ ] Test Gemini API connection: simple `generate_content` call
- [ ] Generate a test brief for NAR-001
- [ ] **Verify:** Brief has all 6 BriefContent fields populated
- [ ] **Verify:** Validation outcome is "pass"
- [ ] **Verify:** No raw hate content in Gemini API prompts (only taxonomy-derived data)

---

## Phase 6: Frontend Foundation

- [ ] Update `apps/web/src/app/globals.css` — dark theme CSS variables overriding shadcn defaults
- [ ] Update `apps/web/src/app/layout.tsx` — Inter font, dark bg, metadata
- [ ] Write `apps/web/src/lib/api.ts` — typed fetch wrapper for FastAPI backend
- [ ] Write `apps/web/src/lib/utils.ts` — utility functions (cn, formatDate, etc.)
- [ ] Write `apps/web/src/types/index.ts` — TypeScript interfaces matching all Pydantic models
- [ ] Write `apps/web/src/lib/supabase/middleware.ts` — session refresh logic
- [ ] Write `apps/web/src/middleware.ts` — protect `/dashboard/*` routes, redirect to `/login`
- [ ] Write `apps/web/src/app/auth/callback/route.ts` — Supabase auth callback
- [ ] Write `apps/web/src/app/login/page.tsx` — login form (email + password)
- [ ] Write `apps/web/src/app/register/page.tsx` — registration form (email, password, org name, org type, country)
- [ ] Write `apps/web/src/components/layout/sidebar.tsx` — dashboard sidebar (Radar, Trends, Briefs, Alerts, Tips, Generate, Settings links)
- [ ] Write `apps/web/src/components/layout/header.tsx` — top bar (page title, user menu, logout)
- [ ] Write `apps/web/src/components/layout/nav-link.tsx` — sidebar link component with active state
- [ ] Write `apps/web/src/app/dashboard/layout.tsx` — sidebar + main content area layout
- [ ] Write `apps/web/src/app/dashboard/page.tsx` — placeholder radar view
- [ ] Disable email confirmation in Supabase Auth settings (for hackathon speed)
- [ ] **Verify:** Login/register flow works end-to-end
- [ ] **Verify:** `/dashboard` is protected (redirects to `/login` when logged out)
- [ ] **Verify:** Dashboard layout shows sidebar with all navigation links
- [ ] **Verify:** Visual: dark slate-950 background, no purple gradients, no default template look

---

## Phase 7: Dashboard Views

- [ ] Write `apps/web/src/components/dashboard/vrs-badge.tsx` — color-coded VRS score badge (green/amber/orange/red)
- [ ] Write `apps/web/src/components/dashboard/stat-widget.tsx` — key metric display component
- [ ] Write `apps/web/src/components/dashboard/narrative-card.tsx` — narrative summary card with VRS badge
- [ ] Write `apps/web/src/components/dashboard/radar-chart.tsx` — Recharts ScatterChart (bubble chart: cluster × VRS, color by level, size by volume)
- [ ] Update `apps/web/src/app/dashboard/page.tsx` — Radar view: fetch VRS data, render bubble chart + narrative cards + stat widgets
- [ ] Write `apps/web/src/components/dashboard/trend-chart.tsx` — Recharts LineChart with threshold lines at 30/60/80
- [ ] Write `apps/web/src/app/dashboard/trends/page.tsx` — Trends view: narrative selector, date range, time-series chart
- [ ] Write `apps/web/src/components/dashboard/brief-card.tsx` — brief summary card (title, trigger type, VRS, date)
- [ ] Write `apps/web/src/app/dashboard/briefs/page.tsx` — Brief archive: list with filters (trigger type, cluster, date)
- [ ] Write `apps/web/src/app/dashboard/briefs/[id]/page.tsx` — Brief detail: full content rendered in sections
- [ ] Write `apps/web/src/components/dashboard/alert-card.tsx` — alert summary card
- [ ] Write `apps/api/routers/alerts.py` — `GET /alerts` endpoint
- [ ] Write `apps/web/src/app/dashboard/alerts/page.tsx` — Alert log: chronological list of orange/red alerts
- [ ] **Verify:** Radar view shows bubble chart with real VRS data, correct colors
- [ ] **Verify:** Trends view shows time-series chart for selected narratives
- [ ] **Verify:** Brief archive lists briefs, clicking one shows full detail
- [ ] **Verify:** Charts use dark styling (dark backgrounds, subtle grid lines)

---

## Phase 8: Public Features

- [ ] Write `apps/web/src/components/taxonomy/taxonomy-search.tsx` — search input with cluster/technique filters
- [ ] Write `apps/web/src/components/taxonomy/taxonomy-card.tsx` — narrative card for taxonomy browser
- [ ] Write `apps/web/src/components/taxonomy/taxonomy-list.tsx` — filterable grid of taxonomy cards
- [ ] Write `apps/web/src/app/taxonomy/page.tsx` — Taxonomy browser (SSG with ISR revalidation)
- [ ] Write `apps/web/src/app/taxonomy/[id]/page.tsx` — Narrative detail page (SSG): all taxonomy fields rendered
- [ ] Add `POST /match` endpoint to `apps/api/routers/briefs.py` — accepts text, returns matched narratives
- [ ] Write `apps/web/src/components/brief/brief-generator-form.tsx` — text input form with "Analyse" button
- [ ] Write `apps/web/src/app/dashboard/generate/page.tsx` — On-demand generator: paste text → match → generate brief
- [ ] Write `apps/web/src/components/landing/hero.tsx` — "A weather radar for Islamophobia" hero section
- [ ] Write `apps/web/src/components/landing/features.tsx` — 4 feature cards (Radar, Forecast, Briefs, Taxonomy)
- [ ] Write `apps/web/src/components/landing/how-it-works.tsx` — 3-step visual (Monitor → Forecast → Inoculate)
- [ ] Rewrite `apps/web/src/app/page.tsx` — landing page with hero, features, how-it-works, footer
- [ ] **Verify:** `/taxonomy` shows all narratives, search and filtering work
- [ ] **Verify:** `/taxonomy/NAR-001` shows complete narrative detail
- [ ] **Verify:** `/dashboard/generate` — paste text → matches shown → generate brief → brief displayed
- [ ] **Verify:** Landing page looks serious and minimal, not a template

---

## Phase 9: Delivery & Subscriber System

- [ ] Install Resend SDK: `pip install resend`
- [ ] Write `apps/api/services/email_service.py` — Resend wrapper: `send_email(to, subject, html)`
- [ ] Write `apps/api/templates/weekly_digest.html` — dark-themed HTML email template
- [ ] Write `apps/api/services/digest_builder.py` — build digest from top 3 VRS narratives + briefs
- [ ] Write `apps/api/routers/digest.py` — `POST /digest/send` endpoint
- [ ] Write `apps/api/scripts/send_weekly_digest.py` — CLI to build and send weekly digest
- [ ] Update `apps/api/routers/subscribers.py` — add `PATCH /subscribers/{id}/approve`, `PATCH /subscribers/{id}/preferences`
- [ ] Write `apps/web/src/app/dashboard/tips/page.tsx` — tip submission form + history
- [ ] Write `apps/web/src/app/dashboard/settings/page.tsx` — language pref, delivery freq, focus clusters
- [ ] Test Resend email delivery (send a test email)
- [ ] Run `send_weekly_digest.py --test` → digest email received
- [ ] **Verify:** Digest email has correct structure (top 3 narratives, VRS badges, full brief, talking points)
- [ ] **Verify:** Tips submission and display works
- [ ] **Verify:** Settings page saves preferences to Supabase

---

## Phase 10: Forecast Engine

- [ ] Install Prophet: `pip install prophet`
- [ ] Write `apps/api/models/forecast.py` — Pydantic models (ForecastPoint, ForecastResponse)
- [ ] Write `apps/api/services/forecast.py` — simple linear trend extrapolation + Prophet (when data ≥30 days)
- [ ] Write `apps/api/routers/forecast.py` — `GET /forecast/{narrative_id}`
- [ ] Write `apps/web/src/components/dashboard/forecast-overlay.tsx` — dashed forecast line with confidence band
- [ ] Update `apps/web/src/app/dashboard/trends/page.tsx` — add "Show Forecast" toggle
- [ ] **Verify:** `GET /forecast/NAR-001` returns predicted VRS with confidence bands
- [ ] **Verify:** Trends view shows forecast overlay when toggled on

---

## Phase 11: Integration, Polish & Submission

- [ ] Write `apps/api/scripts/generate_demo_data.py` — generate 7 days of realistic backdated data
- [ ] Run demo data script → dashboard has meaningful charts and trends
- [ ] Run full end-to-end pipeline: ingest → match → VRS → brief → email
- [ ] Write `apps/api/Dockerfile` — Python 3.12 + baked-in SBERT model
- [ ] Deploy backend to Railway (`railway up` from `apps/api`)
- [ ] Deploy frontend to Vercel (`vercel` from `apps/web`)
- [ ] Set production environment variables on Vercel and Railway
- [ ] Write `README.md` — project overview, live demo links, tech stack, running locally, ethics, disclosures link
- [ ] Write `DISCLOSURES.md` — all tools, libraries, services, datasets, AI services with versions and licenses
- [ ] **Verify:** Production frontend loads at Vercel URL
- [ ] **Verify:** Production API responds at Railway URL
- [ ] **Verify:** Login/register works in production
- [ ] **Verify:** Dashboard shows data in production
- [ ] **Verify:** Taxonomy browser works in production (public, no login)
- [ ] **Verify:** On-demand generator works in production
- [ ] **Verify:** Weekly digest email sends from production
- [ ] **Verify:** README renders correctly on GitHub
- [ ] **Verify:** DISCLOSURES.md is complete (all tools/services listed)
- [ ] **Verify:** No raw hate content stored or sent to any external API

---

## Summary

| Phase | Tasks | Focus |
|---|---|---|
| Pre-Build | 7 | API keys and accounts |
| Phase 0 | 19 | Scaffolding |
| Phase 1 | 19 | Database + taxonomy |
| Phase 2 | 14 | Backend API |
| Phase 3 | 7 | Pattern matching (SBERT) |
| Phase 4 | 14 | Ingestion + VRS |
| Phase 5 | 13 | Brief generation (LLM) |
| Phase 6 | 20 | Frontend foundation |
| Phase 7 | 17 | Dashboard views |
| Phase 8 | 16 | Public features |
| Phase 9 | 13 | Email + subscribers |
| Phase 10 | 8 | Forecasting |
| Phase 11 | 19 | Deploy + submit |
| **Total** | **186** | |
