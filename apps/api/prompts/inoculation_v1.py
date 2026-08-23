def build_inoculation_prompt(narrative_name: str, technique_name: str, technique_desc: str, refutations: list) -> str:
    """
    Builds the 3-step prompt for generating an inoculation brief, as defined in report.md 10.3.
    """
    # Format the refutations nicely
    ref_text = "\n".join([f"- Claim: {r['claim']}\n  Refutation: {r['refutation']}\n  Source: {r['source']}" for r in refutations])
    
    return f"""You are an educator writing for a Muslim community organization coordinator.
A narrative is circulating online that uses the "{technique_name}" manipulation technique
({technique_desc}) applied to claims about {narrative_name}.

Please follow this exact three-step structure to generate an inoculation brief:

**Step 1 — Technique Explanation:**
Write a clear, 2-paragraph explanation of what "{technique_name}" is as a manipulation
technique, using examples that do NOT reference Islam — use general examples first,
then apply the concept to the {narrative_name} context.
The explanation should be:
- Written at a reading level accessible to a non-specialist adult
- Non-inflammatory and calm in tone
- Focused on the technique, not on attacking the people who share the content

**Step 2 — Narrative Context:**
Using the following documented facts:
{ref_text}

Write 3 paragraphs explaining what the "{narrative_name}" narrative claims, where it originated,
and why the claims are factually incorrect.
Ground every factual claim in the provided source material. Do not introduce any
information not present in the source material. Use plain language.

**Step 3 — Talking Points and Action:**
Based on the explanation above, generate:
1. Three talking point cards (max 30 words each) that a community coordinator could
   post on social media, share in a WhatsApp group, or use in a conversation.
   Tone: calm, factual, direct. Not combative.
2. One "what to say at work/family dinner" script — a 4–6 sentence response someone
   could use when they hear this narrative from a colleague or family member.
3. Two discussion questions for a community meeting or classroom setting.

Output your response using the following JSON schema strictly:
{{
  "technique_explanation": "string (Step 1)",
  "narrative_context": "string (Step 2)",
  "talking_points": ["string", "string", "string"],
  "personal_script": "string",
  "discussion_questions": ["string", "string"],
  "summary": "string (a brief 2-sentence summary of the whole brief)"
}}
Ensure the output is ONLY valid JSON, with no markdown code blocks wrapping it.
"""
