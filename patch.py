with open("apps/api/main.py", "r") as f:
    content = f.read()

content = content.replace(
    "from routers import narratives, vrs, briefs, subscribers, tips, ingest, newsletter",
    "from routers import narratives, vrs, briefs, subscribers, tips, ingest, newsletter, extension"
)
content = content.replace(
    "app.include_router(newsletter.router)",
    "app.include_router(newsletter.router)\napp.include_router(extension.router)"
)
content = content.replace(
    "allow_origins=origins,",
    "allow_origins=origins,\n    allow_origin_regex=r\"chrome-extension://.*\",\n"
)

with open("apps/api/main.py", "w") as f:
    f.write(content)
