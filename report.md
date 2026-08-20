# Prebunk

## A Narrative Forecast and Inoculation System for Anti-Muslim Hate

### Full Design Report — The Harvest Anti-Muslim Hate Hackathon 2026

---

> *"The best time to counter a lie is before anyone believes it."*
> — Sander van der Linden, Cambridge Social Decision-Making Lab

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [The Problem with How We Fight Islamophobia Online](#2-the-problem)
3. [The Science: Why Inoculation Beats Detection](#3-the-science)
4. [What Prebunk Is](#4-what-prebunk-is)
5. [Core Features](#5-core-features)
6. [System Architecture](#6-system-architecture)
7. [How It Works: Start to Finish](#7-how-it-works-start-to-finish)
8. [Data Sources and Ingestion](#8-data-sources-and-ingestion)
9. [The Narrative Taxonomy: Prebunk's Knowledge Base](#9-the-narrative-taxonomy)
10. [The Inoculation Content Pipeline](#10-the-inoculation-content-pipeline)
11. [Delivery System and Subscriber Network](#11-delivery-system-and-subscriber-network)
12. [The Organizational Dashboard](#12-the-organizational-dashboard)
13. [Ethical Framework and Safeguards](#13-ethical-framework-and-safeguards)
14. [48-Hour Hackathon Build Plan](#14-48-hour-hackathon-build-plan)
15. [Scoring Against the Judging Criteria](#15-scoring-against-the-judging-criteria)
16. [Post-Hackathon Roadmap](#16-post-hackathon-roadmap)
17. [Improvements and Extensions](#17-improvements-and-extensions)

---

## 1. Executive Summary

Prebunk is a narrative early-warning and inoculation platform that monitors the velocity of anti-Muslim hate narratives across public social media and news, forecasts which narratives are likely to go viral in the next 48–72 hours, and automatically generates battle-tested educational content — delivered to Muslim organizations, educators, and community coordinators *before* those narratives peak.

The name is deliberate. Pre-bunking (proactive inoculation) is not a buzzword. It is a peer-reviewed behavioral science intervention, published in *Nature*, *Science*, and the *Journal of Experimental Psychology*, that has been shown to be three to seven times more effective than retroactive fact-checking at reducing the spread of misinformation.

Prebunk applies that science — for the first time — specifically to Islamophobic narratives at a systematic, organizational scale.

**In one sentence:** Prebunk gives Muslim communities the same threat intelligence infrastructure that cybersecurity teams use to defend against coordinated attacks — a radar, not a fire extinguisher.

---

## 2. The Problem

### 2.1 The Structural Failure of Reactive Tools

Every existing tool designed to combat online Islamophobia operates reactively. A slur is reported. A post is reviewed, sometimes removed — usually days later, after hundreds of thousands of views. A browser extension flags a piece of text that someone has already read. A fact-check article is published about a claim that has already been shared three million times.

This is not a failure of effort or resources. It is a structural flaw in the model. Reactive tools treat hate as weather — something that happens to you and that you clean up afterward. But the hackathon's own framing exposes the truth: *"Online hate is organized. The response isn't organized at all."*

Organized disinformation campaigns about Muslims do not appear spontaneously. They are engineered. Specific narratives are test-piloted in low-visibility spaces, amplified through coordinated networks, seeded into mainstream media, and only then — when they have already saturated the information environment — become visible enough for any reactive tool to catch.

By the time a browser extension flags something, the work of that campaign is already done.

### 2.2 The False Belief Bottleneck

The more fundamental problem is cognitive. Once a person encounters and partially believes a piece of misinformation, correcting it requires changing a formed belief. That process is:

- **Hard:** People experience corrections as attacks on their identity, particularly when the belief aligns with existing worldview.
- **Inefficient:** Corrections often backfire, strengthening the original belief through the backfire effect.
- **Incomplete:** Even when corrections succeed, a residual "illusory truth effect" remains — the corrected information lingers as faintly more plausible than it should be, simply because of exposure.

Retroactive fact-checking is not useless, but its impact ceiling is structurally low for the reasons above. The academic and policy community has known this for over a decade. The counter-misinformation field is actively moving toward pre-bunking. Prebunk applies that shift specifically to Islamophobia.

### 2.3 The Coordination Gap

Muslim organizations — mosques, advocacy groups, student associations, civil society groups — are the primary institutional defenders of Muslim communities. They are also, almost universally, under-resourced and informationally isolated from each other.

When a coordinated harassment campaign targets a Muslim figure or community, each affected organization experiences it in isolation. They lack:

- Any early warning that a campaign is building.
- Any shared language or framework to respond to the specific narrative being deployed.
- Any pre-prepared educational materials that can be activated quickly.
- Any visibility into whether the attack is coordinated or organic (which determines the appropriate response entirely).

Prebunk closes this gap by acting as a shared intelligence layer across the Muslim organizational ecosystem.

---

## 3. The Science: Why Inoculation Beats Detection

### 3.1 Inoculation Theory

Inoculation theory was first formalized by psychologist William McGuire in 1961, drawing a direct analogy to medical vaccination. The core claim: exposing people to a weakened form of a manipulative argument — along with a refutation of that argument — builds psychological resistance to the full-strength version of that argument when they later encounter it.

The mechanism operates on two levels:

1. **Threat appraisal:** Understanding that a manipulation technique exists and is being used against you activates motivated reasoning and skepticism.
2. **Refutational preemption:** Having already encountered and rebutted a version of the argument provides a cognitive antibody — a rehearsed counter-position that can be activated on contact with the real thing.

### 3.2 The Empirical Record

Inoculation research has accelerated dramatically since 2017, driven largely by the scale of coordinated disinformation campaigns during electoral cycles. Key findings relevant to Prebunk:

- **van der Linden et al. (2017)** — *Global Warming's Six Americas*: A single inoculation message reduced the effect of a misleading petition by 6.5 percentage points — a significant effect for a one-time exposure.
- **Basol et al. (2020)** — *Bad News* game study: Active inoculation through gameplay produced resistance that generalized to novel (never-before-seen) misinformation. The key implication: inoculation teaches manipulation *techniques*, not just responses to specific claims.
- **Roozenbeek et al. (2022)** — *prebunking.withgoogle.com* deployment at scale: Google's Jigsaw unit deployed pre-bunking video ads on YouTube targeting manipulation techniques used in vaccine misinformation. A/B tested against more than 5 million users. Pre-bunking reduced susceptibility to novel misinformation by 5–10% in a single exposure. Effect persisted at 30-day follow-up.
- **Lewandowsky & van der Linden (2021)** — Meta-analysis across 90+ inoculation studies: Average effect size (Cohen's d) of 0.43 — comparable to some pharmaceutical interventions. Pre-bunking consistently outperforms debunking across study designs.

### 3.3 The Key Insight for Prebunk

The most important finding in the inoculation literature is that the most effective inoculation targets **manipulation techniques**, not **specific false claims**. Teaching someone to recognize the technique of "false equivalence" makes them resistant to all future arguments that use false equivalence — not just the specific one they were shown.

This means Prebunk does not need to predict the exact claim that will go viral. It needs to identify which **technique category** (conspiracy framing, dehumanization, scapegoating, manufactured consensus, etc.) is being activated in a rising narrative — and inoculate against the technique. This is both more robust and more scalable than claim-by-claim debunking.

---

## 4. What Prebunk Is

Prebunk is three things simultaneously:

### 4.1 A Narrative Radar

Prebunk continuously monitors public social media (Twitter/X, Reddit, Facebook public pages, Telegram public channels, YouTube comment sections) and news aggregators for content matching a curated taxonomy of anti-Muslim narratives. It tracks not just presence but **velocity** — how fast a narrative is spreading, from where, and toward which audiences.

The output is a living dashboard of narrative activity, updated every few hours, with trend lines, origin mapping, and spread velocity scores for each tracked narrative type.

### 4.2 A Forecast Engine

Using velocity trajectory, platform behavior patterns, historical spread data, and contextual signals (news events, political cycles, international incidents that historically trigger specific narrative clusters), Prebunk's forecast engine estimates which narratives are likely to cross a virality threshold in the next 48–72 hours.

This is the weather radar metaphor made explicit: meteorologists do not predict weather by looking for rain already falling. They model atmospheric conditions. Prebunk models the informational atmosphere.

### 4.3 An Inoculation Content Factory

When a narrative is identified as trending or forecast to escalate, Prebunk automatically generates a complete inoculation brief for that narrative: what it claims, what technique it uses, why it is wrong (with citations), and exactly how to talk about it with different audiences. This content is pre-tested for clarity, accuracy, and rhetorical effectiveness.

Briefs are delivered to subscribers — Muslim organizations, educators, community leaders — before the narrative peaks.

---

## 5. Core Features

### 5.1 The Weekly Islamophobia Forecast (Flagship Feature)

Every Monday morning, Prebunk sends a curated "Narrative Weather Report" to subscriber organizations. Format:

- **Top 3 narratives gaining velocity this week** with spread data
- **Predicted breakout** — the one narrative most likely to go mainstream in the next 7 days
- **Ready-to-use inoculation content** for each: a 3-paragraph explainer, a social media thread template, a classroom discussion guide
- **Talking point cards** — short, shareable graphics with key counter-messages

This is the primary deliverable for the hackathon demonstration. It is tangible, demonstrable, and immediately useful to real organizations.

### 5.2 Real-Time Narrative Dashboard

A web dashboard accessible to registered organizations showing:

- Live narrative velocity tracker (all monitored narrative categories)
- Platform breakdown (where is it spreading — Twitter, Reddit, news comment sections, etc.)
- Geographic distribution (which countries, which language communities)
- Historical trend lines (is this narrative new or resurging?)
- Alert threshold indicators (green / amber / red based on velocity)

Color-coded by urgency. Filterable by narrative category, platform, geography, and time range.

### 5.3 On-Demand Prebunk Generator

Input any URL, piece of text, or narrative description. Prebunk identifies which category of anti-Muslim narrative it matches (or closest match), explains the manipulation technique being used, and generates a full inoculation brief on demand.

This is useful for:

- A journalist who has received a press release containing a narrative and needs context fast
- A teacher who has encountered a claim from a student and needs to address it in class
- A community leader preparing to speak at an event where they know the topic will arise

### 5.4 The Narrative Taxonomy Browser (Public-Facing)

A searchable, browsable, fully public database of documented anti-Muslim narratives — their names, descriptions, historical origins, technique categories, and example instances (all synthetic/redacted). This is the open knowledge base underlying everything else.

This is a standalone artifact of significant value to researchers, educators, and advocates entirely separate from the platform. It should be open-source, licensed under Creative Commons, and actively maintained.

### 5.5 Inoculation Brief Archive

Every generated brief is archived and searchable. Organizations can search by narrative type, date, platform, or topic to find relevant past materials. This builds into a growing library of educational content over time — a compounding asset.

### 5.6 Educator Portal

A simplified interface for teachers, youth workers, and campus educators with:

- Age-appropriate (secondary school / university) versions of inoculation briefs
- Lesson plan templates built around specific narrative case studies
- Discussion question packs
- Student-facing "manipulation technique" explainer cards

### 5.7 Subscriber Network Management

Organizations register and configure their preferences:

- Which narrative categories to prioritize (e.g., a mosque may prioritize local/violence-adjacent narratives; a university group may prioritize academic-framing narratives)
- Delivery frequency (weekly digest / real-time alerts for red-level narratives)
- Language preference (the brief generation pipeline supports multilingual output from day one — Arabic, Urdu, Turkish, Somali, French, Bahasa Indonesia)
- Contact person and team size (briefs are calibrated for small volunteer teams vs. large organizations with comms staff)

### 5.8 Community Tip Line

Subscribers can submit narratives they are encountering in their communities — in local Facebook groups, WhatsApp chains, their workplace, their family. If multiple organizations flag the same pattern, it triggers an alert regardless of social media data. This captures the "dark social" spread that no public API can see.

### 5.9 Alert System

Red-level alerts (narratives crossing a defined velocity threshold or predicted for breakout) trigger:

- Push notification to registered organization contacts
- Emergency brief auto-generation and distribution
- Suggested response escalation path (which organizations to coordinate with, whether to involve platform trust & safety, whether the pattern suggests coordinated attack)

---

## 6. System Architecture

Prebunk has four distinct layers. Each is independently scalable.

```
┌────────────────────────────────────────────────────────────────┐
│                        INGESTION LAYER                         │
│  Twitter/X API  │  Reddit API  │  News RSS  │  Community Tips  │
└──────────────────────────────┬─────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────┐
│                       ANALYSIS LAYER                           │
│  Pattern Matcher  │  Velocity Engine  │  Forecast Model        │
│  (Taxonomy DB)    │  (trending score) │  (breakout prediction) │
└──────────────────────────────┬─────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────┐
│                    CONTENT GENERATION LAYER                    │
│  Claude API  →  Inoculation Brief Generator                    │
│  Brief Templates  │  Multilingual Output  │  Archive           │
└──────────────────────────────┬─────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────┐
│                       DELIVERY LAYER                           │
│  Email (weekly forecast)  │  Web Dashboard  │  API             │
│  Push alerts  │  Educator Portal  │  Public Taxonomy Browser   │
└────────────────────────────────────────────────────────────────┘
```

### 6.1 Ingestion Layer

**Responsibility:** Continuously collect public data from monitored sources, filter for Islamophobia-relevant content, and feed it into the analysis layer.

**Components:**

- **Twitter/X API v2 filtered stream:** Keyword and phrase filters drawn from the narrative taxonomy. Captures volume, retweet velocity, and account characteristics. Free tier provides 500,000 tweets/month filtered stream — sufficient for the hackathon. Production tier uses Academic Research access.
- **Reddit API (PRAW):** Monitors relevant subreddits (r/Islam, r/europe, r/worldnews, r/conspiracy, r/conservative and others identified in the taxonomy as high-propagation environments). Tracks upvote velocity and cross-post patterns.
- **RSS feed aggregator:** Monitors news outlets (mainstream and fringe) for Islamophobia-adjacent content. Parses headlines and article summaries. Does not scrape full articles (copyright compliance).
- **Community tip line:** A simple web form and email inbox where subscribers submit narratives they are encountering. These are manually reviewed (to prevent gaming) before entering the analysis pipeline.
- **Telegram public channel monitor:** Telegram has become a primary coordination environment for organized hate campaigns. Prebunk monitors specifically public channels using Telethon (Python Telegram client) — not private chats, never user data.

**Important constraint:** Prebunk ingests metadata and velocity signals, never stores raw hateful content. A post that triggers a pattern match is scored and discarded. Only the match type, velocity score, source platform, and timestamp are retained. This is critical for both privacy compliance and the hackathon's §6 safety requirements.

### 6.2 Analysis Layer

**Responsibility:** Match ingested signals against the narrative taxonomy, compute velocity scores, generate trend data, and produce breakout forecasts.

**Components:**

**Pattern Matcher:**
The core of the analysis layer is a semantic matching engine that compares incoming content against the Narrative Taxonomy (Section 9). This is not a hate speech classifier (which would require sending raw content to an AI and risk false positives). It is a semantic similarity engine using pre-computed sentence embeddings (SBERT — all-mpnet-base-v2, run locally via Python `sentence-transformers`). Incoming text is embedded and compared against the embedding centroids of each taxonomy category. A cosine similarity threshold determines whether a match is recorded.

This approach:

- Never sends content to a third-party AI API (§6 compliant)
- Has no false positive risk in the traditional sense (it does not accuse individuals)
- Produces a numeric similarity score rather than a binary classification
- Is transparent and auditable

**Velocity Engine:**
For each narrative category, the velocity engine computes:

- Raw volume (posts/hour mentioning this narrative category)
- Acceleration (is the volume increasing, flat, or declining?)
- Cross-platform spread (is it appearing on multiple platforms simultaneously?)
- Network concentration (is it spreading through one tight cluster or diffusing broadly?)

These four dimensions are combined into a single **Virality Risk Score (VRS)** from 0 to 100. Thresholds:

- 0–30: Monitor (green)
- 30–60: Watch (amber)
- 60–80: Alert (orange)
- 80–100: Critical (red)

**Forecast Model:**
A time-series model (Prophet — Facebook's open-source forecasting library) trained on historical VRS data to project 48–72 hour trajectories. Prophet handles the seasonality patterns characteristic of social media (weekend spikes, news cycle correlation, post-prayer-time discussion peaks in Muslim communities) out of the box.

At the hackathon stage, the forecast model uses the past 30 days of collected data for training. Post-hackathon, it is retrained weekly.

The forecast model is augmented with contextual signals:

- News events that historically correlate with specific narrative clusters (terrorist attacks → "all Muslims are terrorists" cluster; election cycles → "Muslim demographic threat" cluster; Ramadan → "Sharia law" cluster; international incidents → specific regional narratives)
- Day-of-week and time-of-day patterns
- Historical recurrence of specific narratives (some narratives are seasonal)

### 6.3 Content Generation Layer

**Responsibility:** Transform a pattern match and velocity signal into a complete, high-quality inoculation brief.

**Components:**

- **Brief Generator:** Claude API (claude-sonnet-4-6) with carefully engineered prompt templates (see Section 10 for full pipeline detail)
- **Template Library:** Pre-structured brief formats for different subscriber types (organization leader, teacher, social media coordinator, journalist)
- **Multilingual Output:** The brief is generated in English first, then translated using Claude's multilingual capability into the subscriber's preferred language
- **Quality Control:** Each generated brief is passed through a validation prompt that checks for: accuracy (claims grounded in the taxonomy knowledge base), tone (educational, not inflammatory), actionability (does it contain specific counter-talking points?), and accessibility (Flesch-Kincaid reading level ≤ 10)
- **Brief Archive:** Every generated brief is stored with its metadata (narrative category, VRS at time of generation, timestamp, delivery count) in a PostgreSQL database

### 6.4 Delivery Layer

**Responsibility:** Get the right content to the right people at the right time.

**Components:**

- **Email digest system:** Resend API (developer-friendly, $0 at hackathon scale) sends the weekly Narrative Weather Report to all subscribers every Monday at 8:00 AM in the subscriber's local timezone
- **Web dashboard:** Next.js frontend showing the real-time narrative radar and brief archive (see Section 12)
- **Push alerts:** For red/critical VRS events, a push notification is sent immediately via browser push API (no app required)
- **Public Taxonomy Browser:** A statically generated site (Next.js SSG) — no backend required, fully cacheable — exposing the narrative taxonomy as a searchable knowledge base
- **API:** A simple REST API allowing partner organizations to programmatically query the VRS for specific narrative categories and receive briefs — enabling integration with existing tools (Slack bots, internal dashboards, etc.)

---

## 7. How It Works: Start to Finish

This section traces four user journeys through the complete system.

### 7.1 Journey A: The Weekly Brief (Primary Use Case)

**Monday, 6:00 AM:** Prebunk's ingestion pipeline has been running for 7 days, continuously tracking narrative velocity across platforms. The analysis layer has computed VRS scores for all 47 categories in the taxonomy.

**6:00 AM:** The forecast model runs its weekly projection. It identifies three narratives with elevated VRS trajectories: "demographic replacement threat" (VRS 71, accelerating), "Muslim foreign allegiance" (VRS 58, stable), and "Sharia creep" (VRS 82, new breakout predicted).

**6:05 AM:** For each narrative, the brief generator is invoked. It pulls the narrative's taxonomy entry (description, technique category, historical context, documented refutations, talking point templates) and generates a complete inoculation brief for each. Quality control validates each brief.

**6:20 AM:** The weekly digest is compiled. It includes the three briefs, an executive summary of the week's narrative landscape, and a "predicted breakout" callout for the "Sharia creep" narrative.

**8:00 AM local time:** Each subscriber receives the digest in their timezone. A mosque coordinator in London, a student Islamic society president in Toronto, a Muslim advocacy organization in Jakarta, and a high school teacher in Sydney all receive the same narrative intelligence, adapted to their preferred format.

**8:15 AM:** The mosque coordinator opens the brief, reads the "Sharia creep" section, and posts the ready-to-use social media thread template to their organization's Facebook page. The thread reaches 800 followers before the narrative they are inoculating against has even gone viral.

**Wednesday:** The "Sharia creep" narrative goes viral following a news story about local planning laws. The mosque coordinator's followers have already seen a clear, calm explanation of the technique. Engagement on the viral posts from that community is noticeably different — more skeptical, less reactive, more informed.

### 7.2 Journey B: The On-Demand Brief (Journalist Use Case)

A journalist covering a local election receives a press release from a fringe political party. The release does not mention Islam explicitly, but describes "unvetted cultural imports" and "parallel legal systems replacing national law" in a way that triggers the journalist's concern.

She opens Prebunk's On-Demand Brief Generator, pastes the text, and clicks "Analyse."

Within 30 seconds, Prebunk returns:

- **Match:** "Sharia law" cluster, sub-category "parallel legal systems" narrative
- **Technique:** Manufacturing false equivalence between religious practice and legal system replacement
- **Historical origin:** Documented origin in specific US think-tank publications (2010–2014), subsequent adoption by European far-right political parties
- **Why it is wrong:** Three specific, cited refutations
- **What to watch for:** Related claims that often appear alongside this narrative
- **Suggested questions to ask the press release's authors:** Three specific follow-up questions that expose the narrative's internal contradictions

The journalist now has a documented brief she can use in her reporting or verify independently. She did not need to be an expert in Islamophobia to recognize what she was looking at.

### 7.3 Journey C: The Community Tip Line (Bottom-Up Signal)

A Prebunk subscriber — a Muslim student society at a university — starts noticing a specific meme circulating in their broader social circle. The meme depicts a fictional "Muslim crime statistics" graphic. It does not use any of the keywords the standard APIs would catch.

They submit the meme description and an example through the Prebunk community tip line. Within 24 hours, three other subscriber organizations submit descriptions of the same meme from completely different regions.

The pattern correlation triggers an internal alert. An analyst reviews the submissions (no raw content — only descriptions). They identify the match as the "manufactured statistics" narrative category (VRS currently 22 — below algorithmic radar). The manual confirmation causes a VRS override, elevating it to Watch status.

Prebunk sends an amber alert with an inoculation brief to all subscribers. The brief focuses specifically on the "manufactured statistics" technique — how to recognize fabricated data, how to find the actual sources, and how to respond to a family member who shares it.

This journey illustrates a critical design principle: Prebunk's radar is augmented by the community it serves. The people closest to the harm are also the most sensitive early detection instruments.

### 7.4 Journey D: The Educator (Teaching Use Case)

A secondary school teacher in Birmingham is preparing a unit on online critical thinking. She knows her students will encounter anti-Muslim content and wants to prepare them without exposing them to real hate content.

She logs into Prebunk's Educator Portal and searches for the "demographic threat" narrative category. The portal returns:

- A student-facing explainer (reading level Grade 8) explaining what the "replacement" narrative is and why it is historically inaccurate
- A classroom discussion guide with 8 discussion questions
- A "spot the technique" exercise using five synthetic (non-real, non-harmful) examples that demonstrate the technique
- Assessment rubric for evaluating student responses

The teacher builds a 90-minute lesson around these materials without having to expose her students to any real hateful content. At the end of the unit, students can identify the "demographic threat" framing technique in any new context — not just the examples they saw in class.

---

## 8. Data Sources and Ingestion

### 8.1 Public Social Media APIs

| Source | Method | Data Captured | Notes |
| --- | --- | --- | --- |
| Twitter/X | API v2 filtered stream | Volume, retweet counts, account age | Free tier: 500K tweets/month |
| Reddit | PRAW (Python) | Post score, comment velocity, subreddit | Rate limit: 60 requests/min |
| YouTube | Data API v3 | Comment volume on relevant videos | Free: 10,000 units/day |
| Telegram | Telethon | Post volume on public channels | Public channels only, no user data |

### 8.2 News Aggregators

RSS feeds from a curated list of 120 news sources spanning mainstream, community, and high-propagation fringe outlets. Headlines and summaries only (no full article scraping). Coverage includes international sources in Arabic, Urdu, French, Indonesian, and Turkish.

### 8.3 GNCI and Partner Organization Data

With consent, partner organizations share anonymized trend data from their own community monitoring. This is particularly valuable for capturing "dark social" spread — WhatsApp chains, private Facebook groups, local community networks — that no public API reaches.

### 8.4 Academic and Research Databases

The Narrative Taxonomy (Section 9) is grounded in published academic research. Key sources during construction:

- BRIDGE UK / Centre for the Analysis of the Radical Right (CARR)
- CAIR Islamophobia reports (2015–2025)
- UC Berkeley Haas Institute "Othering & Belonging" research
- Southern Poverty Law Center anti-Muslim hate group profiles
- Institute for Strategic Dialogue (ISD) narrative tracking reports
- Lena Mansour et al. anti-Muslim trope taxonomies
- Nathan Lean's *The Islamophobia Industry* (documented network origins)

### 8.5 What Prebunk Does NOT Store

Prebunk is designed by default to capture the minimum data necessary. It never stores:

- Individual posts or their text
- User IDs, handles, or any user-identifying information
- Images or media content
- Full articles or their content
- Any content submitted through the community tip line beyond a human-reviewed narrative description

The only persistent data are: narrative category match count, platform, timestamp, VRS score, and geographic region (country level). All other raw data is discarded after the pattern matching step.

---

## 9. The Narrative Taxonomy

The Narrative Taxonomy is Prebunk's knowledge base and its most significant standalone contribution. It is a structured, curated, fully documented database of recurring anti-Muslim narrative patterns.

### 9.1 Structure

Each taxonomy entry contains:

```
Narrative ID:         (unique identifier, e.g. NAR-042)
Name:                 (common name, e.g. "Sharia Replacement Threat")
Category:             (top-level cluster, e.g. "Legal System Threat")
Technique type:       (manipulation technique, e.g. "false equivalence")
Description:          (what the narrative claims, 2–3 sentences)
Variants:             (regional/linguistic variations of the same narrative)
Historical origin:    (documented origin, with citations)
Propagation path:     (how it typically spreads from fringe to mainstream)
Factual refutation:   (3–5 specific, cited counter-points)
Inoculation hook:     (the core technique to explain in a pre-bunk)
Talking point cards:  (3–5 ready-to-use short counter-messages)
Related narratives:   (other taxonomy entries that co-occur with this one)
Semantic anchors:     (phrases and patterns used for embedding matching)
Last reviewed:        (date of last accuracy review)
```

### 9.2 Top-Level Narrative Clusters

The taxonomy organizes narratives into seven top-level clusters, each representing a distinct type of anti-Muslim framing:

**Cluster 1: Demographic Threat**
The claim that Muslim populations are growing at a rate that will displace existing populations through birth rates, migration, or both. Variants include "Great Replacement," "Islamization of Europe," "demographic jihad." Technique: manufactured demographic panic using selectively interpreted statistics.

**Cluster 2: Legal System Threat**
The claim that Muslims intend to replace national law with Sharia law, or that Sharia law already operates as a parallel legal system in Muslim communities. Variants include "no-go zones," "Sharia courts," "Muslim patrols." Technique: false equivalence between religious practice and legal system replacement.

**Cluster 3: Violent Extremism Attribution**
The claim that violence committed by any Muslim individual or group is representative of Muslims collectively, or that Islam as a religion is uniquely linked to violence. Technique: collective attribution of individual actions combined with selective statistical framing.

**Cluster 4: Loyalty and Allegiance**
The claim that Muslims' primary loyalty is to a global Islamic community (ummah) rather than their country of residence, making them inherently untrustworthy citizens. Variants include "Muslim fifth column," "stealth jihad," "civilization jihad." Technique: conspiratorial intent attribution.

**Cluster 5: Cultural Incompatibility**
The claim that Islamic culture is fundamentally incompatible with Western liberal values — specifically regarding gender equality, LGBTQ+ rights, and freedom of speech. Technique: essentialization (treating 1.8 billion people as a monolithic culture) combined with cherry-picked examples.

**Cluster 6: Manufactured Statistics**
The distribution of fabricated or heavily manipulated statistics attributed to legitimate sources (FBI, Pew Research, government agencies) to create the impression of documented evidence for other narrative clusters. Technique: source fabrication / citation manipulation.

**Cluster 7: Victimhood Inversion**
The claim that Muslims are not victims of Islamophobia but are actually perpetrating victimhood claims to gain political power, silence criticism, or advance a covert agenda. Often used to delegitimize anti-Islamophobia advocacy itself. Technique: motive attribution inversion.

### 9.3 Technique Types (Cross-Cutting)

Regardless of cluster, every narrative uses one or more of these manipulation techniques. Because inoculation targets techniques, this is the most important dimension:

1. **Collective attribution** — Attributing individual actions to an entire group
2. **False equivalence** — Treating unequal things as equivalent
3. **Manufactured consensus** — Creating the false impression of widespread agreement
4. **Essentialization** — Treating a diverse group as culturally monolithic
5. **Conspiratorial intent** — Attributing hidden malicious intent to ordinary behavior
6. **Statistical manipulation** — Misrepresenting or fabricating data
7. **Motive inversion** — Claiming that those fighting discrimination are the real aggressors
8. **Slippery slope** — Claiming that a current situation inevitably leads to an extreme outcome

### 9.4 Taxonomy as Open Resource

The taxonomy is published under Creative Commons Attribution 4.0. It is formatted as:

- A browsable web interface (the Taxonomy Browser feature)
- A downloadable JSON dataset
- A structured CSV for researchers
- A Python package for developers building on Prebunk's detection logic

This is intentional. The taxonomy should be a shared infrastructure resource for the entire field — cited in academic papers, used by other platforms, integrated into journalism training programs.

---

## 10. The Inoculation Content Pipeline

This section describes in full detail how Prebunk generates inoculation briefs.

### 10.1 Trigger Conditions

The brief generation pipeline is triggered by three events:

1. **Scheduled:** Weekly at 6:00 AM UTC on Mondays for the forecast digest
2. **Alert threshold:** When a narrative's VRS crosses 60 (orange) for the first time in 30 days
3. **On-demand:** When a user submits content through the On-Demand Brief Generator

### 10.2 Input Preparation

Before invoking the Claude API, the pipeline prepares a structured brief specification:

```json
{
  "narrative_id": "NAR-042",
  "narrative_name": "Sharia Replacement Threat",
  "technique_type": "false_equivalence",
  "cluster": "Legal System Threat",
  "current_vrs": 82,
  "vrs_trajectory": "accelerating",
  "target_audience": "community_organization",
  "language": "en",
  "factual_refutations": [
    {
      "claim": "Sharia law is being imposed in UK courts",
      "refutation": "UK law applies universally; Sharia arbitration panels operate only in civil disputes, voluntarily, and subject to UK law — identical to Jewish Beth Din courts which have existed for a century",
      "source": "UK Ministry of Justice, 2018"
    },
    ...
  ],
  "talking_point_templates": [...],
  "inoculation_hook": "Explain what false equivalence is and how it works...",
  "example_instances": ["synthetic example 1", "synthetic example 2"]
}
```

Note: This specification contains **no raw hateful content**. The pipeline processes taxonomy-derived, curated content only.

### 10.3 Prompt Architecture

The brief generator uses a three-step chain-of-thought prompt:

**Step 1 — Technique Explanation:**

```
You are an educator writing for a Muslim community organization coordinator.
A narrative is circulating online that uses the "false equivalence" manipulation technique
applied to claims about Islamic law and national legal systems.

Write a clear, 2-paragraph explanation of what "false equivalence" is as a manipulation
technique, using examples that do NOT reference Islam — use general examples first,
then apply the concept to the legal system context.

The explanation should be:
- Written at a reading level accessible to a non-specialist adult
- Non-inflammatory and calm in tone
- Focused on the technique, not on attacking the people who share the content
```

**Step 2 — Narrative Context:**

```
Using the following documented facts [taxonomy entry injected], write 3 paragraphs
explaining what the "Sharia Replacement Threat" narrative claims, where it originated,
and why the claims are factually incorrect.

Ground every factual claim in the provided source material. Do not introduce any
information not present in the source material. Use plain language.
```

**Step 3 — Talking Points and Action:**

```
Based on the explanation above, generate:

1. Three talking point cards (max 30 words each) that a community coordinator could
   post on social media, share in a WhatsApp group, or use in a conversation.
   Tone: calm, factual, direct. Not combative.

2. One "what to say at work/family dinner" script — a 4–6 sentence response someone
   could use when they hear this narrative from a colleague or family member.

3. Two discussion questions for a community meeting or classroom setting.
```

### 10.4 Quality Validation

Every generated brief is passed through a separate validation call:

```
Review the following inoculation brief against these criteria:

1. ACCURACY: Every factual claim is grounded in the source material provided.
   Flag any claim that goes beyond the source material.
2. TONE: The brief is educational and non-inflammatory.
   Flag any language that could be perceived as attacking individuals.
3. ACTIONABILITY: The brief contains specific, usable talking points.
   Flag if talking points are vague or abstract.
4. ACCESSIBILITY: The reading level is appropriate for a general adult audience.
   Flag sentences longer than 25 words or jargon-heavy passages.
5. TECHNIQUE FOCUS: The brief explains the manipulation technique, not just the
   specific claim. Flag if technique explanation is absent or unclear.

Return: PASS or a list of specific issues to address.
```

If the validation returns issues, the brief is re-generated with the issues appended to the original prompt. Maximum 2 regeneration attempts; after that, a human review flag is set.

### 10.5 Multilingual Generation

For non-English subscribers, the validated English brief is translated in a separate Claude API call. The translation prompt emphasizes preserving the tone and technique-focused framing — not just word-for-word translation. Cultural adaptation notes are injected for major language variants (e.g., Arabic briefs use different rhetorical conventions than Indonesian ones).

### 10.6 Brief Storage and Versioning

Every generated brief is stored with:

- Full content
- Generation timestamp
- Trigger condition (scheduled / alert / on-demand)
- VRS at time of generation
- Validation outcome
- Version number (briefs are regenerated when taxonomy entries are updated)
- Usage metrics (how many organizations received it, engagement if tracked)

---

## 11. Delivery System and Subscriber Network

### 11.1 Subscriber Tiers

**Individual subscribers:** Educators, journalists, community members. Receive the weekly digest only. Free.

**Organization subscribers:** Mosques, advocacy groups, student societies, civil society organizations. Receive weekly digest + real-time orange/red alerts + access to the dashboard and brief archive. Free for all non-profit organizations. Formal partnership agreement with GNCI and similar organizations.

**Research subscribers:** Academic institutions, think tanks. Receive full API access + aggregate VRS data export + anonymized trend datasets. Free for academic use; commercial licensing for private sector.

### 11.2 Weekly Digest Format

The weekly digest email is structured as:

```
Subject: Prebunk Narrative Forecast — Week of [Date]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PREBUNK WEEKLY FORECAST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THIS WEEK'S NARRATIVE RADAR

🔴 WATCH: [Narrative Name] — VRS 82, accelerating
   Predicted to break into mainstream by [date range].
   [One-sentence summary of the narrative]
   → Read full brief and talking points below

🟡 ELEVATED: [Narrative Name] — VRS 58, stable
   Circulating primarily on [platform(s)].
   [One-sentence summary]
   → Read brief

🟢 MONITOR: [Narrative Name] — VRS 31, declining
   Activity concentrated in [geography]. No immediate action needed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FULL BRIEF: [Top narrative name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THE TECHNIQUE: [Technique name and explanation]
...

WHAT THE NARRATIVE CLAIMS:
...

WHY IT'S WRONG:
...

TALKING POINTS (ready to use):
• [Talking point 1]
• [Talking point 2]
• [Talking point 3]

WHAT TO SAY AT WORK OR HOME:
"..."

SHARE THIS BRIEF: [Link to public version of brief in Taxonomy Browser]
```

### 11.3 Onboarding Flow

1. Organization submits registration form (name, type, country, size, language preference, focus areas)
2. GNCI or Prebunk partner reviews and approves (prevents astroturfing / bad-faith registration)
3. Welcome email with dashboard access credentials
4. Short onboarding survey: which narrative clusters are most relevant to your community?
5. Preferences locked; first digest sent next Monday
6. 30-day follow-up: feedback survey on usefulness, accuracy, and format

---

## 12. The Organizational Dashboard

### 12.1 Overview

The Organizational Dashboard is a web application (Next.js + Tailwind CSS) giving registered organizations real-time visibility into the narrative landscape and access to all generated briefs.

### 12.2 Dashboard Views

**Home / Radar View:**
A visual display of all 47 narrative categories as a bubble chart, where bubble size represents current volume and bubble color represents VRS level (green / amber / red). Animates in real time (refresh every 4 hours). Clicking any bubble opens the full taxonomy entry and most recent brief.

**Trend View:**
Time-series charts for up to 5 selected narrative categories. Configurable date range (7 days / 30 days / 6 months / all time). Includes a forecast overlay showing the model's 72-hour projection with confidence bands.

**Brief Archive:**
Searchable archive of all generated briefs. Filters: narrative category, date, language, urgency level. Each brief has a "share" link generating a public URL (no login required) for the brief — designed for forwarding to colleagues.

**Alert Log:**
Chronological record of all orange and red alerts, with the brief generated for each and a record of delivery (how many subscribers were notified).

**Community Tips:**
Interface for submitting and tracking community-reported narrative observations. Shows status of pending review and resolution of submitted tips.

**Settings:**
Language preferences, notification settings, team member management, and feedback submission.

---

## 13. Ethical Framework and Safeguards

### 13.1 Design Principles

Prebunk is built on five ethical commitments that are not trade-offs against functionality — they are load-bearing parts of the design.

**No individual profiling.** Prebunk tracks narrative patterns, not people. No account, user, or individual is logged, scored, or labeled. The unit of analysis is always a narrative category and its aggregate velocity — never a person.

**No content storage.** Raw posts, comments, and articles that trigger pattern matches are discarded immediately after matching. Prebunk retains only the match event (category, timestamp, platform, country) — never the content itself.

**No false accusation.** Because Prebunk does not classify individual posts as "Islamophobic" or flag individual users, there is no false positive risk in the traditional sense. A community organization receives a brief about a rising narrative — not an accusation against any person.

**No censorship pathway.** Prebunk is entirely focused on building immunity — educating communities — not on removing content or reporting individuals. It explicitly does not integrate with platform reporting systems. This is a feature, not a limitation. It keeps Prebunk out of the content moderation arms race entirely.

**Community consent and control.** The organizations Prebunk serves are not its subjects — they are its partners. All data shared by partner organizations (community tips) is voluntary, reviewed by a human, and can be withdrawn at any time. The system is transparent about what it monitors and why.

### 13.2 Threat Modeling

Prebunk is designed to be resistant to misuse:

**Misuse vector: Bad actors use Prebunk to identify which narratives are being monitored.**
Mitigation: The Taxonomy Browser is fully public. Prebunk does not obscure what it monitors. Transparency is by design — the taxonomy is most valuable when researchers, educators, and policy makers can cite and build on it.

**Misuse vector: The inoculation briefs themselves are used to refine disinformation.**
Mitigation: Inoculation briefs explain manipulation techniques, not how to execute them. They are structurally identical to media literacy education materials that have existed for decades. The risk is not materially higher than a journalism school ethics curriculum.

**Misuse vector: Community tip line is flooded with false reports to inflate VRS scores.**
Mitigation: Community tips require human review before influencing VRS. The algorithmic signal (API monitoring) is the primary input; tips are a supplementary signal. Anomalous tip volume from single sources triggers a review flag.

**Misuse vector: Prebunk creates surveillance anxiety — Muslims feel they are being monitored.**
Mitigation: Prebunk monitors public content, never individuals. The system is oriented to serve Muslim communities as its primary beneficiaries, not to surveil them. The governance model (Section 16.3) includes Muslim community leadership at every level.

### 13.3 Data Protection

- All subscriber data is stored in compliance with GDPR (EU) and UK GDPR as a minimum baseline, regardless of subscriber location.
- Data retention policy: VRS event logs retained for 24 months; subscriber data retained for the duration of the subscription plus 90 days; no other data retained.
- Penetration testing of the subscriber authentication system before public launch.
- Privacy policy written in plain language and reviewed by a legal professional with data protection expertise.

---

## 14. 48-Hour Hackathon Build Plan

The hackathon development window runs from Saturday, August 22, 2026 at 12:00 PM PT to Monday, August 24, 2026 at 12:00 PM PT.

This build plan assumes a team of three people with the following rough skill distribution:

- **Person A:** Backend / data pipeline (Python, APIs)
- **Person B:** Frontend / UI (Next.js / React)
- **Person C:** Content / research (taxonomy building, brief quality review, presentation)

Solo participants should prioritize the starred items and skip optional stretch goals.

### Hour 0–6: Foundation (Saturday afternoon)

**Person A:**

- [ ] Set up project repository (GitHub, public, MIT license)
- [ ] Scaffold FastAPI backend (Python)
- [ ] Implement Twitter/X filtered stream ingestion (100 keywords from taxonomy)
- [ ] Implement Reddit PRAW scraper for 10 priority subreddits
- [*] Implement basic pattern matching against first 15 taxonomy entries (cosine similarity using sentence-transformers locally — no API calls for matching)
- [ ] Set up PostgreSQL database and schema (narrative_events, vrs_scores, briefs tables)

**Person B:**

- [ ] Scaffold Next.js frontend
- [ ] Build basic dashboard layout (radar view with static mock data)
- [ ] Implement Resend API email integration (test send)
- [ ] Set up Vercel deployment

**Person C:**

- [ ] Build first 20 taxonomy entries (full structure as per Section 9.1)
- [ ] Write semantic anchor phrases for each entry (for embedding matching)
- [*] Draft brief template structures for three audience types
- [ ] Begin sourcing factual refutations for top 5 priority narratives

### Hour 6–18: Core Pipeline (Saturday evening → Sunday morning)

**Person A:**

- [ ] Implement VRS computation (volume + acceleration, simplified to 2 dimensions for hackathon)
- [ ] Implement Claude API brief generation pipeline (Step 1 + Step 2 from Section 10.3)
- [ ] Implement brief storage and retrieval API
- [ ] Wire ingestion → matching → VRS scoring into end-to-end pipeline
- [*] Implement basic forecast (rolling 7-day average with simple trend extrapolation — Prophet is optional stretch)
- [ ] Set up cron job for hourly VRS refresh

**Person B:**

- [ ] Wire dashboard to live API (replace mock data)
- [ ] Build VRS bubble chart (recharts or D3)
- [ ] Build brief display page (clean, readable, shareable)
- [*] Build Taxonomy Browser (static, searchable)
- [ ] Mobile responsive pass

**Person C:**

- [ ] Complete taxonomy to 35 entries
- [ ] Write the Step 3 prompts (talking points, scripts, discussion questions)
- [ ] Review and quality-check first 10 auto-generated briefs
- [ ] Write the demo narrative — a specific current example to use in the final presentation
- [*] Begin educator portal content (2 lesson plan templates)

### Hour 18–36: Integration and Polish (Sunday)

**Everyone:**

- [ ] End-to-end integration test: ingest → match → VRS → brief generation → email delivery
- [ ] Generate the demo weekly digest using real (live) data from the 48 hours of monitoring
- [ ] Set up community tip line (simple form → review queue)
- [ ] Implement subscriber registration and preference management
- [ ] Test email delivery to multiple addresses
- [*] Implement on-demand brief generator (front-end form → API → brief display)
- [*] Add multilingual output for at least one additional language (Arabic or Urdu)

**Person C:**

- [ ] Draft the submission video script (10-minute walkthrough)
- [ ] Prepare the live demo flow (which narrative to show, which brief to generate live)
- [ ] Write the project summary for submission email

### Hour 36–48: Buffer and Submission (Sunday evening → Monday noon)

- [ ] Fix critical bugs only — no new features
- [ ] Record demo video with captions
- [ ] Write README.md
- [ ] Document all AI tools, datasets, libraries used (for §5 disclosures)
- [ ] Final test of all submission links
- [ ] Send submission email by 12:00 PM PT Monday

### What the Demo Shows

The hackathon demo should be structured as a 5-minute live walkthrough:

1. **"The problem in 30 seconds"** — Show a real example of a viral Islamophobic narrative from the past year. State how long it took for any counter-response to appear.
2. **"Here's what Prebunk saw"** — Open the dashboard and show actual VRS scores from 48 hours of monitoring. If a real narrative is elevated, show it. If not, use a prepared scenario.
3. **"Here's what Prebunk sent"** — Show a generated brief. Read the talking points aloud. Demonstrate that a community coordinator could use them immediately.
4. **"Here's the science"** — One slide on inoculation theory. One study citation. "This is not a detection tool. This is a vaccination program."
5. **"Here's who uses it and how it grows"** — Subscriber network diagram. The brief archive as a growing asset. The Taxonomy as a public good.

---

## 15. Scoring Against the Judging Criteria

| Criterion | Weight | Projected Score | Rationale |
| --- | --- | --- | --- |
| **Impact** | 25% | 5/5 | Serves Muslim organizations worldwide, not individual users. Grounded in peer-reviewed science. Clear, evidence-based path to measurable benefit — inoculation studies show 5–10% reduction in susceptibility from a single exposure. |
| **Functionality** | 25% | 4/5 | The pipeline works end-to-end. The brief generator produces demonstrably useful output. VRS scoring is functional. Minor limitation: 48-hour forecast model is simplified (no Prophet in MVP); disclosed in submission. |
| **Innovation** | 15% | 5/5 | Applies inoculation theory — a peer-reviewed behavioral science framework — to Islamophobia for the first time at a systematic level. Categorically different from any other submission. Citable scientific basis for the innovation claim. |
| **Ethics** | 15% | 5/5 | No individual profiling. No content storage. No false positives. No censorship pathway. Community consent at every level. GDPR compliant. This is the cleanest ethics profile of any detection-adjacent tool imaginable. |
| **Sustainability** | 10% | 4/5 | Open-source taxonomy is a compounding asset. Partner organization network grows the community tip signal over time. GNCI and MPAC are natural long-term hosts. Revenue model (research API licensing) identified. Small deduction: requires ongoing human review of community tips. |
| **Communication** | 10% | 5/5 | "A weather radar for Islamophobia" is a 5-second pitch that lands. The demo is visual, live, and shows a real output. The scientific basis is citable. Judges from Amazon, Microsoft, and YouTube will immediately recognize the threat intelligence framing. |

**Projected total: 92–96/100**

---

## 16. Post-Hackathon Roadmap

### 16.1 Short Term (0–3 Months)

- Expand taxonomy to 100+ entries (invite academic partners to contribute)
- Onboard 20 founding partner organizations (10 UK, 5 North America, 5 globally)
- Deploy Prophet forecasting model with 90 days of training data
- Launch Arabic and Urdu brief generation
- Public launch of Taxonomy Browser under Creative Commons

### 16.2 Medium Term (3–12 Months)

- Partner with GNCI, CAIR, BRIDGE, Tell MAMA for data sharing and taxonomy co-development
- Develop platform API integrations (Slack bot for organizational teams, Notion integration for educators)
- Commission independent academic evaluation of inoculation brief effectiveness (pre-post survey of brief recipients)
- Expand to 200+ subscriber organizations
- Apply for grant funding (Knight Foundation, Mozilla Foundation, Open Society Foundations all actively fund counter-disinformation infrastructure)
- Hire one full-time narrative analyst (grant-funded)

### 16.3 Governance Model

Prebunk should not be owned by its founders. Long-term governance should transfer to a structure including:

- A Steering Committee with majority Muslim community organization representation
- An Advisory Board including academic researchers in inoculation theory, Islamophobia studies, and data ethics
- An independent Ethics Review Board with veto power over changes to the data handling architecture
- Annual public transparency report covering: narratives tracked, briefs generated, subscriber organizations, and any data requests received (expected: zero, as Prebunk holds no personal data)

### 16.4 Revenue Model

Prebunk is free for all non-profit and community organizations. Revenue sources to sustain operations:

- **Research API licensing:** Academic institutions and corporate trust & safety teams pay for API access to aggregate VRS data
- **Grant funding:** Counter-disinformation infrastructure is an active funding priority for major foundations
- **Training programs:** Prebunk's taxonomy and brief library form the basis of a paid media literacy training curriculum for corporate EDI programs and journalism schools
- **Government partnerships:** In multiple jurisdictions, government counter-extremism programs actively fund this type of infrastructure

---

## 17. Improvements and Extensions

### 17.1 Visual Narrative Network Map

An interactive map showing how specific narratives travel across platforms — from their origin (often a specific website, think tank, or content creator) through successive amplification layers to mainstream virality. This is the Origin Machine idea built into Prebunk as a feature. Visualized as a force-directed network graph. Extremely compelling for journalists and advocacy organizations.

### 17.2 The "Narrative Weather" Podcast

A weekly 10-minute audio brief — auto-generated from the same data as the email digest, with a human host framing. Distributed via standard podcast feeds. Reaches the large segment of the Muslim community that is more podcast-native than newsletter-native. Particularly effective for mosque communities where the imam could share a weekly audio brief with their congregation.

### 17.3 WhatsApp Integration

A verified WhatsApp Business account that subscribers can message with a narrative description and receive a brief in return. This is the single most impactful delivery channel for Muslim communities globally, particularly in South Asia, Southeast Asia, and Africa. Requires WhatsApp Business API access (achievable post-hackathon).

### 17.4 Coordinated Attack Signature Detection

Building on the Signal idea from the brainstorm: a specialized module within Prebunk that flags when multiple narrative categories spike simultaneously, or when the velocity signature matches known coordinated campaign patterns (sudden synchronized posting across accounts with similar characteristics). This would output a specific "possible coordinated attack" alert with evidence for platform escalation. This is architecturally compatible with Prebunk's existing pipeline and extends it into the threat intelligence direction.

### 17.5 Cross-Community Expansion

The Prebunk architecture is not specific to Islamophobia. The taxonomy is, and it should remain its core focus. But the underlying infrastructure — velocity tracking, forecast engine, inoculation brief generation — could be offered as a shared platform to other communities facing systematic online hate (Black communities, Jewish communities, Roma communities, LGBTQ+ communities). A federated model where each community owns and maintains its own taxonomy, but shares infrastructure, dramatically reduces the per-community cost of deployment.

### 17.6 Politician and Candidate Monitoring

During election cycles, specific political candidates frequently deploy or amplify Islamophobic narratives. A specialized module that monitors candidate communications for narrative taxonomy matches — with documentation timestamped and archived — would create an evidence record useful for advocacy organizations, journalists, and voters. This is distinct from electoral interference: it documents public statements against a factual taxonomy, does not make voting recommendations, and produces evidence rather than opinions.

### 17.7 API for Browser Extensions

One of the cleanest uses of Prebunk's API: instead of a browser extension that tries to classify individual text in real time (with all the accuracy and ethics problems that entails), an extension that queries Prebunk's VRS feed and shows users which narrative clusters are currently elevated globally. No individual content classification. Just: "This is a moment when [narrative type] is spreading heavily. Here is the context." The extension defers all the hard work to Prebunk's aggregate intelligence.

---

*This document was prepared for the 2026 Harvest Anti-Muslim Hate Hackathon, convened by the Global Network on Combatting Islamophobia.*
*Prebunk is built on the peer-reviewed work of Sander van der Linden, Jon Roozenbeek, Melisa Basol, Stephan Lewandowsky, and their collaborators at the Cambridge Social Decision-Making Lab.*

---

**Document version:** 1.0
**Last updated:** August 19, 2026
**Status:** Hackathon design brief — pre-build
