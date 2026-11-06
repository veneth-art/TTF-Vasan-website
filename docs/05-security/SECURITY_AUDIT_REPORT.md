# Security Audit Report — TTF Vasan Unofficial Fan Site

| Field | Value |
| --- | --- |
| Audit date | 2026-11-06 |
| Target | `https://ttf-vasan.netlify.app/` |
| Repository | `veneth-art/TTF-Vasan-website` (`main`) |
| Application type | Static HTML/CSS/JavaScript site, no build step, no server-side code |
| Audit basis | `docs/05-security/TTF_Vasan_Security.md` |
| Deployment status | Fixes are present in the working tree; **not committed or deployed** during this audit |

## Executive summary

The site is a static, read-only fan site. It has no login, database, API, form submission, file upload, payment flow, cookies, `localStorage`, `sessionStorage`, `fetch`, `XMLHttpRequest`, `WebSocket`, or `sendBeacon` usage. This removes most common web application attack classes.

No exposed secrets, private keys, credentials, source maps, environment files, or sensitive data were found in the working tree. No exploitable server-side vulnerability was identified.

The material risks were in the browser supply chain and response hardening:

1. A third-party icon script was loaded from `unpkg.com` using `@latest` with no integrity check.
2. The live response had HSTS but no Content Security Policy and several other standard security headers.
3. The pages used inline scripts and JavaScript `innerHTML` sinks.

All confirmed issues have been remediated in the repository. The remaining step is deployment and post-deploy verification; see `NETLIFY_SECURITY_CHECKLIST.md`.

## Severity scale

| Severity | Meaning |
| --- | --- |
| Critical | Direct compromise of confidential data or full site control with little or no interaction |
| High | Likely compromise or arbitrary script execution with significant impact |
| Medium | Meaningful risk that needs a practical precondition or has limited impact |
| Low | Defense-in-depth or hardening issue with limited direct impact |
| Info | Observation, accepted trade-off, or no action required |

## Inventory

| Asset | Count / detail |
| --- | --- |
| HTML pages | `index.html`, `about.html`, `biography.html`, `news.html`, `videos.html`, `privacy.html`, `404.html` |
| First-party scripts | `assets/js/content-data.js`, `assets/js/main.js` |
| First-party styles | `assets/css/styles.css` |
| Third-party runtime script | Lucide `1.70.0` UMD from `unpkg.com` (now pinned with SRI) |
| Third-party styles/fonts | Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`) |
| Third-party frames | YouTube (`www.youtube-nocookie.com` after fix) |
| Static images | Local only under `assets/images/` |
| Forms / inputs | None |
| Authentication / sessions | None |
| Cookies / browser storage | None |
| Server-side code | None |
| Package manager / lockfile | None (`package.json` absent) |

## Findings

| ID | Severity | Finding | Status |
| --- | --- | --- | --- |
| SEC-01 | High | Unpinned third-party script from `unpkg.com` with no Subresource Integrity (SRI) | Fixed |
| SEC-02 | Medium | No Content Security Policy on the live response | Fixed in repository; pending deploy verification |
| SEC-03 | Low | Missing `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options` | Fixed in repository; pending deploy verification |
| SEC-04 | Low | Inline `lucide.createIcons()` scripts on every page | Fixed |
| SEC-05 | Low | `innerHTML` sinks in `main.js` for emoji and thumbnail rendering | Fixed |
| SEC-06 | Low | Modal CTA `href` was assigned from data without URL scheme validation | Fixed |
| SEC-07 | Low (privacy) | YouTube embeds used `youtube.com` and had no referrer policy | Fixed |
| SEC-08 | Info | HSTS already present with `includeSubDomains; preload` | No action |
| SEC-09 | Info | No forms, authentication, APIs, or user data collection | No action |
| SEC-10 | Info | Secret scan found no real secrets in the working tree | No action |
| SEC-11 | Info | Google Fonts and YouTube remain third-party privacy/availability dependencies | Accepted residual risk |
| SEC-12 | Info | Inline `style` attributes require `style-src 'unsafe-inline'` | Accepted trade-off |
| SEC-13 | Info | Documentation and README are publicly reachable on the deployed site | No action (no secrets present) |

### SEC-01 — Unpinned third-party script without SRI (High)

**Evidence:** Every HTML page loaded:

```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
```

**Impact:** `@latest` can change without review. A compromised or malicious CDN response, DNS compromise, or package takeover could execute arbitrary JavaScript in the site origin. The script also had no `integrity` attribute.

**Fix applied:** Pinned to the current resolved version and added SHA-384 SRI:

```html
<script src="https://unpkg.com/lucide@1.70.0/dist/umd/lucide.min.js"
        integrity="sha384-64z4N640tVzhAicQVGzxE/48VNN9yS53U5kv9UH8ca7xGU4KSJ9zz8nD4C2BEerP"
        crossorigin="anonymous" defer></script>
```

The CSP also restricts `script-src` to this exact file.

**Residual risk:** A pinned CDN file can still become unavailable. Self-hosting the file under `assets/js/vendor/` would remove the third-party origin and is the stronger long-term option.

### SEC-02 — Missing Content Security Policy (Medium)

**Evidence (live, before fix):** `curl.exe -sSI https://ttf-vasan.netlify.app/` returned `Strict-Transport-Security` but no `Content-Security-Policy`.

**Impact:** If an injection issue were introduced later, there would be no browser-level restriction on script origins or inline execution.

**Fix applied:** Added `_headers` with an enforcing CSP:

```text
default-src 'self';
base-uri 'self';
object-src 'none';
script-src 'self' https://unpkg.com/lucide@1.70.0/dist/umd/lucide.min.js;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self';
frame-src https://www.youtube.com https://www.youtube-nocookie.com;
connect-src 'self';
media-src 'self';
manifest-src 'self';
form-action 'self';
frame-ancestors 'self';
upgrade-insecure-requests
```

**Residual risk:** The header must be verified after deployment. An unlisted resource would be blocked, so check the browser console on every page.

### SEC-03 — Missing standard security headers (Low)

**Evidence (live, before fix):** HSTS was present; the following were absent:

- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`
- `X-Frame-Options`

**Fix applied:** Added to `_headers`:

```text
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
X-Frame-Options: SAMEORIGIN
```

HSTS is intentionally not duplicated because Netlify already emits it for `*.netlify.app`.

### SEC-04 — Inline scripts (Low)

**Evidence:** All seven HTML pages contained:

```html
<script>
  lucide.createIcons();
</script>
```

**Impact:** Inline scripts force a weak CSP (`'unsafe-inline'`) or require hashes/nonces.

**Fix applied:** Removed every inline script and moved initialization into `assets/js/main.js`:

```js
if (window.lucide) window.lucide.createIcons();
```

The Lucide script is deferred, so the call runs from the `DOMContentLoaded` handler after the library loads. Verified: no inline `<script>` blocks and no inline event handlers remain.

### SEC-05 — `innerHTML` DOM sinks (Low)

**Evidence:** `assets/js/main.js` previously built emoji spans and thumbnail images with `innerHTML`:

- `modalEmojiWrap.innerHTML = ...`
- `modalThumbsStrip.innerHTML = ...`
- thumbnail `<img src="...">` string construction

**Impact:** Low because the data came from the static `content-data.js` file, not from a URL, form, or API. It is still an avoidable injection sink and would become dangerous if content ever became user-editable.

**Fix applied:** Replaced with `document.createElement`, `textContent`, `img.src`, `img.alt`, `img.loading`, and `replaceChildren()`. No `innerHTML`/`outerHTML`/`insertAdjacentHTML`/`document.write`/`eval`/`new Function` usage remains in first-party JavaScript.

### SEC-06 — Unvalidated URL assignment (Low)

**Evidence:** The gallery modal assigned `modalCtaBtn.href = imgData.source` directly.

**Impact:** Low with static data, but a future content change could introduce a `javascript:` or `data:` URL.

**Fix applied:** Added a URL safety helper that allows `http:` and `https:`, plus `file:` only when the page itself is opened as a local file (so direct local preview still works). All other schemes are rejected:

```js
const toSafeUrl = (value) => {
  if (!value) return '';
  try {
    const url = new URL(value, window.location.href);
    const isWeb = url.protocol === 'https:' || url.protocol === 'http:';
    const isLocalFile = url.protocol === 'file:' && window.location.protocol === 'file:';
    return (isWeb || isLocalFile) ? url.href : '';
  } catch {
    return '';
  }
};
```

Applied to the modal image source, CTA link, and thumbnail sources.

### SEC-07 — YouTube embed privacy (Low)

**Evidence:** Embeds used `https://www.youtube.com/embed/...` and had no `referrerpolicy`.

**Impact:** Standard YouTube embeds may set cookies and receive referrer data before playback. This is disclosed on the privacy page.

**Fix applied:** Switched all embeds to `https://www.youtube-nocookie.com/embed/...` and added:

```html
referrerpolicy="strict-origin-when-cross-origin"
```

Existing `loading="lazy"` was preserved. This reduces pre-playback tracking but does not eliminate YouTube data collection after playback; the privacy page should continue to disclose that.

### SEC-08 — HSTS already present (Info)

**Evidence (live):**

```text
strict-transport-security: max-age=31536000; includeSubDomains; preload
```

**Action:** None. Do not duplicate it in `_headers`; a duplicate header can produce inconsistent values. If a custom domain is added without Netlify-managed HTTPS, review HSTS in the Netlify dashboard.

### SEC-09 — No server-side or stateful attack surface (Info)

No forms, inputs, authentication, authorization, uploads, database, API calls, browser storage, or cookies were found. Server-side injection, broken access control, CSRF, and session fixation are not applicable in the current architecture.

### SEC-10 — Secret scan (Info)

A working-tree scan for private keys, API keys, tokens, passwords, `.env` files, and common credential patterns found no real secrets. Matches were false positives:

- `styles.css` contains the words "Design Tokens".
- `AI_BUILD_STEPS.md` and the security prompt contain instruction text containing words such as "token" or "password".
- No `.env`, key, certificate, or credential file is tracked.
- `.gitignore` already excludes `.env`, `.env.*`, `node_modules/`, `dist/`, `build/`, `.vscode/`, and `coverage/`.

Git history was not exhaustively scanned. If the repository has ever contained secrets or will be shared more widely, run `gitleaks` or `trufflehog` against full history.

### SEC-11 — Third-party privacy and availability (Info, accepted)

Google Fonts and YouTube remain external dependencies. They can observe visitor IP addresses and may set their own cookies after interaction. Self-hosting fonts and using `youtube-nocookie.com` reduces but does not remove this. The privacy page already discloses third-party services; keep it accurate.

### SEC-12 — Inline styles (Info, accepted)

The site uses inline `style` attributes in HTML and JavaScript. A strict `style-src` without `'unsafe-inline'` would break layout and animations. The CSP therefore allows `'unsafe-inline'` for styles only; scripts remain restricted. Moving inline styles into `assets/css/styles.css` would allow a stricter style policy later.

### SEC-13 — Public documentation (Info)

`README.md` and `docs/` are deployed with the site. They contain no credentials or private data. If the repository is made private or the docs are not intended for public view, add a Netlify redirect or access rule for `/docs/*`. No security action is required today.

## Verification performed

| Check | Result |
| --- | --- |
| `node --check assets/js/main.js` | Pass |
| `node --check assets/js/content-data.js` | Pass |
| HTML script inventory | Three unique scripts: `content-data.js`, `main.js`, pinned Lucide |
| Inline `<script>` blocks | 0 |
| Inline event handlers | 0 |
| `innerHTML`/`eval`/`document.write` in first-party JS | 0 (comments only) |
| `target="_blank"` without `noopener`/`noreferrer` | 0 |
| `http://` references | 0 |
| External image sources | 0 (all images local) |
| Local asset references | All resolve |
| Secret scan (working tree) | No real secrets |
| Live headers before fix | HSTS present; CSP and hardening headers missing |
| Live headers after fix | Not verified; requires deploy |

## Limitations

- The fixes were not deployed or tested against the live Netlify edge during this audit.
- CSP behavior was reasoned from the source inventory, not observed in a browser.
- The Netlify dashboard configuration (publish directory, custom headers, HTTPS settings, team access, deploy keys) was not accessible.
- No automated dependency audit was possible because the project has no `package.json` or lockfile.
- Git history was not scanned for historical secrets.

## Recommended next steps

1. Commit and deploy the changes.
2. Run the post-deploy checks in `NETLIFY_SECURITY_CHECKLIST.md`.
3. Open every page with DevTools open and confirm there are no CSP violations.
4. Confirm the pinned Lucide file loads and icons render.
5. Confirm all YouTube embeds load from `youtube-nocookie.com`.
6. Consider self-hosting Lucide and Google Fonts to remove third-party origins.
7. Run `gitleaks` or `trufflehog` against full git history before making the repository public or sharing it broadly.
8. If a custom domain is added, verify HTTPS and HSTS in Netlify.

## Related documents

- `docs/05-security/SECURITY_CHANGELOG.md`
- `docs/05-security/NETLIFY_SECURITY_CHECKLIST.md`
- `docs/05-security/TTF_Vasan_Security.md`
