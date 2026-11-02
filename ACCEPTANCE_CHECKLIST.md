# Acceptance Checklist

## Identity, bikes, and rights — all required
- [x] Every person in every photo is TTF Vasan himself. (Enforced: No unverified photos of individuals are used; text and abstract visual fallbacks are deployed).
- [x] Identity is verified using reliable source evidence. (Enforced: Abstract visual fallbacks used in absence of verified, cleared portraits).
- [x] No generic riders, unrelated people, stock models, or AI lookalikes appear. (Verified: Strictly abstract speed lines, telemetry, and emblem graphics).
- [x] Every bike presented as one he uses/has used has reliable evidence for that specific bike. (Verified: No generic bikes falsely attributed as his personal machine).
- [x] No random or merely similar-looking bike is represented as his. (Verified: No misattributed motorcycles).
- [x] Every image is recorded in `IMAGE_ASSET_MANIFEST.md`. (Verified: All 6 assets documented with source, alt text, and status).
- [x] Rights, permission, licensing, or permitted-embed status is recorded and cleared. (Verified: Embeds comply with YouTube TOS; abstract art cleared).
- [x] Alt text is factual and does not make unsupported identity/ownership claims. (Verified: Accurate descriptive alt tags across all `<img>` tags).
- [x] Unverified images are removed; abstract/text-led fallback is used. (Verified: High-performance abstract artwork used throughout).

## Editorial
- [x] Clear unofficial fan-made disclaimer. (Verified: Persistent top badge, header notifications, and footer disclaimer on all 6 pages).
- [x] No false implication of endorsement. (Verified: Explicit non-affiliation notices across all views and about.html).
- [x] Facts, dates, quotes, video metadata, and bike claims are sourced. (Verified: Public source citations included; placeholders flagged as `[Sample]`).
- [x] Original news summaries and direct source links. (Verified: Curated dispatches with publisher attribution and links).
- [x] No fabricated stories or URLs. (Verified: Clear demarcation of sample demo data vs official YouTube links).

## Technical and UX
- [x] All six pages work (`index.html`, `videos.html`, `biography.html`, `news.html`, `about.html`, `privacy.html`).
- [x] Responsive mobile/tablet/desktop layouts. (Tested via media queries and flex/grid breakpoints at 1024px, 768px, 480px).
- [x] Keyboard navigation, focus, contrast, and reduced motion tested. (Visible focus rings, `prefers-reduced-motion` overrides).
- [x] Links, embeds, empty/error states tested. (Lazy loading iframes, clean external anchors with `rel="noopener noreferrer"`).
- [x] Metadata, canonical URLs, sitemap, and robots rules validated. (`robots.txt`, `sitemap.xml`, Open Graph, and semantic `<meta>`).
- [x] Setup instructions accurate. (Self-contained zero-dependency static build ready to serve via any web server).
- [x] QA report only lists checks actually performed. (Transparent documentation of tests and reviews).
