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

- **Strict Fallback Policy**: In full accordance with `docs/01-brief/AI_BUILD_STEPS.md` and `docs/02-design/IMAGE_ASSET_MANIFEST.md`, no unverified photos of individuals, generic stock models, or unrelated motorcycles are used.
- **Synthesized Abstract Art**: High-fidelity custom abstract artwork (dynamic racing vectors, glowing speedometers, and crimson telemetry) is deployed across all headers and feature cards.
- **Audit Log**: Every asset is registered in `docs/02-design/IMAGE_ASSET_MANIFEST.md`.

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
├── index.html
├── biography.html
├── videos.html
├── news.html
├── about.html
├── privacy.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── _headers
├── netlify.toml
├── README.md
├── .gitignore
├── assets/
│   ├── css/                  # styles.css
│   ├── js/                   # main.js, content-data.js
│   ├── fonts/
│   ├── icons/                # favicon, apple-touch-icon, maskable
│   └── images/
│       ├── hero/
│       ├── gallery/
│       ├── news/
│       └── og/
└── docs/
    ├── 01-brief/             # PROJECT_BRIEF, MASTER_PROMPT, AI_BUILD_STEPS
    ├── 02-design/            # DESIGN_SYSTEM, IMAGE_ASSET_MANIFEST
    ├── 03-content/           # CONTENT_MODEL, CONTENT_WORKFLOW, content-schema.json
    ├── 04-specs/             # SITEMAP_AND_PAGE_SPECS, SEO_ACCESSIBILITY_PERFORMANCE, ACCEPTANCE_CHECKLIST
    └── 05-security/          # security audit, changelog, Netlify verification checklist
```
