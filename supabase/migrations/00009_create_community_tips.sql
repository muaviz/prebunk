CREATE TABLE community_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID REFERENCES subscribers(id),
  description TEXT NOT NULL,
  matched_narrative_id TEXT REFERENCES narratives(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'confirmed', 'rejected')),
  reviewer_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
