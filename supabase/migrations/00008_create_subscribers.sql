CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  org_name TEXT NOT NULL,
  org_type TEXT NOT NULL,
  country TEXT,
  language_preference TEXT DEFAULT 'en',
  tier TEXT DEFAULT 'individual' CHECK (tier IN ('individual', 'organization', 'research')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  focus_clusters TEXT[] DEFAULT '{}',
  delivery_frequency TEXT DEFAULT 'weekly' CHECK (delivery_frequency IN ('weekly', 'realtime')),
  contact_email TEXT NOT NULL,
  team_size INT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_subscribers_user_id ON subscribers(user_id);
