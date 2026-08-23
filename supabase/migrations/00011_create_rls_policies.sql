ALTER TABLE clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE techniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE narratives ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE vrs_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE narrative_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read clusters" ON clusters FOR SELECT USING (true);
CREATE POLICY "Public read techniques" ON techniques FOR SELECT USING (true);
CREATE POLICY "Public read narratives" ON narratives FOR SELECT USING (true);

CREATE POLICY "Auth read briefs" ON briefs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth read vrs" ON vrs_scores FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Own subscriber read" ON subscribers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Own tips read" ON community_tips FOR SELECT USING (subscriber_id IN (SELECT id FROM subscribers WHERE user_id = auth.uid()));
CREATE POLICY "Auth read alerts" ON alerts FOR SELECT USING (auth.role() = 'authenticated');
