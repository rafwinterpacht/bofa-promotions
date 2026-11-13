import { chromium } from '/app/node_modules/playwright/index.mjs';
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, bypassCSP: true });
await p.goto('https://promotions.bankofamerica.com/en/offers/chooseyourchecking500tiered', { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.waitForTimeout(5000);
await p.locator('a[href*="odp-bal-conn-modal"]').first().evaluate((el) => el.click());
await p.waitForTimeout(3000);
console.log(await p.evaluate(() => {
  const i = [...document.querySelectorAll('i')].find((e) => e.textContent.startsWith('Transfers from a linked'));
  const out = []; let el = i;
  for (let k = 0; k < 5 && el; k++, el = el.parentElement) { const cs = getComputedStyle(el); out.push(`${el.tagName}.${el.className} m:${cs.margin} p:${cs.padding} prevSib:${el.previousElementSibling ? el.previousElementSibling.tagName + '.' + el.previousElementSibling.className : '-'} y:${Math.round(el.getBoundingClientRect().y)}`); }
  return out.join('\n') + '\n' + i.closest('.modal__body').outerHTML.replace(/>[^<]{40,}</g, '>…<').slice(0, 1500);
}));
await b.close();
