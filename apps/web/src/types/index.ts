export interface Refutation {
  claim: string;
  refutation: string;
  source_name: string;
  source_url: string;
  source_type: "wikipedia" | "quran" | "hadith" | "academic" | "islamqa" | "factcheck" | "news";
}

export interface PromoterLink {
  name: string;
  url: string;
  platform: string;
}

export interface Claim {
  id: string;
  title: string;
  claim_text: string;
  description: string;
  category: string;
  virality_score: number;
  is_featured: boolean;
  refutations: Refutation[];
  promoter_links: PromoterLink[];
  talking_points: string[];
  personal_script?: string;
  semantic_anchors: string[];
  created_at: string;
}
