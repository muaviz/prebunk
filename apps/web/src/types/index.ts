export interface Narrative {
  id: string;
  name: string;
  description: string;
  cluster_id: string;
  technique_id: string;
  variants: string[];
  historical_origin?: string;
  propagation_path?: string;
  factual_refutations: Array<{ claim: string; refutation: string; source: string }>;
  inoculation_hook?: string;
  talking_points: string[];
  related_narrative_ids: string[];
  semantic_anchors: string[];
  active?: boolean;
  created_at: string;
}

export interface VrsScore {
  id: string;
  narrative_id: string;
  score: number;
  raw_volume: number;
  acceleration: number;
  cross_platform_count: number;
  computed_at: string;
}

export interface Brief {
  id: string;
  narrative_id: string;
  trigger_type: string;
  vrs_at_generation: number | null;
  title: string;
  content: {
    technique_explanation: string;
    narrative_context: string;
    talking_points: string[];
    personal_script: string;
    discussion_questions: string[];
    summary: string;
  };
  language: string;
  validation_outcome: string;
  version: number;
  created_at: string;
}

export interface NarrativeMatch {
  narrative_id: string;
  narrative_name: string;
  similarity_score: number;
}

export interface CommunityTip {
  id: string;
  submitted_by: string;
  description: string;
  source_url?: string;
  platform?: string;
  status: string;
  related_narrative_id?: string;
  created_at: string;
}
