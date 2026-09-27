# O1SF.com Publishing Reference

## Purpose

This file is the established O1SF.com publishing and deployment handoff.

Use it to avoid repeating infrastructure discovery in every new chat, project, or Codex task.

Validated architecture was reconciled and fully deployed in September 2026. The repository baseline was made clean-build reproducible, the current production routes were restored to Git, and a full Hostinger deployment from a clean `origin/main` build completed successfully.

Historical validated baseline included commits through:

```text
2652b6c - Fix sections feed compatibility
```

That commit is a historical checkpoint only. Current `main` may be newer.

---

## 1. Source repository

GitHub repository:

```text
TatianaSF/o1sf-com
```

Primary production branch:

```text
main
```

Normal Git flow:

```text
origin/main
-> clean worktree
-> validate
-> focused commit
-> push to origin/main
-> final clean build
-> Hostinger backup
-> Hostinger deployment
-> production smoke test
```

Do not force push for routine releases.

When the user's main worktree contains unrelated changes, prefer a clean temporary worktree rather than resetting or stashing the user's work.

---

## 2. Application architecture

Framework:

```text
Next.js 16
React 19
App Router
```

Deployment model:

```text
Next.js static export
```

Build output:

```text
out/
```

There is no runtime Next.js application server required for the normal O1SF production site.

Production consists of generated static HTML, RSC/static route payloads, JavaScript, CSS, JSON, images, and Apache configuration.

---

## 3. Production architecture

Traffic path:

```text
Browser
-> Cloudflare
-> Hostinger
-> static O1SF files
```

Cloudflare is the CDN/cache layer in front of Hostinger. It is not the application host.

Hostinger SSH alias used by the existing workflow:

```text
hostinger-o1sf
```

Production document root:

```text
/home/u625840324/domains/o1sf.com/public_html
```

Do not put credentials, private keys, passwords, or tokens into this skill or repository documentation.

---

## 4. Backups

Create a recoverable backup of current `public_html` before a full production activation.

Existing releases use timestamped backups under the O1SF Hostinger domain area.

A previous successful release used a pattern equivalent to:

```text
/home/u625840324/domains/o1sf.com/backups/o1sf-public_html-<timestamp>.tar.gz
```

Exact timestamp varies per release.

Verify backup creation before replacing production.

---

## 5. Standard build commands

Normal clean validation:

```bash
npm ci
npm run lint
npm run public-safety
npm run build
```

These commands were used for the reconciled production baseline.

Do not automatically add historical validation commands that are not present in the current tracked `package.json`.

Do not run `npm audit fix` as part of an unrelated publish task.

Dependency remediation is a separate maintenance task unless explicitly requested.

---

## 6. Release policy

Tracked release-governance file:

```text
PRE_PUBLISH_CHECKLIST.md
```

The approved policy was changed from a global `BLOCKED` model to a `WARNING` model.

Operational rule:

- read the tracked checklist before production deployment;
- disclose active warnings in the release report;
- warnings do not automatically block publication;
- an explicit `BLOCKED` condition does block publication;
- do not silently bypass legal, security, contractual, platform, or explicit checklist blockers.

Do not re-litigate the historical BLOCKED/WARNING migration during routine releases unless the tracked policy changes again.

---

## 7. Production Apache configuration

Tracked source:

```text
public/.htaccess
```

During the production-baseline reconciliation, the intended local `public/.htaccess` was confirmed to match the live Hostinger production `.htaccess`, then included in the tracked full-site baseline.

It covers production-specific behavior including relevant redirects, aliases, static route handling, cache/header rules, and recovery behavior.

Do not rewrite or simplify `.htaccess` during a normal unrelated release.

If a task explicitly changes routing, cache policy, CSP, headers, or legacy aliases, treat that as a configuration change and validate the affected behavior.

---

## 8. Known public routes

The reconciled full-site baseline included the current intended routes and machine-readable endpoints.

Important routes include:

```text
/
/tatianasf
/tatianasf/assistant
/tatianasf/assistant?ru
/ask_document/
/methodology
/pricing
/program
/resources
/923hy
/pages.json
/sections.json
/profile.json
/llms.txt
/robots.txt
/sitemap.xml
/clear-site-data.html
```

The site also contains current `/resources/*` pages and `/923hy` child pages.

`/sections.json` is a compatibility/legacy path and production behavior redirects it to `/pages.json`.

Do not perform a complete route inventory for every small release. Verify the affected route and shared site health appropriate to the scope.

---

## 9. TatianaSF Assistant

Production route:

```text
https://o1sf.com/tatianasf/assistant
```

Hidden Russian variant:

```text
https://o1sf.com/tatianasf/assistant?ru
```

The Russian version is query-param driven. There is intentionally no visible language selector.

Main source files:

```text
app/tatianasf/assistant/page.jsx
components/tatianasf-assistant/TatianaAssistant.jsx
components/tatianasf-assistant/workflow.js
components/tatianasf-assistant/messages.js
components/tatianasf-assistant/TatianaAssistant.module.css
```

Route-specific site-chrome behavior is handled through:

```text
components/SiteChrome.jsx
```

The Assistant is deterministic/client-side. It does not require an LLM or API at runtime.

Important external destinations:

LinkedIn:

```text
https://www.linkedin.com/in/tatianasf
```

Events search:

```text
https://www.google.com/search?q=TatianaSF+lu.ma
```

Prefer real HTML `<a>` links for simple external navigation instead of embedding external navigation inside workflow-state logic.

---

## 10. TatianaSF Assistant release history relevant to reliability

The Assistant baseline was repaired so its source became reproducible from Git.

Important historical fixes included:

- restoring missing tracked `workflow.js`;
- excluding the Assistant route from normal site chrome;
- synchronizing dependency lock state so `npm ci` works from a clean checkout;
- preserving workflow state when using `Change this answer`;
- hydration-safe handling of the hidden `?ru` variant;
- routing no-budget partnership users to the existing no-budget outcome;
- full clean-build validation and production deployment.

Do not repeat those historical investigations unless the same defect is actually reproduced again.

---

## 11. Ask Document

Public route:

```text
https://o1sf.com/ask_document/
```

Private input must never be committed or deployed.

The reconciled production model includes a sanitized public knowledge JSON artifact that is safe for client consumption.

Normal publishing requirements:

- private input is absent from the release;
- sanitized public JSON exists when required by the route;
- `npm run public-safety` passes;
- the page and public JSON load successfully after deployment when the release touches Ask Document.

Do not redesign Ask Document knowledge generation during unrelated releases.

---

## 12. Full-site deployment

The full-site baseline was reconciled specifically so a normal clean `origin/main` build could be deployed as a complete static release.

Standard full release:

```text
clean origin/main
-> npm ci
-> npm run lint
-> npm run public-safety
-> npm run build
-> verify required affected outputs
-> read release checklist
-> focused commit/push if needed
-> final clean build from pushed main
-> Hostinger backup
-> deploy complete out/
-> deploy tracked .htaccess
-> smoke test
```

Deploy HTML and generated static chunks from the same build.

Do not preserve obsolete Next.js hashed chunks solely because their names differ from the previous release.

---

## 13. Route-scoped deployment

A route-scoped Hostinger deployment was used temporarily when the tracked repository baseline was incomplete.

After reconciliation and the successful full-site deployment, route-scoped publishing should be treated as an exception.

Use route-scoped deployment only if:

- a future audit proves the full tracked baseline unsafe;
- or the project owner explicitly requests a limited deployment.

Do not default to route-scoped publishing simply because it was used historically.

---

## 14. Production smoke-test strategy

Use targeted smoke testing.

For a small page or Assistant change:

- verify affected production URL returns successfully;
- verify required assets load;
- exercise the changed behavior once;
- verify no obvious production regression related to that change.

For a full-site release, useful smoke routes include:

```text
/
/tatianasf
/tatianasf/assistant
/tatianasf/assistant?ru
/ask_document/
/methodology
/pricing
/program
/resources
/923hy
/pages.json
/profile.json
/llms.txt
/robots.txt
/sitemap.xml
/clear-site-data.html
```

Do not automatically repeat every historical regression flow.

A specific signed-in Chrome profile is not required to test public O1SF pages. Public Assistant and Ask Document browser behavior can be tested in any clean browser context unless a task actually depends on authenticated Google/LinkedIn state.

---

## 15. What not to redo during ordinary publishing

Do not automatically repeat:

- the 395-file production inventory;
- full production-vs-export file comparison;
- generated Next.js chunk-by-chunk diffing;
- the historical `workflow.js` source-control investigation;
- the historical package-lock reconciliation investigation;
- the historical BLOCKED vs WARNING policy investigation;
- complete Assistant regression testing for an unrelated one-line change;
- SEO investigation;
- dependency vulnerability remediation;
- Android/LinkedIn in-app browser QA;
- infrastructure architecture discovery.

These are separate tasks unless directly relevant to the requested change.

---

## 16. Architecture drift guard

Treat this reference as current unless a concrete contradiction appears.

Trigger a new infrastructure/repository audit only if:

1. `TatianaSF/o1sf-com` is no longer the repository;
2. `main` is no longer the production branch;
3. `out/` is no longer the deployment artifact;
4. Next.js no longer uses static export;
5. `hostinger-o1sf` or the production document root changed;
6. Cloudflare is no longer in front of Hostinger;
7. clean `origin/main` no longer produces required production source/routes;
8. tracked `.htaccess` is no longer the intended production configuration;
9. the project owner explicitly requests a new audit.

When drift is found, report the exact failed assumption before broadening scope.

---

## 17. Secrets and private information

This reference intentionally includes architecture paths but no credentials.

Never add:

- SSH private keys;
- passwords;
- API secrets;
- tokens;
- private Ask Document source;
- private customer/user data;
- local credential files.

Use existing configured connections/SSH aliases without exposing their secret material.

---

## 18. Recommended final release report

```text
CHANGE:
FILES MODIFIED:
VALIDATION:
POLICY STATUS:
EXPLICIT BLOCKED CONDITION: YES/NO
COMMIT:
PUSH:
HOSTINGER BACKUP:
DEPLOYMENT:
PRODUCTION SMOKE TEST:
ACTIVE WARNINGS:
RELEASE STATUS:
REMAINING LIMITATIONS:
```

Keep the report focused on the release that was actually requested.
