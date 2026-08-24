# Prebunk — Narrative Intelligence Against Anti-Muslim Hate

> A weather radar for Islamophobia. Predict, pre-bunk, and prepare.

## 🏗️ Architecture
Browser Extension → FastAPI API (SBERT + Gemini) → Supabase DB ← Next.js Dashboard

## 🚀 Quick Start

### Prerequisites
- Node.js 20+, pnpm 11+
- Python 3.11+
- Supabase account (or local Supabase CLI)

### 1. Clone & Install
```bash
git clone https://github.com/muaviz/prebunk.git && cd prebunk
cd apps/web && pnpm install
cd ../api && pip install -r requirements.txt
```

### 2. Environment Variables
```bash
cp apps/api/.env.example .env
# Fill in: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY
```

### 3. Seed Database
```bash
cd apps/api && python -m scripts.seed_claims
python -m scripts.compute_embeddings
```

### 4. Run
```bash
# Terminal 1: API
cd apps/api && uvicorn main:app --reload
# Terminal 2: Web
cd apps/web && pnpm dev
```

### 5. Extension
- Open `chrome://extensions`
- Enable Developer Mode
- Load unpacked → select `apps/extension/`

## 🤝 Contributing
Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

## 📄 License
MIT License
