<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-11-13T16:45:03.322Z · input stardust/current/_dynamics.json (3 pages, 41 findings) · target probe https://main--78f2fb76--aemcoder.aem.page -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-first-party-api-post-n-js-events-v10-session-json | A | first-party API POST /{n}/js/events/v10/session.json | 3/3 (reach 6/12) | data-fed | — | needs-backend | pending | decided-out | none (session-bound off-origin) | **dead on target (404)** |
| 2 | a-first-party-api-post-n-hash-js-events-v10-jsevent-json | A | first-party API POST /{n}/{hash}/js/events/v10/jsEvent.json | 3/3 (reach 6/12) | data-fed | block | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 3 | a-first-party-api-post-ee-or2-v1-interact | A | first-party API POST /ee/or2/v1/interact | 3/3 (reach 6/12) | data-fed | block | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 4 | a-cms-app-settings-object-digitaldata | A | CMS / app settings object digitalData | 3/3 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 5 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 3/3 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 6 | a-cms-app-settings-object-adobedatalayer | A | CMS / app settings object adobeDataLayer | 3/3 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 7 | a-cms-app-settings-object-utag-data | A | CMS / app settings object utag_data | 3/3 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 8 | cr-client-rendered-slot-masthead-copy-text-js-initialized | CR | client-rendered slot masthead__copy text js-initialized | 2/3 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 9 | cr-client-rendered-slot-multi-step-content-item-copy-text-js | CR | client-rendered slot multi-step-content-item__copy text js-initialized | 2/3 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 10 | cr-client-rendered-slot-text-js-initialized | CR | client-rendered slot text js-initialized | 2/3 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 11 | cr-client-rendered-slot-product-details-not-modal-bg-white | CR | client-rendered slot product-details not-modal bg-white | 1/3 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 12 | cr-client-rendered-slot-product-details-productkeydesc-text- | CR | client-rendered slot product-details__productKeyDesc text js-initialized | 1/3 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 13 | cr-client-rendered-slot-product-details-productdesc-text-js- | CR | client-rendered slot product-details__productDesc text js-initialized | 1/3 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 14 | cr-client-rendered-slot-uc-uc-component-uc-heading | CR | client-rendered slot uc uc-component uc-heading | 1/3 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 15 | cr-client-rendered-slot-features-not-modal-horizontal | CR | client-rendered slot features not-modal horizontal | 1/3 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 16 | cr-client-rendered-slot-features-item-copy-text-js-initializ | CR | client-rendered slot features__item--copy text js-initialized | 1/3 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 17 | cr-client-rendered-slot-preferred-cards-not-modal-js-initial | CR | client-rendered slot preferred-cards not-modal js-initialized | 1/3 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 18 | cr-client-rendered-slot-preferred-cards-subheading-text-js-i | CR | client-rendered slot preferred-cards__subHeading text js-initialized | 1/3 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 19 | cr-client-rendered-slot-content-tile-copy-col-xs-12-text | CR | client-rendered slot content-tile__copy col-xs-12 text | 1/3 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 20 | cr-client-rendered-slot-content-tile-legalcopy-text-js-initi | CR | client-rendered slot content-tile__legalCopy text js-initialized | 1/3 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 21 | cr-client-rendered-slot-image-with-text-offset-copy-text-js- | CR | client-rendered slot image-with-text-offset__copy text js-initialized | 1/3 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 22 | i18n-locale-variants-en-us | I18N | locale variants en-us | 1/3 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 23 | i18n-locale-variants-es-es-en-us | I18N | locale variants es,es,en-us | 1/3 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 24 | i18n-locale-variants-es-en-en-en-en | I18N | locale variants es,en,en,en,en | 1/3 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 25 | m-modal-trigger-modal-exit-continue-chrome-only-a-content | M | modal trigger modal-exit--continue (chrome only) → a:content | 3/3 (reach 6/12) | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 26 | m-modal-trigger-data-modal-target-chrome-only-a-content | M | modal trigger data-modal-target (chrome only) → a:content | 3/3 (reach 15/12) | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 27 | m-modal-trigger-show-modal-chrome-only-a-content | M | modal trigger show__modal (chrome only) → a:content | 3/3 (reach 6/12) | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 28 | m-modal-trigger-aria-haspopup-chrome-only-button-content | M | modal trigger aria-haspopup (chrome only) → button:content | 3/3 (reach 4/12) | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 29 | m-modal-trigger-not-modal-target-outside-dom-at-capture | M | modal trigger not-modal → target outside DOM at capture | 2/3 (reach 4/12) | rebuild-native | runtime | self | pending | modal-loader | none |  |
| 30 | m-modal-trigger-aria-controls-dialog-dialog-content | M | modal trigger aria-controls→dialog → dialog:content | 1/3 | rebuild-native | runtime | self | pending | modal-loader | none |  |
| 31 | t-tag-manager-tealium | T | tag manager: Tealium | 3/3 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 32 | t-consent-onetrust | T | consent: OneTrust | 3/3 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 33 | t-unknown-third-party-host-storage-glancecdn-net | T | unknown third-party host storage.glancecdn.net | 3/3 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 34 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 3/3 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 35 | t-analytics-adobe-analytics-experience-cloud-id | T | analytics: Adobe Analytics / Experience Cloud ID | 3/3 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 36 | t-analytics-adobe-analytics-experience-cloud-id-first-party- | T | analytics: Adobe Analytics / Experience Cloud ID (first-party subdomain — needs a CNAME on the new host) | 3/3 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 37 | t-unknown-third-party-host-core-thepointyspritesclub-com | T | unknown third-party host core.thepointyspritesclub.com | 1/3 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 38 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 1/3 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 39 | v-iframe-without-src-runtime-injected-embed | V | iframe without src (runtime-injected embed) | 3/3 | embed-passthrough | embed | needs-human-capture | pending | embed-passthrough | resolve the runtime src from a rendered capture |  |
| 40 | x-sign-in-account-links | X | sign-in / account links | 1/3 | decided-out | — | needs-backend | pending | decided-out | auth / commerce on the new host? |  |
| 41 | x-commerce-signals-cart-false-prices-31 | X | commerce signals (cart: false, prices: 31) | 1/3 | decided-out | — | needs-backend | pending | decided-out | auth / commerce on the new host? |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 24 row(s) — read-settings, settled-dom-snapshot, chrome-interaction, modal-loader.
- **One owner decision batch:** 15 row(s) — none (session-bound off-origin) · which tier for the target host; consumer on the migrated pages? · scope of the locale trees · which tags run on the new host; property ids · CMP domain script reuse on the new host · resolve the runtime src from a rendered capture.
- **Already delivered by the capture pipeline:** 0 row(s) — no work.
- **Host-bound on the target:** 3 of 3 probed API paths — the off-origin data work.
- **Martech:** OneTrust · 0/3 route(s) enabled by the owner — `stardust/martech-handoff.md`.

## Phases

- **capture** — 14
- **tags** — 8
- **interactive** — 6
- **detect** — 4
- **register** — 3
- **locale wave** — 3
- **off-origin data** — 2
- **embeds** — 1
