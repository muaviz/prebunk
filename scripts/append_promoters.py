import json

new_links = {
  "CLM-001": [
    {"name": "KesariDhwaj on X", "url": "https://x.com/KesariDhwaj/status/1716162507533128061", "platform": "twitter"}
  ],
  "CLM-004": [
    {"name": "Reddit /r/exmuslim Discussion", "url": "https://www.reddit.com/r/exmuslim/comments/1khocs3/maybe_instead_of_asking_why_are_muslims_always/", "platform": "reddit"}
  ],
  "CLM-009": [
    {"name": "Reddit /r/exmuslim Thread", "url": "https://www.reddit.com/r/exmuslim/comments/1l74hce/islam_in_europe_and_its_consequences/", "platform": "reddit"},
    {"name": "Geert Wilders PVV on X", "url": "https://x.com/geertwilderspvv/status/1568839354772033536", "platform": "twitter"},
    {"name": "Charlie Weimers on X", "url": "https://x.com/weimers/status/2038992151715996027", "platform": "twitter"},
    {"name": "Derrick Evans on X", "url": "https://x.com/DerrickEvans4WV/status/2091308353641148779", "platform": "twitter"}
  ]
}

with open('data/claims.json', 'r') as f:
    claims = json.load(f)

for c in claims:
    if c['id'] in new_links:
        for link in new_links[c['id']]:
            if link not in c.get('promoter_links', []):
                c.setdefault('promoter_links', []).append(link)

with open('data/claims.json', 'w') as f:
    json.dump(claims, f, indent=2)

print("Appended new links to data/claims.json")
