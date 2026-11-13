# Font licensing — READ BEFORE GOING LIVE

All faces in this folder are **proprietary Bank of America brand fonts**, lifted from the source
site (promotions.bankofamerica.com) and self-hosted here for fidelity. They are served only for the
owner's own site (this replica of promotions.bankofamerica.com). Do not reuse them on any other
property, and confirm with the Bank of America brand / font licensing owner that the webfont
embedding licence covers this Edge Delivery origin (`*.aem.page`, `*.aem.live`, and the production
domain) **before publishing to aem.live / production**.

| File | Family (CSS) | Foundry / owner | Status |
|---|---|---|---|
| connections_light-web.woff2, connections_lightitalic-web.woff2 | Connections 100–300 | Bank of America (proprietary brand face) | self-hosted for the owner's site — licence confirmation pending |
| connections_regular-web.woff2, connections_italic-web.woff2 | Connections 400 | Bank of America (proprietary) | same |
| connections_medium-web.woff2, connections_mediumitalic-web.woff2 | Connections 500 | Bank of America (proprietary) | same |
| connections_bold-web.woff2, connections_bolditalic-web.woff2 | Connections 700 | Bank of America (proprietary) | same |
| connections_text.woff2, connections_text-vf-italic.woff2 | "connections text" 300–700 (variable) | Bank of America (proprietary) | same |
| icomoon.woff2, icomoon-interactive.woff2 | icomoon / icomoon-interactive (icon fonts) | Bank of America (custom icon set) | same |

Declared in `styles/fonts.css`; metric-matched local fallbacks (`connections-fallback`, Arial-based)
in `styles/styles.css`. A banner comment at the top of `styles/styles.css` repeats this alert.

## Remove path (if the licence cannot be confirmed)

1. Delete the `.woff2` files above and their `@font-face` rules in `styles/fonts.css`.
2. Every stack names `connections-fallback` second, so text falls back to Arial with Connections
   metrics (size-adjust / ascent / descent overrides) — no layout shift, no broken layout.
3. Icon glyphs (menu, dropdown caret) drawn with icomoon disappear: replace them in
   `blocks/header/header.css` with inline SVG masks before removing icomoon.
