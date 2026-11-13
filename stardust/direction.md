---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-11-13T15:37:15Z
  againstInput: https://promotions.bankofamerica.com/
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://promotions.bankofamerica.com/,
promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-11-13T15:37:15Z). Provenance: verbatim --prep promotion (page-scoped prep over the 14 planned URLs).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Scope debt — out-of-plan link targets (2026-11-13, E-full-site)
Decision (hands-off, link-audit rule: target outside the declared scope → repoint to the source site):
the debit card overview's "Watch video" / "Learn more" links open three source pop-ups that are not in the
14-page plan; they point at the source URLs (absolute, `.html`) until the owner adds them to scope:
- /content/experience-fragments/consumer_marketing/deposits/debitcard/overview/digital-debit-card-video/master
- /content/experience-fragments/consumer_marketing/deposits/debitcard/overview/digital-wallet-setup/master
- /content/experience-fragments/consumer_marketing/ecs/deposits/debit-card-digital-wallet-video/master

## Link audit — targets kept on the source site (2026-11-13, E2-link-audit)
Scope extension (outside the 14-page plan) → kept absolute to promotions.bankofamerica.com: the Spanish pages
(/es/deals, /es/deposits/*, /deposits/es/debitcard/overview), /en/offers/2026t3unauth, /card/paze,
/deposits/balanceconnect/overdraft, the ways-to-save-2026 PDF under /content/dam, and the three debit-card
pop-ups listed above. No locale root was captured (state.json site.captureGaps: none), so the Spanish links
stay repointed until the owner adds the Spanish pages.
