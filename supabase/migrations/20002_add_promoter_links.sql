ALTER TABLE claims ADD COLUMN promoter_links JSONB DEFAULT '[]'::jsonb;
