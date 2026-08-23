import sys
from pathlib import Path
sys.path.append("apps/api")

from db import supabase
from services.matcher import match_text

matches = match_text("muslims are terrorists", threshold=0.0)
for m in matches:
    print(f"{m.similarity_score:.4f} - {m.narrative_name}")
