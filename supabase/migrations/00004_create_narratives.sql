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
