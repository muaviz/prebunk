import os
from jinja2 import Environment, FileSystemLoader
from db import supabase
from services.brief_generator import generate_brief

env = Environment(loader=FileSystemLoader(os.path.join(os.path.dirname(__file__), '..', 'templates')))

def get_top_narratives():
    # Fetch top 3 narratives by recent VRS score
    # Fetch latest scores for all narratives (Supabase limits to 1000 by default, enough for demo)
    res = supabase.table("vrs_scores").select("narrative_id, score").order("computed_at", desc=True).execute()
    
    if not res.data:
        return []
        
    latest_scores = {}
    for r in res.data:
        nid = r["narrative_id"]
        if nid not in latest_scores:
            latest_scores[nid] = r["score"]
            
    sorted_scores = sorted(latest_scores.items(), key=lambda x: x[1], reverse=True)[:3]
    top_ids = [s[0] for s in sorted_scores]
    
    narratives = []
    for nid in top_ids:
        n_res = supabase.table("narratives").select("*").eq("id", nid).execute()
        if n_res.data:
            n = n_res.data[0]
            n['vrs_score'] = latest_scores[nid]
            narratives.append(n)
            
    return narratives

def build_weekly_digest():
    top_narratives = get_top_narratives()
    if not top_narratives:
        return None, None
        
    # Get or generate brief for #1 narrative
    top_n = top_narratives[0]
    
    brief_res = supabase.table("briefs").select("*").eq("narrative_id", top_n["id"]).order("created_at", desc=True).limit(1).execute()
    
    if brief_res.data:
        brief = brief_res.data[0]
    else:
        try:
            brief_model = generate_brief(top_n["id"], "scheduled")
            # Ensure dict format
            brief = brief_model.model_dump() if hasattr(brief_model, "model_dump") else brief_model
        except Exception as e:
            print("Failed to generate brief via LLM, using fallback for digest:", e)
            brief = {
                "id": "mock-brief",
                "narrative_id": top_n["id"],
                "content": {
                    "personal_script": "This is a fallback script because the LLM quota is exhausted.",
                    "talking_points": ["Point 1", "Point 2"],
                    "technique_explanation": "A common disinformation technique.",
                    "narrative_context": "This narrative has been building recently."
                }
            }
    
    template = env.get_template("weekly_digest.html")
    from config import settings
    html = template.render(
        top_narratives=top_narratives,
        main_brief=brief,
        base_url=settings.frontend_base_url
    )
    
    subject = f"Prebunk Weekly Digest: {top_n['name']} is escalating"
    return subject, html
