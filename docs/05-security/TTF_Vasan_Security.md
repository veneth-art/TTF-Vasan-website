# Antigravity AI Prompt — High-Level Security Audit & Hardening
## Project: TTF Vasan Unofficial Fan Website
## Live deployment: https://ttf-vasan.netlify.app/

You are acting as a senior application security engineer and frontend security reviewer. Audit and harden this existing website for safe public deployment on Netlify.

Your job is to inspect the actual project, identify real risks, implement safe fixes, and verify the result. Do not merely add generic security headers or claim the website is secure without evidence.

## 1. Non-negotiable rules

1. **Inspect before changing anything.** Read the project structure, source files, package manifests, build scripts, Netlify configuration, redirects, headers, forms, API calls, embeds and deployment settings.
2. Preserve the existing website's design, content, routes, responsive behavior and functionality unless a change is required to fix a security issue.
3. Do not invent vulnerabilities. Separate confirmed findings from potential risks and items that could not be tested.
4. Do not run destructive commands, delete user content, replace project configuration wholesale, or make production changes without explaining the impact and asking for approval.
5. Never print, copy into reports, commit, or expose secret values. If a secret is found, report only its filename/location and a masked description. Recommend rotation if it may have been exposed.
6. Do not put private API keys, tokens, passwords or service credentials in frontend JavaScript, HTML, public environment variables, Git history or client-side build output.
7. Do not test third-party systems, attempt account access, brute-force, scan unrelated infrastructure, or perform denial-of-service testing. Limit checks to this project and its own authorized deployment.
8. Do not claim that a check passed unless you actually ran it and can show the evidence.
9. If the site is static and has no backend, explain which backend protections do not apply rather than pretending they were implemented.
10. Keep an untouched backup or use a separate Git branch before applying changes. Show the proposed change list first.

## 2. Threat model and scope

Treat this as a public, mostly static fan website hosted on Netlify. Confirm the actual architecture rather than assuming it.

Review these areas:

### A. Secrets and configuration
- Search source files, built assets and configuration for likely API keys, access tokens, private keys, passwords, webhook URLs and credentials.
- Check whether `.env`, `.env.*`, backups, archives, editor files, source maps or private configuration could be published.
- Check `.gitignore` and Netlify publish/build settings.
- Distinguish public identifiers from genuine secrets.
- Do not expose secret values in terminal output or the final report.
- If a credential was committed or deployed publicly, advise immediate revocation/rotation; deleting it from the current file is not enough.

### B. Cross-site scripting (XSS) and unsafe rendering
- Find `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, unsafe template rendering and dynamic HTML construction.
- Trace any content sourced from URL parameters, query strings, local storage, external APIs, forms or user input.
- Prefer `textContent`, safe DOM APIs and context-appropriate output encoding.
- If rich HTML is genuinely required, use a maintained sanitizer and configure it narrowly.
- Validate URL schemes before using values in `href`, `src`, redirects or embed URLs. Reject `javascript:` and other unsafe schemes.
- Check `target="_blank"` links and add `rel="noopener noreferrer"` where appropriate.

### C. Content Security Policy and security headers
- Inspect existing response headers on the deployed site and existing Netlify `_headers` configuration.
- Propose a Content Security Policy that matches the website's actual scripts, styles, fonts, images, video embeds and required external services.
- Prefer a restrictive policy. Avoid `unsafe-eval`; avoid `unsafe-inline` where feasible. If inline code currently exists, explain safer options such as moving it to files or using nonces/hashes where the hosting architecture supports them.
- Do not apply a policy that breaks YouTube embeds, fonts, images or site functionality. Test it first in report-only mode where practical, then recommend enforcement.
- Review these headers where applicable:
  - `Content-Security-Policy`
  - `Strict-Transport-Security`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy`
  - `Permissions-Policy`
  - `X-Frame-Options` or CSP `frame-ancestors`
- Avoid conflicting or duplicated headers across Netlify configuration.
- Set HSTS only after confirming HTTPS works correctly for the domain and its subdomains. Do not add `preload` without verifying eligibility and understanding the irreversible operational implications.
- Do not use `X-Frame-Options: SAMEORIGIN` blindly if the site is intentionally embedded elsewhere; explain the trade-off.

### D. Third-party embeds and external resources
- Review YouTube iframe embeds, social links, external scripts, analytics, fonts and other third-party resources.
- Use the minimum required permissions in iframe `allow` attributes.
- Add an appropriate iframe `title`, `loading="lazy"` where suitable, and a restrictive `referrerpolicy`.
- Consider `youtube-nocookie.com` for privacy-enhanced YouTube embeds when compatible.
- Do not load unknown scripts or add new third-party services just for security.
- Check external links and ensure they use HTTPS where supported.

### E. Forms, inputs and redirects
- Find all forms and user-controlled inputs.
- Check client-side validation and whether any form submits to a real backend or third-party service.
- Explain clearly that client-side validation alone is not security; server-side validation and rate limiting are needed wherever a backend receives data.
- Check for open redirects, unsafe URL construction, spam exposure and accidental collection of personal data.
- Do not add a fake form success message or claim that a form is protected if no backend exists.
- If no form or backend exists, mark the relevant controls as not applicable.

### F. Dependencies and build process
- Identify the framework, package manager and lockfile.
- Run the appropriate dependency audit using the project's package manager, if available.
- Report vulnerable direct and transitive dependencies, affected versions and safe upgrade options.
- Do not run blanket major-version upgrades. Check compatibility and test after changes.
- Review build scripts and plugins for suspicious or unnecessary behavior.
- Do not install packages without explaining why they are needed.

### G. Netlify-specific configuration
- Inspect `netlify.toml`, `_headers`, `_redirects`, build command, publish directory and functions if present.
- Check for overly broad redirects, exposed function endpoints, unsafe rewrites and accidental publication of non-public files.
- Verify that security headers are applied to all relevant routes and assets.
- Do not assume a `_headers` file works unless it is in the effective publish directory and verified in the deployed response.
- Do not expose Netlify access tokens or deploy credentials.
- Explain any dashboard-only settings that cannot be verified from the repository.

### H. Privacy and data handling
- Check whether the website collects names, email addresses, phone numbers, analytics identifiers or other personal information.
- Minimize data collection and avoid storing sensitive information in local storage.
- Check cookie and analytics behavior where applicable.
- Recommend a clear privacy notice if the site collects personal data or uses tracking.
- Keep the website clearly identified as an unofficial fan-made project; do not imply endorsement by TTF Vasan or associated parties.

## 3. Required workflow

Follow these stages in order:

### Stage 1 — Inventory
Provide:
- Project framework and architecture.
- Build command and publish directory.
- Routes/pages and interactive features.
- Forms, API calls, third-party embeds and dependencies.
- Existing security configuration.
- Files or settings that could not be inspected.

Do not modify files during this stage.

### Stage 2 — Audit
Create a findings table with:
- ID
- Severity: Critical / High / Medium / Low / Informational
- Status: Confirmed / Potential / Not tested / Not applicable
- File and line number, or deployed URL/path
- Evidence
- Impact
- Recommended fix

Prioritize exploitable issues. Do not inflate severity for missing optional headers without considering the actual threat model.

### Stage 3 — Remediation plan
Before editing, list each proposed change and:
- Why it is needed.
- Which files/settings it affects.
- Whether it could affect the design or functionality.
- How it will be tested.
- Whether it requires my approval or a Netlify dashboard action.

Wait for approval before risky, destructive, credential-related or production-impacting changes.

### Stage 4 — Implement approved fixes
- Make the smallest safe changes.
- Preserve the visual design and content.
- Add or update Netlify security headers and CSP based on actual dependencies.
- Fix unsafe DOM rendering and URL handling.
- Remove accidental exposure of private files from the publish output.
- Update dependencies only when justified.
- Add comments for non-obvious security configuration.
- Never put secrets in frontend code.

### Stage 5 — Verification
Run the available checks:
- Production build.
- Dependency audit.
- Search for secret patterns without printing secret values.
- Search for unsafe HTML sinks and review their data sources.
- Check routes, links, forms and embeds.
- Test responsive layout and key website interactions.
- Verify security headers on the deployed site if authorized and technically possible.
- Check that CSP does not block required resources.
- Confirm no `.env`, credentials, backups or private files are included in the publish output.

If you cannot access the live deployment, browser, terminal or Netlify dashboard, say so clearly and provide the exact manual verification steps. Do not simulate results.

## 4. Deliverables

Create or update these project documents:

1. `SECURITY_AUDIT_REPORT.md`
   - Executive summary
   - Scope and limitations
   - Architecture inventory
   - Findings with evidence and severity
   - Confirmed fixes
   - Remaining risks
   - Manual checks required

2. `SECURITY_CHANGELOG.md`
   - Every file changed
   - What changed and why
   - Tests run and results
   - Any rollback notes

3. `NETLIFY_SECURITY_CHECKLIST.md`
   - Required Netlify configuration
   - Dashboard-only settings to verify
   - Deployment verification steps
   - Secret rotation actions, if applicable

4. `IMAGE_ASSET_MANIFEST.md` — preserve the existing file if present.
   - Do not weaken the project's image identity, rights or authenticity requirements while changing security configuration.

## 5. Final report format

At the end, summarize:

- Overall status: Not audited / Audit in progress / Fixes implemented / Verified with limitations.
- Critical findings.
- High findings.
- Medium and low findings.
- Fixes implemented.
- Tests actually run and their results.
- Items that still need my action.
- Whether a new Netlify deployment is required.

Do not use the phrase **“100% secure”** or guarantee that the website cannot be hacked. Security is risk reduction, not a guarantee.

## 6. Start now

Start with **Stage 1 — Inventory** and **Stage 2 — Audit only**. Do not modify files or deploy anything yet. Show me the findings and remediation plan first, then wait for my approval.
