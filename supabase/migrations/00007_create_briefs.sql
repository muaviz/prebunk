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
