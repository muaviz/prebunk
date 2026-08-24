# 🛡️ Prebunk

> A weather radar for Islamophobia. Predict, prebunk, and prepare.

**Prebunk** is a narrative intelligence platform designed to track, analyze, and neutralize emerging anti-Muslim claims, conspiracy theories, and hate speech online *before* they go viral. Using social science-backed inoculation theory, it equips users with factual refutations and ready-to-use scripts to counter hate speech.

---

## 🏗️ Architecture

Prebunk is built as a monorepo with three core components:

1. **Dashboard (`apps/web`)**: A Next.js 14 frontend using Tailwind CSS for tracking and exploring the threat database.
2. **Analysis Engine (`apps/api`)**: A FastAPI Python backend powered by Gemini 2.5 Flash for real-time narrative analysis and text classification.
3. **Browser Extension (`apps/extension`)**: A lightweight Chrome extension that allows users to highlight and "prebunk" suspicious text on any webpage.
4. **Database (`supabase/`)**: PostgreSQL backend for storing claims, promoter sightings, and computed embeddings.

---

## 🧩 Installing the Browser Extension

The Prebunk browser extension is the primary way users interact with the platform in the wild. Since it is currently in beta, you must install it locally:

1. Open your Chromium-based browser (Chrome, Edge, Brave, etc.).
2. Navigate to `chrome://extensions/` in your URL bar.
3. Toggle **"Developer mode"** ON in the top right corner.
4. Click the **"Load unpacked"** button in the top left.
5. Select the `apps/extension` folder inside this repository.
6. **Important:** Click the newly added Prebunk extension icon in your browser toolbar to open its popup, and ensure the API URL is pointing to your live backend (or `http://127.0.0.1:8000` if running locally).

Now, you can highlight any text on any website, right-click, and select **"Prebunk this text"** to get a real-time factual analysis!

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org) (v20+)
- [pnpm](https://pnpm.io) (v11+)
- [Python](https://www.python.org) (3.11+)
- A [Supabase](https://supabase.com) account & [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### 1. Clone & Install
Because Prebunk is a monorepo, you can install all Node.js dependencies from the root:
```bash
git clone https://github.com/muaviz/prebunk.git && cd prebunk

# Install Next.js frontend dependencies
pnpm install

# Install Python API dependencies
cd apps/api
pip install -r requirements.txt
```

### 2. Configure Environment Variables
Copy the root example environment file:
```bash
cp .env.example .env
```
Fill in your `.env` file with your specific credentials:
- `SUPABASE_URL` & `SUPABASE_SERVICE_ROLE_KEY` (from your Supabase project settings)
- `GEMINI_API_KEY` (from Google AI Studio)
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Initialize the Database
Once your Supabase project is active, seed the database with the baseline threat claims:
```bash
cd apps/api
python -m scripts.seed_claims
```

### 4. Run the Stack
You can easily spin up the API via Docker, or run everything manually:

**Option A: Using Docker (Recommended for API)**
```bash
docker-compose up -d
cd apps/web && pnpm dev
```

**Option B: Manual Startup**
```bash
# Terminal 1: Start the API
cd apps/api
uvicorn main:app --reload

# Terminal 2: Start the Web Dashboard
pnpm dev:web
```

---

## 🧪 Testing

The FastAPI backend includes a suite of Pytest tests to verify rate limiting, prompt injection boundaries, and routing logic.
```bash
cd apps/api
pytest
```

## 📄 License
This project is licensed under the MIT License.
