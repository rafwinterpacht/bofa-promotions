---
<!-- stardust:provenance writtenBy=stardust:extract writtenAt=2026-11-13T15:55:00Z stardustVersion=0.38.2 readArtifacts=_computed-styles.json -->
name: Bank of America Promotions (current state)
colors:
  background: "#ffffff"
  surface: "#ededed"
  text: "#000000"
  primary: "#e31837"
  primary-hover: "#c41230"
  primary-deep: "#ae132a"
  secondary: "#012169"
  accent-link: "#0053c2"
  border: "#d5d5d5"
typography:
  family: "Connections, Arial, sans-serif"
  h1: { fontSize: 48px, fontWeight: 100 }
  h2: { fontSize: 48px, fontWeight: 100 }
  h3: { fontSize: 22px, fontWeight: 700 }
  display: { fontSize: 56px }
rounded:
  card: 35px
  pill: 50%
spacing:
  container: 1440px (module cap, cap-probe)
components:
  cta-primary: { background: "#e31837", color: "#ffffff" }
  link: { color: "#0053c2" }
---

# Design — current state (descriptive)

**Palette.** White canvas with light-grey (#ededed) bands; Bank of America red #e31837 for primary CTAs and accent headings (hover #c41230); navy #012169 for full-width banners; links #0053c2. Source: `_computed-styles.json` aggregate.colors.

**Type.** One family, the proprietary *Connections* face, everywhere. Display/section headings are 40–56 px at weight 100 (thin); card titles 22–24 px bold; body 16–18 px. Not a modular scale (ad hoc).

**Shape and depth.** Rounded cards (32–35 px radius) on the deals and debit-card pages; square images elsewhere; very light shadows (0 2px 4px rgba(0,0,0,.25)).

**Layout.** Module cap 1440 px, fluid shell; sections are AEM components: masthead (image + headline + red CTA), content-tile (image/text alternation), features (3-up icon columns), tiles, preferred-cards, multi-step-content (numbered steps), product-details (comparison columns), cta-banner (navy/red band with CTA), long-form-text (legal footnotes).

**Chrome.** Header: BofA logo, utility link "En español", a short tabbed nav; footer: legal links, Equal Housing Lender, copyright.
