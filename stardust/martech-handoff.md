# Martech hand-off

Everything below is scaffolded **off**. To ship it, set `enabled: true` on `consent.cmp` and on each route in `stardust/martech-contract.json`, then re-run `deploy/scripts/martech-scaffold.mjs` and `dynamics/scripts/dynamics-check.mjs` to confirm the enabled tags load. Enabled tags load on `promotions.bankofamerica.com` only; preview with `?martech=on` (add `&consent=accept` to grant every category).

## Consent

- **CMP:** OneTrust · `data-domain-script` = `6ba00e9c-679a-491c-bd2d-7c496f18a053`
- **Model `owner-decision`:** no evidence of consent gating inside the tag manager. Keep the source behaviour (route `category` null), or set a route `category` to a consent group id to load that tag manager only once the group is granted.
- **Google Consent Mode:** consent-mode calls in `tags/www.googletagmanager.com-js-G-6KEPN1V5EM.js`, `tags/www.googletagmanager.com-js-G-R1YNK5WY2C.js`, `tags/www.googletagmanager.com-js-G-NNP0RK1XHF.js`. Check it with the owner before gating a route on a category.
- **Categories:** no CMP configuration read — run `spec-martech.mjs` first, or decide categories with the owner.

## Routes

| id | vendor | src | CMP groups listing its host | enabled |
|---|---|---|---|---|
| google-tag-manager-1 | Google Tag Manager | `https://www.googletagmanager.com/gtag/js?id=G-NNP0RK1XHF&l=gDataLayer&cx=c` | — | false |
| google-tag-manager-2 | Google Tag Manager | `https://www.googletagmanager.com/gtag/js?id=AW-1054100448` | — | false |
| tealium | Tealium | `https://tags.tiqcdn.com/utag/bofa/mcoe/prod/utag.js` | — | false |

Also seen, not routed (loaded by the tag manager or inline on the source — confirm each still fires): marketing: ad / retargeting pixel.

## Rewrite before go-live

Nothing found (or no tag-manager library read).

## Data layer

The source pages expose `adobeDataLayer`, `dataLayer`, `digitalData`, `utag_data`, `gDataLayer`; keep the same global names.
Rules in Google Tag Manager, Tealium were not parsed. Read each library listed in `martech/tags.json` and record its rules and data elements in the contract's `tagNotes`, keyed by tag manager, each citing where it was read (`from`); until then their triggers and events come from the tagging plan.
Ask the owner for the tagging plan (solution design reference): each event, its payload and the interaction that pushes it. With it, add each push in the block that owns the interaction.
