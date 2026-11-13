# Prototype gate — every crafted prototype, 360px

2026-11-13T20:52:57.239Z · **3 PASS / 1 FAIL / 0 error of 4** (+1 documented override → 4 delivered)

Verdict: overlap pixel % ≤ 10 AND |Δh| ≤ 5% of origin height AND clipped ≤ 0 (+ documented allowance)

Calibration — pixel-only verdict (criteria 1+2): **3 PASS**; full verdict (1–4): **3 PASS**. Failing by criterion: pixel 1, height 1, clip 0, content 0; content n/a (origin not probed) 0; 1 asymmetric origin(s).
| page | template | tier | origin | browser | pixel % (text %) | Δh px | clipped | content | units | verdict | reasons |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `/deposits-growyoursavings-proposed.html` | - | - | stitch-live | chrome | 0.17 | 1 | 0 | n/a | - | PASS | - |
| `/en-deals-proposed.html` | - | - | stitch-live | chrome | 2.73 | 2 | 0 | n/a | - | PASS | - |
| `/en-offers-chooseyourchecking500tiered-proposed.html` | - | - | stitch-live | chrome | 7.12 | 3 | 0 | n/a | - | PASS | - |
| `/content-experience-fragments-consumer_marketing-en-offers-t3-dda-plus-learn-more-modal-plus-2026-modal-proposed.html` | - | - | crawl-fullpage ⚠asym | chrome | 14.94 | -372 | 0 | n/a | - | FAIL → undefined: modal fragment: the source fragment URL answers 302 to its own extensionless path (redirect loop), so the origin side falls back to the crawl full-page shot (asymmetric, different page chrome); the row compares unlike captures | pixel 14.94% > 10%; Δh -372px > 5% of 528 |
