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
