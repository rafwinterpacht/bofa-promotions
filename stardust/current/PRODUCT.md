<!-- stardust:provenance writtenBy=stardust:extract writtenAt=2026-11-13T15:55:00Z stardustVersion=0.38.2 readArtifacts=pages/*.json,_computed-styles.json -->
# Product
<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
Consumers in the United States who are considering, or already hold, Bank of America deposit products: prospective checking customers responding to a sign-up bonus, savers comparing CDs and IRAs, debit card holders, and members of BofA Rewards browsing cash-back deals.
_provenance: inferred — from captured page copy (offer terms, product explanations, footnotes).

## Product Purpose
promotions.bankofamerica.com is Bank of America's campaign and promotions host: offer landing pages ("New checking customers earn up to $500"), product explainer pages (Balance Connect®, Grow Your Savings, CDs/IRAs, debit card overview) and the BofA Deals cash-back page. Each page drives to one primary action (open an account, enroll, see deals) and carries extensive legal disclosures.

## Positioning
A large national bank presenting simple, trustworthy, benefit-led product messaging with regulatory precision — red primary CTAs, navy and white surfaces, light-weight headline type.

## Capabilities and Constraints
- Content is authored in AEM (aem-wrap component wrappers: masthead, content-tile, features, tiles, preferred-cards, multi-step-content, product-details, cta-banner, long-form-text).
- Offer terms live in experience-fragment modals loaded on click from a JSON service (`/services/consumer-marketing/modalitem.xf_path.*`).
- OneTrust consent, Adobe/Tealium-class analytics tags (see `_crawl-log.json#dynamicSurface`).
- The source origin root `/` has no page (redirects to a BofA error page).

## Brand Commitments
- Register: `brand` (marketing/landing pages).
- Personality observed: calm, institutional, reassuring; generous white space, thin 100-weight display headings in the proprietary Connections face, Bank of America red (#e31837) for primary actions, navy (#012169) bands.
- Anti-references observed: no playful illustration, no dark mode, no dense dashboards.

## Evidence on Hand
- `stardust/current/pages/*.json|.html` — 6 live pages + 6 modal fragments (Playwright).
- `stardust/current/assets/screenshots/` — full-page captures and modal crops.
- `stardust/current/_computed-styles.json` — style census at 1440 and 360.
- `stardust/current/DESIGN.json` — tokens, module candidates, cap model.

## Product Principles
- One primary action per page, repeated at the bottom.
- Every claim footnoted; disclosures are part of the content, never trimmed.
_provenance: inferred — from page structure.

## Accessibility & Inclusion
Skip-to-content link, ARIA-labelled modals and CTAs, "En español" alternates in the utility nav.
