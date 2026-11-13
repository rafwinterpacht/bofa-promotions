# Journal — promotions.bankofamerica.com replica

## Extract — 12 records captured, home absent on source (2026-11-13)
- crawl.mjs --pages (the 14 plan URLs) --dynamics, real Chrome headless: 7 pages OK.
- `/` → `/index.html` → BofA error page (404): the source has no home page. Recorded as `site.sourceNotFound`; nothing synthesized.
- `/en/offers/chooseyourchecking500tiered.html` is the same page as the extensionless URL (crawler DUP) → alias, one state row.
- The 6 experience-fragment URLs 302 to the BofA error page on direct navigation; they are modals loaded on click from `/services/consumer-marketing/modalitem.xf_path.<path>` (JSON `rteMarkup`). Captured by clicking each link on the offer page in Playwright (records `kind: modal-fragment`, `serviceJson`, modal crops at 1440/360).
- Census (6 pages × 1440/360), cap-probe (module cap 1440, fluid shell), module candidates from AEM wrapper classes.
- Types: landing (offer), unique (deals), program (4 deposit pages), static (6 modal fragments).
- Consent: OneTrust, dismiss with `.onetrust-close-btn-handler`.

## Preserve direction — verbatim promotion, empty register, dynamics triaged (2026-11-13)
- current/PRODUCT.md, DESIGN.md, DESIGN.json promoted verbatim to the root; DESIGN.json added to .hlxignore.
- Register empty (pure replica). No target breakpoints.
- dynamics-detect on the 3 archetypes (41 findings) → dynamics-plan --martech → curated dynamic-features.md + plan: modal-loader for the six offer fragments, chrome exit-notice modal, tags carried off via martech-contract.json (OneTrust, Tealium, 2 gtag routes, all disabled).
- Publish decision recorded in eds-conversion-log.md.

## Recreate — landing archetype gated (2026-11-13)
- en-offers-chooseyourchecking500tiered: 1440 0.89% / Δ−1px, 360 7.12% / Δ−3px; content-diff clean; clip 0; overflow ok; cap-probe PASS. Canon (canon.css, fonts, header/footer, exit + fragment modals) authored here.
- Live captures need the site's CSP bypassed in the measuring browser (style injection blocked): preload stardust/replica/gates/bypass-csp.cjs via NODE_OPTIONS on every live instrument (both sides symmetric).

## Recreate — static (modal fragment) archetype gated (2026-11-13)
- Fragment URLs are not navigable; gated with a click-open probe of the live modal vs the prototype dialog + pixel-compare: 1440 0.27% / Δ0, 360 0.13% / Δ0; content byte-identical to rteMarkup. Modal rules back-ported into canon.css (all six fragments then match live, Δh 0).

## Recreate — program archetype gated (2026-11-13)
- deposits-growyoursavings: 1440 0.15% / Δ−1, 360 0.17% / Δ−1; content-diff clean; clip 0; cap-probe PASS. Canon back-port requests queued in stardust/rollout/foundation-requests.md.

## Recreate — unique (deals) archetype gated; all four archetypes done (2026-11-13)
- en-deals: 1440 0.35% / Δ−1, 360 2.74% / Δ−2; content-diff clean; clip 0; cap-probe PASS. Motion: carousel + accordion implemented.
- All archetypes approved hands-off: landing, static, program, unique.

## source-fidelity-gate — all four archetypes pass at 1440 and 360 (2026-11-13)
- Numbers per archetype are in the ledger end line and stardust/replica/progress.json; every live instrument ran with the CSP-bypass preload (symmetric).

## A-inventory — 4 archetypes rendered and inventoried, 8 siblings content-pending (2026-11-13)
- migrate.mjs render (archetype tier, from approved prototypes): landing, unique en-deals, program growyoursavings, static plus-2026-modal → stardust/migrated/; siblings NOT rendered (they wait for their archetype's C-archetype gate). modules[] set per sidecar from the prototype section ids (text-only long-form sections = default content; header/footer = chrome).
- inventory.mjs --state: 12 pages (4 pending, 8 content-pending), 4 templates. Siblings keyed to their archetype via state.json pages[].representative (type alone grouped them as "program"/"static" with no blocks). rollout.json site: da aemcoder/78f2fb76@main, liveHost main--78f2fb76--aemcoder.aem.live.
- stardust/redirects.tsv: 14 rows — / and /index.html → /en/offers/chooseyourchecking500tiered (source root has no page: 302 → BofA 404), the landing .html alias, and every planned .html URL → its extensionless EDS path (consumer_marketing folds to consumer-marketing). Coverage paths still carry consumer_marketing: delivery-lint path-safety must fold them at C-deliver.

## B-block — 18 distinct blocks, representative-first plan (2026-11-13)
- blocks.mjs: 16 module blocks + header/footer chrome, 46 instances → 18 conversions; masthead shared landing/program (converted on growyoursavings, reused on landing), modal-dialog ×6.
- plan.mjs: 12 pages / 4 templates, each block converts once; stardust/rollout/plan.json.

## B2-dynamic — dynamics plan re-run, no new findings; martech scaffolded all-disabled (2026-11-13)
- dynamics-plan.mjs --target-origin preview --martech: 41 rows (self 24, owner batch 15, host-bound 3/3), identical to the previous draft — stardust/dynamic-features.md curated dispositions kept, no rows added. martech-contract.json regenerated unchanged (all parts disabled).
- martech-scaffold.mjs: scripts/martech.js written (no CMP, 0 routes enabled) and hooked into scripts/scripts.js (loadConsent in loadEager, loadTags in loadDelayed); nothing enabled — owner decision.

## C-deliver — foundation authored locally, deploy pending (2026-11-13)
- C0 authored styles/, fonts/ (+LICENSING.md), favicon, icons, header/footer blocks, scripts/modals.js (fragment + exit-notice dialogs), runtime-contract.json, chrome docs content/{nav,nav-deposits,nav-debitcard,nav-balanceconnect,nav-deals,footer,modals/*}.html. Lint ok. 8/9 foundation requests applied (accordion left for its cluster).
- No DA token available in this session: PUT/preview/publish, the foundation-first gate and foundation-freeze are the next steps.

## C-deliver — cluster-program done: three deposit siblings pass the published-origin gate (2026-11-13)
- Resumed mid fix-round. Gate-all rows (state copy + CSP bypass) started at 1440 9.32/8.94/26.93% and 360 24.4/17.08/25.33% (balanceconnect/cd-ira/debit overview).
- Four measured fix rounds (measure.mjs box deltas, both sides): masthead.large 48px mobile + short paragraph gap; long-form cta-band/red mobile headings and full-width CTA; inline features icon-left at all widths; features item flow-root (icon margin collapse, -16px); product-details.plain label-less tab bar; banner.large 56/63 + 50/60px gap; pcard.compact list/CTA metrics; tiles gray/wide-copy; content-tile.app band paddings; debit features mobile carousel (multi-step-content `carousel` variant, arrows + dashes).
- Final rows (fresh captures): 1440 8.38/9.68/9.91%, 360 7.24/7.87/9.47%; clipped 0, missing 0. Archetype pages untouched (variants only on siblings).

## C-deliver — gate-all: roster published-origin gate, 12/12 delivered (2026-11-13)
- gate-all over all 12 delivered pages (state copy with every page deployed, CSP bypass, --skip-existing): 6 page rows PASS at both widths (worst 9.91% / 9.47%, debit card overview).
- The 6 modal-fragment rows fail only because the source fragment URL 302-loops, so the origin side falls back to the crawl full-page shot; documented in gates/all-<w>/overrides.json with the dialog-probe evidence (archetype 0.37/0.19%, cluster worst 0.79/2.78%). update-coverage --gate: 12/12 rows matched.

## C-deliver — final: queued foundation requests applied once, foundation re-frozen (2026-11-13)
- `foundation-freeze.mjs check` clean (27 files). Applied once: fragment-path normalization in scripts/modals.js (`consumer_marketing` → `consumer-marketing`, lower-case) and a global `a:any-link:has(> sup)` underline reset in styles/styles.css; block-level overrides (modal h2, disclosures, per-block sup rules) kept as shipped. Non-foundation requests (debit-card app widget, out-of-scope video modals, variant classes) recorded, no action.
- Both changes are redundant with or narrower than the shipped block CSS, so the gate-all rows stand; a published re-gate of the landing/unique archetypes follows the code push. Next: D-site (redirects sheet incl. `consumer_marketing` → `consumer-marketing` fragment paths), then E–I.

## D-site — redirects sheet live, root answers, served sitemap 12 = assembled 12 (2026-11-13)
- Source `/` 302s to `/index.html` and then off-site to an error page, so the sheet carries `/` and `/index.html` → the offer landing page; `curl -sIL` on the aem.page and aem.live roots ends in 200. Sheet: 20 rows (14 seeded + 6 extensionless `consumer_marketing` → `consumer-marketing` fragment rows), PUT to DA, previewed and published.
- Coverage rows of the six fragments now carry the delivered (hyphenated) path, the source path kept as `sourcePath`; `assemble.mjs --verify-origin` exit 0. /nav and /footer (+ nav variants) already carry `Robots | noindex`.

## D2-dynamic — parity replay on the live origin: 6/6 checks pass (2026-11-13)
- Wrote stardust/dynamics/parity.json (terms modals, exit notice, no-page-errors over 6 pages, owner rows for the Spanish links and the debit-card app-link widget). `dynamics-check.mjs --origin …aem.live` exit 0: 3 offer dialogs + exit notice open with matching headings and close on Escape; martech gate: no tag host requested with every contract part off. No listings/search on these pages, so no query index.

## E-full-site — 12/12 verified on aem.live; archetypes re-gated after the foundation queue (2026-11-13)
- Re-gate (fresh EDS captures, cached origin) after the C-final foundation edits: landing 4.39% Δh-12 / 8.63% Δh17, deals 0.46% Δh1 / 2.11% Δh0 — identical to the recorded rows, all four criteria PASS.
- verify.mjs fixes: the landing page's migrated file moved from `…/chooseyourchecking500tiered/index.html` to `…/chooseyourchecking500tiered.html` (the folder form made verify probe a trailing-slash URL that 404s); the six pop-up rows typed `delivery.type: fragment` (dialog content, verbatim h2 first heading, no h1 by design); three debit-card links to pop-ups outside the 14-page plan repointed to the source site and redeployed (scope debt in direction.md). Final: 12 verified (6 page + 6 fragment), update-coverage --gate 12/12 matched, 0 flips.

## E2-link-audit — 13/13 internal targets 200 on aem.live; out-of-plan targets kept on the source (2026-11-13)
- `localize-links.mjs --check` PASS (0 localizable left). Every root-relative href in content/ (13 distinct, nav/footer included) GETs 200 on the live origin. Out-of-plan targets (Spanish pages, other offer/card pages, a PDF, three debit-card pop-ups) stay absolute to the source, listed in direction.md.

## F-optimize — gate clean: 0 open P1, health 95/100 (2026-11-13)
- First run: 6 P1 single-h1 on the six pop-up fragments + 1 P2 (balance connect lost the source's WebPage JSON-LD) + 11 source-parity P2 (no JSON-LD on the source either). The source fragments render 0 `<h1>` too, so the six P1 are accepted as source parity (findings.mjs resolve … accepted, note names the capture). Re-run: 0 open P1, 1 open P2 (JSON-LD → G-aem), seo 100, ai 90.

## G-aem — balance connect JSON-LD restored; optimize 100/100, 0 open (2026-11-13)
- autofix-aem dry run: 1 manual candidate (eds-jsonld). The source's WebPage JSON-LD was carried verbatim as a `JSON-LD` metadata row on /deposits/balanceconnect and redeployed (PUT → preview → live); the delivery pipeline renders it as `<script type="application/ld+json">` itself, so no code change (a scripts.js emitter was drafted and reverted; foundation unchanged). optimize re-run: health 100/100, P2 jsonld fixed; verify 12/12.

## H-report — 12/12 verified, 18/18 blocks, health 100; prototype table written (2026-11-13)
- Report at stardust/rollout/report.md (summary block + dynamic parity table + owner decisions). Block ledger: 10 blocks still `pending` though served → `update-coverage --block … deployed` (18/18). The prototype pixel table had never been written: gate-all --stage prototype at 1440/360 (cached live shots) → 3 PASS + the static row on the same documented override as its published rows. stardust/learnings.md: 5 pending entries.

## I-dashboard — rollout dashboard written; rollout complete (2026-11-13)
- dashboard.mjs → stardust/rollout/dashboard/{index.html,data.json}: 12 identified · 12 prototyped · 12 deployed · 1 optimised (balance connect JSON-LD). Rollout phases A–I all ended.

## Handoff — run complete: 12/12 pages live on aem.live, every gate closed (2026-11-13)
- Rollout A–I ended; done-check `complete: true`, no gaps. state.json: 12 migrated. Owner decisions carried in stardust/rollout/report.md: martech contract parts (all off), Spanish pages, debit card app-link widget, three out-of-plan debit-card pop-ups.
