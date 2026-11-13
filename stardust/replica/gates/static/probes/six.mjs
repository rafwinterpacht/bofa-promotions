// six.mjs <mode live|landing|landing-fix> <outDir> — open each of the six fragment modals at 1440 and 360,
// screenshot the dialog box, and record clipping/overflow facts.
import { chromium } from '/app/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const [mode, outDir] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const FIX = '/workspace/78f2fb76/stardust/prototypes/content-experience-fragments-consumer_marketing-en-offers-t3-dda-plus-learn-more-modal-plus-2026-modal.css';
const hrefs = ['eligible-accounts-modal/master', 'odp-balance-connect-modal/odp-bal-conn-modal', 'plus-learn-more-modal/plus-2026-modal', 'qualifying-direct-deposit-modal/master', 'relationship-learn-more-modal/relationship-2026-modal', 'safebalance-learn-more-modal/safebalance-2026-modal']
  .map((h) => `/content/experience-fragments/consumer_marketing/en/offers/t3-dda/${h}.html`);
const live = mode === 'live';
const url = live ? 'https://promotions.bankofamerica.com/en/offers/chooseyourchecking500tiered' : 'http://localhost:8791/en-offers-chooseyourchecking500tiered-proposed.html';
const b = await chromium.launch({ channel: 'chrome' });
const res = [];
for (const width of [1440, 360]) {
  const p = await b.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1, bypassCSP: true });
  await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForTimeout(live ? 5000 : 1500);
  for (const s of ['.onetrust-close-btn-handler', '#onetrust-accept-btn-handler']) { try { await p.locator(s).first().click({ timeout: 1500 }); } catch {} }
  if (mode === 'landing-fix') await p.addStyleTag({ content: fs.readFileSync(FIX, 'utf8') });
  await p.evaluate(() => document.fonts.ready);
  for (const h of hrefs) {
    await p.locator(`a[href="${h}"]`).first().evaluate((el) => el.click());
    const sel = live ? '[data-probe="1"]' : '#modal-fragment .modal-dialog__content';
    if (live) {
      await p.waitForFunction(() => [...document.querySelectorAll('.modal__content')].some((e) => e.offsetHeight > 50 && e.innerText.trim().length > 20), null, { timeout: 15000 });
      await p.evaluate(() => { document.querySelectorAll('[data-probe]').forEach((e) => e.removeAttribute('data-probe')); [...document.querySelectorAll('.modal__content')].find((e) => e.offsetHeight > 50 && e.innerText.trim().length > 20).setAttribute('data-probe', '1'); });
    }
    await p.waitForTimeout(1000);
    const name = h.split('/').slice(-2).join('-').replace('.html', '');
    const box = p.locator(sel).first();
    await box.screenshot({ path: `${outDir}/${name}-${width}.png` });
    const facts = await box.evaluate((c) => {
      const cr = c.getBoundingClientRect(); let clipped = [];
      for (const el of c.querySelectorAll('*')) {
        const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
        if (r.left < cr.left - 0.5 || r.right > cr.right + 0.5 || r.bottom > cr.bottom + 0.5) clipped.push(el.tagName + ' ' + (el.innerText || '').slice(0, 30));
        if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== 'visible') clipped.push('scrollX ' + el.tagName);
      }
      const dlg = c.closest('dialog') || c.parentElement;
      const reach = dlg.scrollHeight >= c.offsetTop + c.offsetHeight; // whole box reachable by scrolling the dialog
      return { rect: [cr.x, cr.y, cr.width, cr.height].map(Math.round), clipped, reachable: reach, dlgOverflowY: getComputedStyle(dlg).overflowY, docW: document.documentElement.scrollWidth, text: c.innerText.replace(/\s+/g, ' ').trim() };
    });
    res.push({ width, name, ...facts });
    console.log(width, name, facts.rect, 'clipped', facts.clipped.length, 'reach', facts.reachable, facts.dlgOverflowY, 'docW', facts.docW);
    await p.keyboard.press('Escape'); await p.waitForTimeout(400);
    if (live) { try { await p.locator('[data-probe="1"] .modal__close').click({ timeout: 1500 }); } catch {} await p.waitForTimeout(400); }
    else if (await p.locator('#modal-fragment[open]').count()) { await p.locator('#modal-fragment .modal-dialog__close').click(); await p.waitForTimeout(200); }
  }
  await p.close();
}
fs.writeFileSync(`${outDir}/facts.json`, JSON.stringify(res, null, 1));
await b.close();
