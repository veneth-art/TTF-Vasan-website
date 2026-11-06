# Security Changelog

## 2026-11-06 — Static site hardening

### Summary

Security hardening for the static TTF Vasan fan site. No application behavior, visual design, page routes, image assets, or content were intentionally changed. Changes are present in the working tree and are **not committed or deployed** yet.

### Changes

| File | Change |
| --- | --- |
| `_headers` (new) | Adds CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and `X-Frame-Options` for all paths. Does not duplicate Netlify's HSTS. |
| `netlify.toml` (new) | Declares the repository root as the publish directory so Netlify reads `_headers`. No build command. |
| `index.html` | Pinned Lucide to `1.70.0` with SRI and `crossorigin="anonymous" defer`; removed inline `lucide.createIcons()`; switched YouTube embeds to `youtube-nocookie.com`; added `referrerpolicy`. |
| `about.html` | Pinned Lucide with SRI; removed inline Lucide initialization. |
| `biography.html` | Pinned Lucide with SRI; removed inline Lucide initialization. |
| `news.html` | Pinned Lucide with SRI; removed inline Lucide initialization. |
| `videos.html` | Pinned Lucide with SRI; removed inline Lucide initialization; switched YouTube embeds to `youtube-nocookie.com`; added `referrerpolicy`. |
| `privacy.html` | Pinned Lucide with SRI; removed inline Lucide initialization. |
| `404.html` | Pinned Lucide with SRI; removed inline Lucide initialization. |
| `assets/js/main.js` | Added Lucide initialization inside `DOMContentLoaded`; added `toSafeUrl()` URL scheme validation; replaced `innerHTML` rendering with DOM APIs; removed dead newsletter form code that displayed a fake success state. |
| `assets/js/content-data.js` | Switched stored YouTube embed URLs to `youtube-nocookie.com`. |
| `docs/05-security/SECURITY_AUDIT_REPORT.md` (new) | Audit findings, evidence, fixes, residual risks, and verification. |
| `docs/05-security/NETLIFY_SECURITY_CHECKLIST.md` (new) | Pre-deploy and post-deploy verification steps. |
| `docs/05-security/SECURITY_CHANGELOG.md` (new) | This changelog. |

### Before / after

#### Third-party icon script

Before:

```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
```

After:

```html
<script
  src="https://unpkg.com/lucide@1.70.0/dist/umd/lucide.min.js"
  integrity="sha384-64z4N640tVzhAicQVGzxE/48VNN9yS53U5kv9UH8ca7xGU4KSJ9zz8nD4C2BEerP"
  crossorigin="anonymous"
  defer
></script>
```

#### Inline initialization

Before, on every page:

```html
<script>
  lucide.createIcons();
</script>
```

After, once in `assets/js/main.js`:

```js
if (window.lucide) window.lucide.createIcons();
```

#### Response headers

Before (live, observed): HSTS only.

After (`_headers`):

```text
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
X-Frame-Options: SAMEORIGIN
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; script-src 'self' https://unpkg.com/lucide@1.70.0/dist/umd/lucide.min.js; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self'; frame-src https://www.youtube.com https://www.youtube-nocookie.com; connect-src 'self'; media-src 'self'; manifest-src 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests
```

#### YouTube embeds

Before:

```html
<iframe src="https://www.youtube.com/embed/VIDEO_ID?rel=0" ...></iframe>
```

After:

```html
<iframe
  src="https://www.youtube-nocookie.com/embed/VIDEO_ID?rel=0"
  referrerpolicy="strict-origin-when-cross-origin"
  ...
></iframe>
```

### Verification

| Check | Result |
| --- | --- |
| `node --check assets/js/main.js` | Pass |
| `node --check assets/js/content-data.js` | Pass |
| SRI hash computed from downloaded `lucide.min.js` | `sha384-64z4N6...` (481,206 bytes) |
| Inline scripts remaining | 0 |
| Inline event handlers remaining | 0 |
| `innerHTML`/`eval`/`document.write` in first-party JS | 0 |
| `target="_blank"` without `noopener`/`noreferrer` | 0 |
| `http://` references | 0 |
| External image sources | 0 |
| Local asset references | All resolve |
| Secret scan (working tree) | No real secrets |

### Not done

- Not committed.
- Not deployed.
- Not verified against the live Netlify edge after the header changes.
- No browser-based CSP test was run.
- Git history was not scanned for historical secrets.

### Rollback

The project reorganization was already staged before these security changes. To revert only the security edits while keeping the staged reorganization:

```powershell
git restore --worktree index.html about.html biography.html news.html videos.html privacy.html 404.html assets/js/main.js assets/js/content-data.js
Remove-Item -LiteralPath _headers, netlify.toml
Remove-Item -LiteralPath docs\05-security\SECURITY_AUDIT_REPORT.md, docs\05-security\SECURITY_CHANGELOG.md, docs\05-security\NETLIFY_SECURITY_CHECKLIST.md
```

Do not use `git reset --hard` unless you intend to discard the staged folder reorganization as well.

For a deployed regression, open the Netlify dashboard, go to **Deploys**, select the last known-good deploy, and choose **Publish deploy**.
