with open("apps/api/main.py", "r") as f:
    content = f.read()

content = content.replace(", tips", "")
content = content.replace("app.include_router(tips.router)\n", "")

with open("apps/api/main.py", "w") as f:
    f.write(content)
