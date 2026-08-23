import os

routers_to_fix = ["apps/api/routers/narratives.py", "apps/api/routers/alerts.py", "apps/api/routers/tips.py", "apps/api/routers/briefs.py"]

for router_file in routers_to_fix:
    if not os.path.exists(router_file):
        continue
    with open(router_file, "r") as f:
        content = f.read()
    
    # We'll just replace the simple GET / function defs
    # def list_x(): -> def list_x(limit: int = 50, offset: int = 0):
    import re
    # Find def list_(something)():
    content = re.sub(r'def list_([a-zA-Z0-9_]+)\(\):', r'def list_\1(limit: int = 50, offset: int = 0):', content)
    # Also find where .select("*").execute() happens in the list function and replace
    # We can do this manually for each to be safe.
    
