import sys
from pathlib import Path

api_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(api_dir))

from services.matcher import match_text

def test_matcher():
    text1 = "Muslims are replacing the white population through immigration"
    results1 = match_text(text1)
    print(f"Test 1: '{text1}'")
    for r in results1[:3]:
        print(f"  {r.narrative_name}: {r.similarity_score:.3f}")
        
    print()
    text2 = "The weather forecast for tomorrow is sunny"
    results2 = match_text(text2)
    print(f"Test 2: '{text2}'")
    print(f"  Matches: {len(results2)}")

if __name__ == "__main__":
    test_matcher()
