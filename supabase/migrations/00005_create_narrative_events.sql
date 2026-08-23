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
