import sys
from pathlib import Path

api_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(api_dir))

from services.llm import generate_brief_content

def test():
    print("Testing Brief Generation via Gemini...")
    content = generate_brief_content(
        narrative_name="Fake Crime Stats",
        technique_name="Statistical manipulation",
        technique_desc="Misrepresenting or fabricating data to create fear.",
        refutations=[
            {
                "claim": "Muslim immigrants are responsible for a crime wave.",
                "refutation": "Studies consistently show immigrants commit crimes at lower rates than native-born citizens.",
                "source": "Various Criminology Studies"
            }
        ]
    )
    print("Generation complete!")
    print(content)

if __name__ == "__main__":
    test()
