# Learnings — promotions.bankofamerica.com replica (2026-11-13)

### Sanitised delivery paths break path-keyed checks
- failure class: path-safety
- evidence: the six `/content/experience-fragments/consumer_marketing/…` pages deploy at `consumer-marketing`; coverage kept the source path, so `assemble.mjs --verify-origin` reported 6 missing, the runner's live probe reported them not live, and `scripts/modals.js` fetched 404 `.plain.html` for underscore hrefs. Fixed by hand: coverage `path` = delivered path (`sourcePath` kept), redirects rows for both `.html` and extensionless underscore forms, modal path normalisation.
- proposed change: `rollout/scripts/inventory.mjs` — write `path` through `eds-path.mjs` (keep `sourcePath`); `seed-redirects.mjs` — also emit the extensionless source form when a segment is sanitised.
- status: pending

### Folder-form migrated file makes verify probe a trailing-slash URL
- failure class: silent-render
- evidence: `stardust/migrated/en/offers/chooseyourchecking500tiered/index.html` → `publicUrl()` appended `/` → verify.mjs HTTP 404 on a page that serves 200 extensionless. Moved to `…/chooseyourchecking500tiered.html`.
- proposed change: `migrate/scripts/migrate.mjs` — emit `<path>.html` unless the source URL itself ends in `/`; or `rollout/scripts/lib.mjs publicUrl()` — add the slash only when the source URL had one.
- status: pending

### Fragment-only pages fail the page-level h1 rule
- failure class: dynamic-gap
- evidence: six source experience fragments (dialog content, first heading h2, source has 0 h1) → verify.mjs "found 0 <h1>" and optimize P1 seo/single-h1 ×6. verify honours `delivery.type: fragment`; optimize does not, and its source-parity tagging does not cover single-h1.
- proposed change: `rollout/scripts/optimize.mjs` — skip single-h1 for `delivery.type: fragment` and tag it source parity when the capture also has 0 h1; `inventory.mjs` — type modal-fragment templates as `fragment`.
- status: pending

### The pipeline renders a JSON-LD metadata row natively
- failure class: api-dependency
- evidence: autofix-aem marked eds-jsonld manual ("place via head.html"); a `JSON-LD` metadata row on /deposits/balanceconnect is served as `<script type="application/ld+json">` with no code change.
- proposed change: `rollout/scripts/autofix-aem.mjs` — fix eds-jsonld automatically by adding the source capture's JSON-LD as a metadata row and redeploying.
- status: pending

### Prototype pixel table skipped in recreate
- failure class: capture-gap
- evidence: `gates/prototypes-<w>/` did not exist at H-report although every archetype passed its per-archetype gate; written at H-report from the cached live captures.
- proposed change: `replica/SKILL.md` § Phase 4 — make the `--stage prototype` run a recorded step of the recreate `end` line (ledger.mjs refuses `recreate end` without the table).
- status: pending
