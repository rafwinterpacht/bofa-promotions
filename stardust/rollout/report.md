# Rollout report — promotions.bankofamerica.com → aem-eds (2026-11-13)

```
rollout — promotions.bankofamerica.com → aem-eds (main--78f2fb76--aemcoder.aem.live)
==================================================
Pages       12 total · 12 verified · 0 deployed · 0 pending · 0 content-pending · 0 stale
Templates   4 — landing 1/1 · unique 1/1 · program 4/4 · static 6/6
Blocks      18 total · 18 converted/deployed · 0 pending
Quality     health 100/100 · open P1 0 / P2 0 / P3 0 (6 P1 accepted as source parity; 11 P2 source parity, informational)
Pixel table prototypes 4/4 delivered (3 PASS + 1 override; pixel-only 3/4) · deployed 12/12 delivered (6 PASS + 6 override; pixel-only 6/12) — gates/{prototypes,all}-1440/summary.md
To deliver  none
Content     0 pages awaiting content track
```

Overrides: the six modal-fragment rows (and the static prototype row) compare a crawl full-page shot on the origin side because
the source fragment URL redirect-loops; their gate is the dialog probe (archetype 0.37% / 0.19%, cluster worst 0.79% / 2.78%, Δh 0) —
`gates/all-<w>/overrides.json`, `gates/prototypes-<w>/overrides.json`.

Site: redirects sheet live (20 rows, `/` → offer landing page), served sitemap 12 = assembled 12, 13/13 internal link targets 200.
Published live (publish decision recorded in stardust/eds-conversion-log.md).

## Dynamic parity (stardust/qa/dynamics-report.md)

| feature | class | status | replayed check |
|---|---|---|---|
| offer terms / account-detail pop-ups (6) | M | done | click-dialog ×3 PASS — heading match, Escape closes |
| exit notice for off-site links | M | done | click-dialog PASS |
| client-rendered copy delivered static | CR | done | no-page-errors on 6 pages PASS |
| tags, analytics, consent (Tealium, GTM, Adobe, OneTrust, pixels) | T | scaffolded-awaiting-owner (all contract parts off) | martech gate PASS — no tag host requested |
| Spanish-language links | I18N | scaffolded-awaiting-owner — migrate the Spanish pages or keep linking to the source | — |
| debit card "send the app link" widget | F | scaffolded-awaiting-owner — SMS service endpoint; static download CTA + QR delivered | — |
| sign-in / account links | X | decided-out — plain links to www.bankofamerica.com | — |

Owner decisions: turn on martech contract parts (stardust/martech-handoff.md); Spanish pages; the debit card app-link
widget; the three out-of-plan debit-card pop-ups (direction.md § Scope debt).
