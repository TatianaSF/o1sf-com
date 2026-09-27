---
name: o1sf-publish
description: Publish O1SF.com changes using the established GitHub -> Next.js static export -> Hostinger -> Cloudflare workflow. Use for O1SF production releases, TatianaSF Assistant deployment, Hostinger backup/deploy, release validation, and post-deploy smoke tests. Reuse the documented architecture and do not perform a new infrastructure inventory unless the architecture is demonstrably stale or the project owner explicitly asks for an audit.
metadata:
  priority: 9
  pathPatterns:
    - 'app/**'
    - 'components/**'
    - 'public/**'
    - 'next.config.js'
    - 'package.json'
    - 'package-lock.json'
    - 'PRE_PUBLISH_CHECKLIST.md'
  bashPatterns:
    - '\\bnpm\\s+ci\\b'
    - '\\bnpm\\s+run\\s+lint\\b'
    - '\\bnpm\\s+run\\s+public-safety\\b'
    - '\\bnpm\\s+run\\s+build\\b'
    - '\\bgit\\s+push\\b'
    - '\\bssh\\s+hostinger-o1sf\\b'
---

# O1SF Publish

Use this skill for normal O1SF.com publishing and production deployment work.

## First rule

Read `references/o1sf-publishing.md` before planning or executing an O1SF release.

Treat that reference as the established architecture. Do not start a new repository, route, Hostinger, Cloudflare, or deployment inventory during a normal release.

A new infrastructure audit is justified only when one of these is true:

- the documented repository, branch, build output, SSH alias, or production root no longer exists;
- a clean tracked build cannot produce a documented required route;
- deployment behavior contradicts the reference;
- Next.js is no longer using static export;
- Hostinger or Cloudflare architecture materially changed;
- `public/.htaccess` behavior materially changed;
- the project owner explicitly asks for an audit.

If one of those conditions occurs, report `ARCHITECTURE DRIFT` and the exact contradiction. Do not silently expand a small publish task into a broad audit.

## Standard release workflow

For a normal O1SF change:

1. Start from current `origin/main` or a clean temporary worktree based on it.
2. Apply only the requested change.
3. Preserve unrelated uncommitted work. Never reset, stash, revert, or include unrelated files without explicit instruction.
4. Run the standard validation commands:

```bash
npm ci
npm run lint
npm run public-safety
npm run build
```

5. Confirm the affected route/file exists in `out/` and required referenced assets exist.
6. Read the tracked `PRE_PUBLISH_CHECKLIST.md`.
7. If there is an explicit `BLOCKED` condition, stop before deployment and report it.
8. If the policy status is `WARNING`, disclose active warnings and continue unless the checklist itself says otherwise.
9. Commit only task-related files.
10. Push normally to `origin/main`. Never force push for a routine release.
11. Rebuild from the pushed `origin/main` when the task requires a production release.
12. Create a recoverable Hostinger backup before activating a full production release.
13. Deploy the validated static export using the existing Hostinger SSH workflow.
14. Run a targeted production smoke test for the affected behavior.
15. Report the commit, push, backup, deployment, smoke result, active warnings, and remaining limitations.

## Validation scope

Use the smallest validation scope that proves the requested change is safe.

Do not automatically:

- repeat the full historical Assistant regression suite;
- compare hundreds of generated Next.js hash files;
- inventory every production file;
- run broad SEO checks;
- run dependency remediation;
- add unrelated test gates;
- audit Android or LinkedIn in-app browser behavior unless requested or directly relevant.

Generated Next.js hash names may differ between builds. This alone is not a defect.

## Git safety

For normal publishing:

- source repository: `TatianaSF/o1sf-com`;
- primary branch: `main`;
- stage only task-related files;
- do not force push;
- do not commit secrets or private input;
- do not include unrelated dirty-worktree changes;
- prefer a clean temporary worktree if the main worktree is dirty.

If a clean build depends on an untracked source file, stop and report the missing source-of-truth problem instead of deploying an unreproducible release.

## Build model

O1SF uses Next.js static export.

Normal build artifact:

```text
out/
```

Production is static. Do not assume a runtime Next.js application server exists on Hostinger.

Deploy generated HTML, route data, JavaScript, CSS, JSON, images, and the tracked production `.htaccess` from the same validated release.

## Production deployment

Use the existing Hostinger SSH path documented in the reference.

Before full activation:

- ensure the final clean build passed;
- ensure the affected required routes are present;
- ensure no private input is present in the release;
- ensure `PRE_PUBLISH_CHECKLIST.md` has no explicit release-blocking condition;
- create and verify a recoverable backup.

Do not invent a new deployment mechanism during a normal release.

Route-scoped deployment is an exception, not the default. Use it only when the full tracked baseline is known to be unsafe or when the owner explicitly asks for a limited deployment.

## TatianaSF Assistant releases

Production routes:

```text
https://o1sf.com/tatianasf/assistant
https://o1sf.com/tatianasf/assistant?ru
```

The Russian version is query-param based and intentionally has no visible language selector.

For a small Assistant change, test only the affected flow plus route/asset availability unless the change touches shared workflow state or the user requests a broader regression.

Do not alter Assistant business logic, budget logic, copy, language behavior, or external URLs unless the task explicitly requires it.

## Ask Document releases

Never commit or deploy private Ask Document input.

The public sanitized knowledge artifact may be deployed only after the tracked `public-safety` check passes.

Do not redesign the Ask Document generation architecture during an unrelated release.

## Stop conditions

Stop before production deployment when any of these is true:

- `npm ci` fails;
- `npm run public-safety` fails;
- `npm run build` fails;
- a required affected route is missing from `out/`;
- private data would be included in the release;
- the tracked release policy has an explicit `BLOCKED` condition;
- the clean build depends on untracked source required at runtime/build time;
- the documented production architecture is contradicted by current reality.

Warnings that are not marked as blockers by the tracked policy should be disclosed, not automatically escalated into a new audit.

## Reporting format

Use a compact release report:

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

For analysis-only tasks, omit commit/deploy fields or mark them `NOT PERFORMED`.
