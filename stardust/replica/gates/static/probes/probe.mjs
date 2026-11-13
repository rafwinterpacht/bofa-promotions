// probe.mjs <url> <width> <outPrefix> [--click <href>] [--content <sel>] [--live]
// Opens url, closes consent, optionally clicks a[href=<href>], waits for the modal content,
// screenshots the content box and dumps rect + computed styles of the content subtree.
import { chromium } from '/app/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const a = process.argv.slice(2);
const [url, width, out] = a;
const opt = (k) => { const i = a.indexOf(k); return i > 0 ? a[i + 1] : null; };
const click = opt('--click'); const contentSel = opt('--content') || '.modal-dialog__content';
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: +width, height: 900 }, deviceScaleFactor: 1, bypassCSP: true });
await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.waitForTimeout(a.includes('--live') ? 5000 : 1200);
for (const s of ['.onetrust-close-btn-handler', '#onetrust-accept-btn-handler']) { try { await p.locator(s).first().click({ timeout: 1500 }); } catch {} }
await p.evaluate(() => document.fonts.ready);
let sel = contentSel;
if (click) {
  await p.locator(`a[href="${click}"]`).first().evaluate((el) => el.click());
  if (a.includes('--live')) {
    await p.waitForFunction(() => [...document.querySelectorAll('.modal__content,[role=document]')].some((e) => e.offsetHeight > 50 && e.innerText.trim().length > 20), null, { timeout: 15000 });
    await p.evaluate(() => { const m = [...document.querySelectorAll('.modal__content,[role=document]')].find((e) => e.offsetHeight > 50 && e.innerText.trim().length > 20); m.setAttribute('data-probe', '1'); });
    sel = '[data-probe="1"]';
  }
}
await p.waitForTimeout(1200);
const loc = p.locator(sel).first();
await loc.screenshot({ path: `${out}.png` });
const dump = await loc.evaluate((root) => {
  const props = ['display','position','width','maxWidth','height','margin','padding','fontFamily','fontSize','fontWeight','lineHeight','color','textAlign','borderRadius','backgroundColor','boxShadow','overflowY','top','right'];
  const rows = []; let n = 0;
  const walk = (el, depth) => {
    if (n++ > 80) return;
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    const st = {}; for (const k of props) st[k] = cs[k];
    const pb = getComputedStyle(el, '::before');
    rows.push({ depth, tag: el.tagName.toLowerCase(), cls: el.className && el.className.baseVal === undefined ? el.className : '', rect: [r.x, r.y, r.width, r.height].map(Math.round), text: (el.innerText || '').trim().slice(0, 50), st, before: pb.content !== 'none' ? { content: pb.content, width: pb.width, margin: pb.margin, border: pb.borderBottom, display: pb.display } : null, scroll: [el.scrollWidth, el.clientWidth, el.scrollHeight, el.clientHeight] });
    for (const c of el.children) walk(c, depth + 1);
  };
  let anc = root; const chain = [];
  while (anc && anc !== document.body) { const r = anc.getBoundingClientRect(); const cs = getComputedStyle(anc); chain.push({ tag: anc.tagName.toLowerCase(), cls: String(anc.className), rect: [r.x, r.y, r.width, r.height].map(Math.round), padding: cs.padding, margin: cs.margin, overflowY: cs.overflowY, position: cs.position }); anc = anc.parentElement; }
  walk(root, 0);
  return { chain, rows, doc: [document.documentElement.scrollWidth, innerWidth] };
});
fs.writeFileSync(`${out}.json`, JSON.stringify(dump, null, 1));
console.log('ok', out, dump.rows[0].rect, 'doc', dump.doc);
await b.close();
