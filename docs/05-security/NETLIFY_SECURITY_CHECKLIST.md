# Netlify Security Checklist — TTF Vasan Fan Site

Use this checklist after committing and deploying the security changes. The repository-level work is complete; the items below verify that Netlify actually serves the intended configuration.

## 1. Pre-deploy checks

- [ ] `git status --short` shows only intended files.
- [ ] `_headers` exists at the repository root.
- [ ] `netlify.toml` sets `publish = "."` and has no build command.
- [ ] `node --check assets/js/main.js` passes.
- [ ] `node --check assets/js/content-data.js` passes.
- [ ] No inline `<script>` blocks remain in any HTML page.
- [ ] No `lucide@latest` references remain.
- [ ] Every Lucide tag has the pinned URL, `integrity`, and `crossorigin="anonymous"`.
- [ ] Every YouTube iframe uses `youtube-nocookie.com`.
- [ ] No real secrets are present in the working tree.
- [ ] The privacy page still accurately describes Google Fonts and YouTube usage.

## 2. Netlify dashboard checks

Open the site in Netlify and confirm:

- [ ] **Site configuration → Build & deploy → Build settings**
  - Publish directory: `.` (repository root)
  - Build command: empty
- [ ] **Domain management → HTTPS**
  - Certificate is valid and auto-renewing.
  - "Force HTTPS" is enabled.
- [ ] **Site configuration → Access control**
  - Only intended team members have access.
  - Deploy keys and Git provider integrations are current.
- [ ] **Environment variables**
  - No secrets are required for this static site.
  - Remove any unused variables that contain credentials.
- [ ] **Forms**
  - Netlify Forms is not enabled unless a real, intentional form is added later.
- [ ] **Deploy logs**
  - The deploy succeeds and publishes the expected files.

## 3. Post-deploy header verification

Run these from PowerShell in the project root.

### Main page headers

```powershell
curl.exe -sSI https://ttf-vasan.netlify.app/ | Select-String -Pattern 'HTTP/|content-security-policy|x-content-type-options|referrer-policy|permissions-policy|x-frame-options|strict-transport-security'
```

Expected (header names may be lowercase over HTTP/2):

```text
HTTP/2 200
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin
permissions-policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
x-frame-options: SAMEORIGIN
content-security-policy: default-src 'self'; ... frame-ancestors 'self'; upgrade-insecure-requests
strict-transport-security: max-age=31536000; includeSubDomains; preload
```

If `content-security-policy` is missing, Netlify did not read `_headers`. Check the publish directory and confirm `_headers` is at the publish root.

### A representative inner page

```powershell
curl.exe -sSI https://ttf-vasan.netlify.app/privacy.html | Select-String -Pattern 'HTTP/|content-security-policy|x-content-type-options|permissions-policy'
```

### A static asset

```powershell
curl.exe -sSI https://ttf-vasan.netlify.app/assets/js/main.js | Select-String -Pattern 'HTTP/|x-content-type-options|referrer-policy'
```

### Pinned icon script

```powershell
curl.exe -sSI "https://unpkg.com/lucide@1.70.0/dist/umd/lucide.min.js" | Select-String -Pattern 'HTTP/|access-control-allow-origin|cache-control'
```

Expected: `HTTP/2 200`, `access-control-allow-origin: *` (needed for SRI with `crossorigin`).

## 4. Browser verification

Open each page and keep DevTools open:

- [ ] `index.html`
- [ ] `about.html`
- [ ] `biography.html`
- [ ] `news.html`
- [ ] `videos.html`
- [ ] `privacy.html`
- [ ] `404.html` (visit a non-existent path)

For each page, confirm:

- [ ] Console shows no `Refused to load...` or `Content Security Policy` violations.
- [ ] Icons render (Lucide loaded successfully).
- [ ] Fonts load correctly.
- [ ] Images render.
- [ ] Navigation and mobile menu work.
- [ ] Gallery modal opens; thumbnails and source links work.
- [ ] YouTube embeds load from `www.youtube-nocookie.com`.
- [ ] No mixed-content warnings.
- [ ] `site.webmanifest` loads without errors.

If a CSP violation appears, identify the blocked URL and add the narrowest possible source to `_headers`. Do not add `'unsafe-inline'` to `script-src`.

## 5. Optional external header checks

These public scanners are optional. They send the public URL to a third party.

- [ ] `https://securityheaders.com/?q=https://ttf-vasan.netlify.app/`
- [ ] `https://developer.mozilla.org/en-US/observatory/analyze?url=https://ttf-vasan.netlify.app/`

Treat scanner output as advisory. The CSP intentionally allows Google Fonts, one pinned Lucide file, and YouTube frames.

## 6. Rollback

If the deploy causes a regression:

1. Netlify dashboard → **Deploys**.
2. Select the last known-good deploy.
3. Choose **Publish deploy**.

For repository rollback, see `SECURITY_CHANGELOG.md`. Do not use `git reset --hard` unless you also intend to discard the staged folder reorganization.

## 7. Ongoing maintenance

- [ ] Never reintroduce `@latest` for a third-party script.
- [ ] When updating Lucide, download the exact new version, compute a new SHA-384 hash, update every page, and update the CSP path.
- [ ] When adding a new external origin, update the CSP narrowly and document why.
- [ ] Keep Google Fonts and YouTube references disclosed on the privacy page.
- [ ] If a custom domain is added, re-check HTTPS and HSTS.
- [ ] Before making the repository public or sharing it, scan the full git history with `gitleaks` or `trufflehog`.
- [ ] If a build tool is introduced later, add a lockfile, run `npm audit`, and enable Dependabot or an equivalent update process.
- [ ] If any credential is ever committed, rotate it first, then remove it from history.

## 8. Incident response quick reference

If the site is defaced, redirects unexpectedly, or loads unexpected scripts:

1. Roll back to the last known-good Netlify deploy.
2. Inspect the repository diff and recent commits.
3. Verify the Lucide SRI hash still matches the pinned file.
4. Check Netlify deploy logs and team access.
5. Rotate any credentials that could have been exposed (none are used by this static site today).
6. Re-deploy only after the cause is identified.
