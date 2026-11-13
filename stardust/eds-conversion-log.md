# EDS conversion log — promotions.bankofamerica.com

## Publish decision (2026-11-13)
Decision made by the run brief: **publish**. Every delivered page, the redirects sheet and the
chrome documents (nav, footer and any locale variants) go live on the aem.live origin
(deploy-batch.mjs without --no-publish, or POST https://admin.hlx.page/live/…).

## archetype-program — /deposits/growyoursavings (2026-11-13)
- Blocks (decode tier): masthead (template-slotted; variants left|center; 1-2 bg images,
  desktop then mobile), content-tile (reconstructive item rows icon|copy; image side = row
  order), multi-step-content (reconstructive, segmented on h3), image-with-text-offset
  (template-slotted; left|right, red|blue), long-form-text (template-slotted; blue),
  disclosures (reconstructive, one row per footnote; ids derived from the return link).
- D1/D3 advisories justified: masthead / image-with-text-offset / long-form-text are bespoke
  painted bands (background images, offset panels), not default content; content-tile mixes
  1-cell text rows and 2-cell icon|copy item rows by design.
- Icons authored as `<span class="icon icon-x">`, rendered with the icomoon glyphs in block CSS.
- Harness quirk: block-roundtrip needs the fonts served with CORS (probe server) to compare
  faces; with that, whole page --ew exits 0 (46/46 editable).

## archetype-unique — /en/deals (2026-11-13)
- Blocks (decode tier): masthead-notch (template-slotted; 1-2 images desktop/mobile + notch
  card), brands (template-slotted; Top Brands intro + brand-image strip, absorbs the 1px
  separator as margin), features (reconstructive, segmented on h3; band CTA = large pill),
  pcard (template-slotted; image side = authored cell order; optional columns row),
  story (template-slotted; desktop cover photo / mobile stacked photo + frosted panel),
  banner (template-slotted; variant dark), carousel (reconstructive, one row per slide,
  desktop/mobile images; arrows + line dots, 500ms track / 200ms dot, one aria-hidden clone
  per end), tiles (reconstructive; 3 images per tile = desktop/tablet/mobile), faq
  (reconstructive, segmented on h3; EW7: question h3 in div.faq-title, chevron-only toggle
  button; authored "Expand all | Collapse all" options paragraph). Reused: disclosures.
- Pill CTAs are authored <strong><em> (foundation accent); large/round sizes are scoped
  descendant rules in features/story CSS (no class on the authored link, EW2).
- D1 advisories (masthead-notch, banner) justified: painted bands, not default content;
  D3 (brands) by design: text row + one cell per strip image.
- FAQ title font stack is written without the quoted "Liberation Sans" alias so
  content-inventory names the face Connections (same rendered face).
- Local qa-gate: header/footer empty on the harness (no chrome docs served) and the schema's
  pcard unit count (7) comes from the events card's column group applied to the first pcard
  instance — both harness artifacts; block-roundtrip --ew whole page exit 0 (75/75 editable).

## archetype-landing — /en/offers/chooseyourchecking500tiered

- Blocks: product-details (reconstructive — one row per product, segmented on h3; heading row
  template-slotted), steps (reconstructive — one row per step, classified by icon image;
  heading + sub-copy rows), promo-card-row (reconstructive — one row per card). Reused
  masthead (variant `light`, styled in product-details.css: masthead/ is program-owned) and
  disclosures (canon list/table rules shipped in product-details.css).
- Motion: mobile product carousel (tabs + Previous/Next, two clones per side, 500ms track
  translate); sticky product bar reveal measured on live (shows when the card CTAs scroll
  within 195px of the top, hides when the list leaves) — the replica register had it "dead";
  synced mobile sticky carousel with its own arrows.
- Pipeline findings: footnotes are served `<a><sup>N</sup></a>` (aria-label dropped), so each
  block styles `a:has(> sup)`; `&nbsp;` beside `<strong>` gains an extra space — authored as
  plain spaces in two paragraphs. Fragment links use /content/experience-fragments/consumer-marketing/.
- Local: qa-gate header/footer empty on the harness (no chrome docs); block-roundtrip --ew
  whole page exit 0 (93/93 editable).

## Redirects sheet (2026-11-13)
/redirects.json published live: 20 rows (`.html` aliases, root → offer landing, `consumer_marketing` fragment paths → `consumer-marketing`).
