import json

promoter_data = {
  "CLM-001": [
    {"name": "Fox News: 'The great replacement is an electoral strategy'", "url": "https://www.foxnews.com/opinion/tucker-carlson-the-great-replacement-is-an-electoral-strategy", "platform": "news"},
    {"name": "Renaud Camus (Creator of the theory)", "url": "https://x.com/RenaudCamus", "platform": "twitter"}
  ],
  "CLM-002": [
    {"name": "Breitbart: Understanding Taqiyya", "url": "https://www.breitbart.com/national-security/2015/12/26/understanding-taqiyya-islamic-principle-lying-sake-allah/", "platform": "news"},
    {"name": "Center for Security Policy: Muslim Brotherhood's Taqiyya", "url": "https://centerforsecuritypolicy.org/the-muslim-brotherhoods-taqiyya-in-action/", "platform": "website"}
  ],
  "CLM-003": [
    {"name": "ACT for America: Stop Sharia Now", "url": "https://www.actforamerica.org/sharia", "platform": "website"},
    {"name": "Gatestone Institute: Sharia Law in America", "url": "https://www.gatestoneinstitute.org/9963/sharia-law-america", "platform": "news"}
  ],
  "CLM-004": [
    {"name": "Jihad Watch: Islam and Terrorism", "url": "https://www.jihadwatch.org/", "platform": "website"},
    {"name": "Pamela Geller: The Geller Report", "url": "https://pamelageller.com/", "platform": "website"}
  ],
  "CLM-005": [
    {"name": "OpIndia: 'Love Jihad' Coverage", "url": "https://www.opindia.com/latest-news/love-jihad/", "platform": "news"},
    {"name": "Sudarshan News TV", "url": "https://x.com/SudarshanNewsTV", "platform": "twitter"}
  ],
  "CLM-006": [
    {"name": "Middle East Forum: Halal Certification Racket", "url": "https://www.meforum.org/61587/the-halal-certification-racket", "platform": "news"},
    {"name": "Boycott Halal Australia", "url": "https://www.facebook.com/BoycottHalalAustralia/", "platform": "facebook"}
  ],
  "CLM-007": [
    {"name": "Answering Islam: The Muslim Jesus", "url": "https://www.answering-islam.org/", "platform": "website"}
  ],
  "CLM-008": [
    {"name": "The Religion of Peace: Spread by the Sword", "url": "https://www.thereligionofpeace.com/pages/articles/spread-by-sword.aspx", "platform": "website"}
  ],
  "CLM-009": [
    {"name": "Breitbart Europe: Migrant Invasion", "url": "https://www.breitbart.com/europe/2016/01/29/migrant-invasion-as-a-weapon-of-mass-destruction/", "platform": "news"},
    {"name": "Nigel Farage: Stop the Boats", "url": "https://x.com/Nigel_Farage", "platform": "twitter"}
  ],
  "CLM-010": [
    {"name": "Spiked Online: The invention of Islamophobia", "url": "https://www.spiked-online.com/2021/11/24/the-invention-of-islamophobia/", "platform": "news"},
    {"name": "National Review: A Term Designed to Silence Criticism", "url": "https://www.nationalreview.com/2019/04/islamophobia-a-term-designed-to-silence-criticism-of-islam/", "platform": "news"}
  ],
  "CLM-011": [
    {"name": "FrontPage Magazine: The War on Women in Islam", "url": "https://www.frontpagemag.com/the-war-on-women-in-islam/", "platform": "news"}
  ],
  "CLM-012": [
    {"name": "GB News: Suella Braverman on Grooming Gangs", "url": "https://www.gbnews.com/politics/suella-braverman-grooming-gangs", "platform": "news"},
    {"name": "Tommy Robinson Updates", "url": "https://x.com/TRobinsonNewEra", "platform": "twitter"}
  ],
  "CLM-013": [
    {"name": "Britain First: Campaign against Halal", "url": "https://www.britainfirst.org/campaigns", "platform": "website"}
  ],
  "CLM-014": [
    {"name": "Fox News: Steve Emerson on 'No-Go Zones' (Transcript)", "url": "https://www.foxnews.com/transcript/steve-emerson-fox-news-apologize-for-error-on-muslims-in-europe", "platform": "news"},
    {"name": "Gatestone Institute: France's No-Go Zones", "url": "https://www.gatestoneinstitute.org/5128/france-no-go-zones", "platform": "news"}
  ],
  "CLM-015": [
    {"name": "The Religion of Peace: Child Marriage", "url": "https://www.thereligionofpeace.com/pages/quran/pedophilia.aspx", "platform": "website"}
  ]
}

with open('data/claims.json', 'r') as f:
    claims = json.load(f)

for c in claims:
    if c['id'] in promoter_data:
        c['promoter_links'] = promoter_data[c['id']]

with open('data/claims.json', 'w') as f:
    json.dump(claims, f, indent=2)

print("Updated data/claims.json")
