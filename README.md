# TTF VASAN — UNOFFICIAL FAN HUB

A high-performance, dark-themed, responsive fan website concept. This is an **unofficial, fan-made project**, not affiliated with or endorsed by TTF Vasan or his representatives.

---

## 🚀 Overview of Completed Implementation

The fan hub is fully realized as a zero-dependency, static web experience optimized for speed, visual immersion, and strict compliance with the project's editorial guidelines:

- **Home (`index.html`)**: Text-led hero ("THE RIDE. THE JOURNEY. THE STORY."), particle canvas background, featured stories, interactive video previews, career milestones, stats counters, fan quotes, and ticker.
- **Videos (`videos.html`)**: Featured player and responsive card grid for YouTube embeds permitted under YouTube Terms of Service, with creator attribution and lazy loading.
- **Biography (`biography.html`)**: Narrative journey from motorcycle enthusiast to Tamil Nadu vlogging icon, timeline with milestones and sample verification badges.
- **News (`news.html`)**: Curated dispatches, milestone alerts, community reports, deduplication keys, and editorial verification transparency.
- **About (`about.html`)**: Clarification of unofficial status, mission, community values (Passion, Safety, Integrity, Respect), strict image approval gate, and corrections process.
- **Privacy (`privacy.html`)**: Honest privacy disclosure matching the static implementation (no tracking, no user database, third-party embeds, CDN details).

---

## 🎨 Visual Design System

- **Palette**: Obsidian Black (`#09090B`), Charcoal (`#17171C`), Racing Red (`#F04444`), Off-White (`#F5F5F5`), Muted Gray (`#A1A1AA`).
- **Typography**: Space Grotesk (headings) and Inter (body) loaded via Google Fonts.
- **Aesthetics**: Glassmorphism navigation, dynamic particle network, smooth scroll progress indicator, 3D card tilt micro-animations, and scroll-triggered reveal animations.
- **Accessibility & Motion**: Full `prefers-reduced-motion` compliance, accessible focus indicators, semantic landmarks, and skip-nav-friendly structures.

---

## 🛡️ Mandatory Image Rules & Provenance

- **Strict Fallback Policy**: In full accordance with `AI_BUILD_STEPS.md` and `IMAGE_ASSET_MANIFEST.md`, no unverified photos of individuals, generic stock models, or unrelated motorcycles are used.
- **Synthesized Abstract Art**: High-fidelity custom abstract artwork (dynamic racing vectors, glowing speedometers, and crimson telemetry) is deployed across all headers and feature cards.
- **Audit Log**: Every asset is registered in `IMAGE_ASSET_MANIFEST.md`.

---

## 💻 Local Preview & Deployment

Because this project is built using native HTML5, Vanilla CSS, and JavaScript, it can be tested instantly without complex build steps:

### Using Python:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

### Using Node / npx:
```bash
npx serve .
```

### Static Hosting:
Deploy directly to Cloudflare Pages, GitHub Pages, Vercel, or Netlify by pointing the root directory to this repository.

---

## 📂 Project Architecture

```
├── assets/
│   ├── about-bg.jpg           # Abstract mechanical artwork
│   ├── biography-bg.jpg       # Abstract speedometer and telemetry
│   ├── hero-bg.jpg            # Abstract red racing velocity curves
│   ├── news-bg.jpg            # Abstract digital broadcast graphic
│   ├── ttf-logo.jpg           # Monogram fan emblem
│   └── videos-bg.jpg          # Abstract cinema racing trails
├── index.html                 # Home page
├── videos.html                # Video showcase & embeds
├── biography.html             # Sourced milestones & timeline
├── news.html                  # Editorial dispatches & news grid
├── about.html                 # Mission, standards, & disclaimers
├── privacy.html               # Plain-language privacy disclosure
├── styles.css                 # Design system tokens, components, responsive CSS
├── main.js                    # Particles, scroll reveals, lazy loading, tilt effect
├── content-data.js            # Separated content data store
├── content-schema.json        # Content validation schema
├── robots.txt                 # Search engine crawler instructions
├── sitemap.xml                # Search engine sitemap
├── IMAGE_ASSET_MANIFEST.md    # Image audit and approval tracking
├── ACCEPTANCE_CHECKLIST.md    # Verified launch checklist
└── README.md                  # Project documentation
```
