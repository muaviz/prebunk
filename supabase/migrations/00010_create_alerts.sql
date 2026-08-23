CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  narrative_id TEXT NOT NULL REFERENCES narratives(id),
  alert_level TEXT NOT NULL CHECK (alert_level IN ('orange', 'red')),
  vrs_score FLOAT NOT NULL,
  brief_id UUID REFERENCES briefs(id),
  subscribers_notified INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
