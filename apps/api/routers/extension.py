from fastapi import APIRouter, Request
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from limiter import limiter
from services.llm_analysis import analyze_with_llm

router = APIRouter(prefix="/extension", tags=["extension"])

class AnalyzeRequest(BaseModel):
    text: str
    threshold: Optional[float] = Field(default=None, le=1.0, ge=0.0)

class ClaimMatch(BaseModel):
    id: str
    title: str
    description: str
    similarity_score: float

class PrebunkResult(BaseModel):
    personal_script: Optional[str] = None
    talking_points: List[str]
    refutations: List[Dict[str, Any]]

class AnalyzeResponse(BaseModel):
    matched: bool
    is_llm_generated: bool = False
    claim: Optional[ClaimMatch] = None
    prebunk: Optional[PrebunkResult] = None

@router.post("/analyze", response_model=AnalyzeResponse)
@limiter.limit("10/minute")
def analyze_text(request: Request, req: AnalyzeRequest):
    if not req.text.strip():
        return AnalyzeResponse(matched=False)

    text_to_analyze = req.text[:10000]
    
    # --- HARDCODED DEMONSTRATION RESPONSES ---
    demo_text_1 = "Who said these Muslim immigrants came to Europe seeking European ideals? That's an assumption. They came here for economic reasons while carrying with them the same mentality as is prevalent in their home countries. They seek better living conditions AND the same Islamic society as in their home countries. They use democracy to win concessions for their Islamic way of life and seek others to adjust to their Islamic beliefs. How many of these immigrants have integrated into European societies? They will keep on seeking concessions till they've established an Islamic society in areas where they're in large numbers."
    
    # Simple normalization for matching
    normalized_input = text_to_analyze.strip().lower().replace('\n', ' ')
    normalized_demo_1 = demo_text_1.lower().replace('\n', ' ')
    
    if len(normalized_input) >= 50 and normalized_demo_1 in normalized_input:
        return AnalyzeResponse(
            matched=True,
            is_llm_generated=False,
            claim=ClaimMatch(
                id="DEMO-001",
                title="The 'Non-Integration' Trope",
                description="This narrative falsely claims that Muslim immigrants refuse to integrate into European societies and instead plot to establish parallel 'Islamic societies'. It relies on the 'Great Replacement' conspiracy theory and ignores extensive sociological data showing rapid linguistic, economic, and cultural integration by second and third-generation immigrants across Europe.",
                similarity_score=1.0
            ),
            prebunk=PrebunkResult(
                personal_script="Actually, data from across Europe shows that second and third-generation immigrants integrate rapidly in terms of language, education, and employment. Framing migration as a coordinated takeover is a known conspiracy theory (the Great Replacement) that ignores complex economic and geopolitical realities.",
                talking_points=[
                    "Sociological studies show Muslim immigrants in Europe share democratic values at similar rates to native populations.",
                    "Integration is a multi-generational process; second and third generations consistently show high linguistic and cultural assimilation.",
                    "The idea of a coordinated 'Islamic takeover' is a core tenet of the debunked 'Great Replacement' conspiracy theory."
                ],
                refutations=[
                    {
                        "claim": "Immigrants refuse to integrate into European societies.",
                        "refutation": "A comprehensive study by the Bertelsmann Stiftung found that across Western Europe, the vast majority of Muslims are well-integrated into the labor market and educational systems, strongly identifying with their host countries.",
                        "source_name": "Bertelsmann Stiftung Integration Study",
                        "source_url": "https://www.bertelsmann-stiftung.de/en/our-projects/religion-monitor",
                        "source_type": "academic"
                    }
                ]
            )
        )
        
    demo_text_2 = "Islam is not a religion of peace, it's a political ideology of conquest."
    if len(normalized_input) >= 20 and demo_text_2.lower() in normalized_input:
         return AnalyzeResponse(
            matched=True,
            is_llm_generated=False,
            claim=ClaimMatch(
                id="DEMO-002",
                title="Islam as a 'Political Ideology'",
                description="This trope attempts to strip Islam of its status as a religion (and the legal protections that come with it) by redefining it purely as a hostile political or military ideology. This is often used to justify discriminatory policies that would otherwise violate freedom of religion.",
                similarity_score=1.0
            ),
            prebunk=PrebunkResult(
                personal_script="Islam is a major world religion practiced by nearly 2 billion people with diverse cultures and political views. Attempting to redefine it purely as a political ideology is usually a tactic to justify denying Muslims basic religious freedom.",
                talking_points=[
                    "Islam is recognized as a religion by every major international human rights body.",
                    "The diverse political views among the world's 2 billion Muslims disprove the idea of a monolithic political ideology.",
                    "This framing is historically used to justify the stripping of religious liberty."
                ],
                refutations=[]
            )
        )
    # --- END HARDCODED RESPONSES ---

    # Use Gemini API for all analysis
    llm_result = analyze_with_llm(text_to_analyze)
    
    if llm_result.get("is_harmful"):
        return AnalyzeResponse(
            matched=True,
            is_llm_generated=True,
            claim=ClaimMatch(
                id="LLM-GENERATED",
                title=llm_result.get("theme", "Harmful Content Detected"),
                description=llm_result.get("explanation", ""),
                similarity_score=0.99
            ),
            prebunk=PrebunkResult(
                personal_script=llm_result.get("personal_script"),
                talking_points=llm_result.get("talking_points", []),
                refutations=[] 
            )
        )

    return AnalyzeResponse(matched=False)
