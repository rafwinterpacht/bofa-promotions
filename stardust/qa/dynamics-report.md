# Dynamics parity check — https://main--78f2fb76--aemcoder.aem.live — 2026-11-13T20:41:25.986Z

Replayed 6 checks over 7 features · pass 6 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| offer-page terms / account-detail modals (6 experience-fragment dialogs) | M | done | click-dialog | PASS | dialog 1440px · heading "Bank of America Advantage Plus Banking®" · 0 fields · Escape closes: true |  |
| offer-page terms / account-detail modals (6 experience-fragment dialogs) | M | done | click-dialog | PASS | dialog 1440px · heading "New Eligible Accounts" · 0 fields · Escape closes: true |  |
| offer-page terms / account-detail modals (6 experience-fragment dialogs) | M | done | click-dialog | PASS | dialog 1440px · heading "Qualifying Direct Deposit" · 0 fields · Escape closes: true |  |
| exit-notice modal for off-site links | M | done | click-dialog | PASS | dialog 1440px · heading "You are now leaving a Bank of America website." · 0 fields · Escape closes: true |  |
| client-rendered component copy delivered as static content (rows 8–21) | CR | done | no-page-errors | PASS | none on 6 page(s) |  |
| martech: consent + tag routing | T | scaffolded-off | martech | PASS | no tag host requested (3 gated · 0 cross-site host(s) blocked) |  |

## Features without checks

- En español links to the source /es/ pages (I18N) — scaffolded-awaiting-owner · owner: whether the Spanish pages are migrated; links stay absolute to the source until then
- debit card 'send the app link' widget (F) — scaffolded-awaiting-owner · owner: SMS app-link service endpoint; delivered as static download CTA + QR
- sign-in / account links (X) — decided-out
