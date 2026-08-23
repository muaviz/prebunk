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
