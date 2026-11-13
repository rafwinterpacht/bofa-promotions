/**
 * product-details — product comparison: a centred heading over side-by-side product cards
 * (3 columns from 640px); below 640px a centred carousel driven by tabs and arrows.
 *
 * Authoring:
 *   - heading row: the section heading (h2).
 *   - one row per product, three cells:
 *       1. h3 product name, an eyebrow paragraph (bold only), intro paragraph(s),
 *          the CTA paragraph (<strong> link = red button);
 *       2. key facts (fee paragraph, "Learn more" link paragraph, further facts);
 *       3. feature paragraphs.
 *     Thin rules are drawn between facts (before every fact paragraph except the first
 *     and except link-only paragraphs, which belong to the fact above them).
 *
 * Motion (source): below 640px the cards sit on a track that tabs and Previous/Next arrows
 * translate (transform 500ms); two presentational clones sit on each side of the real cards.
 * A sticky product bar (titles + CTAs) drops in at the top while the card list is scrolled
 * past its CTAs; below 640px it is a synced copy of the carousel with its own arrows.
 *
 * @ew-exempt ui-string — the visually hidden "Change to accessible version" control (source).
 * @ew-exempt derived — the mobile tab labels repeat each card's authored h3 (presentational);
 *   the sticky-bar titles and CTAs are stripped clones of the authored h3 / CTA paragraph.
 */

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

function wrapNode(node, className) {
  const w = div(className);
  w.append(node);
  return w;
}

// Presentational clones must not keep the editor's indices (EW4).
function stripInstrumentation(el) {
  el.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  el.removeAttribute('data-prose-index');
  return el;
}

const text = (el) => (el ? el.textContent.trim() : '');

const isLinkOnly = (p) => {
  const links = p.querySelectorAll('a');
  return links.length === 1 && text(p) === text(links[0]) && !p.querySelector('sup');
};

const isCta = (p) => isLinkOnly(p) && !!p.querySelector('strong a, em a, a.button');

const isEyebrow = (p) => {
  const strong = p.querySelector('strong, b');
  return !!strong && !p.querySelector('a') && text(p) === text(strong);
};

const ARROWS = [
  ['prev', 'Previous', 'icon_left',
    '27.9 54.8 30 52.7 4.2 27.9 30 3 27.9 0.8 0 27.9 27.9 54.8', -1],
  ['next', 'Next', 'icon_right',
    '2.1 0.8 0 3 25.8 27.8 0 52.7 2.1 54.8 30 27.8 2.1 0.8', 1],
];

function contentNodes(cell) {
  if (!cell) return [];
  const nodes = [...cell.children];
  // a single-paragraph cell can arrive unwrapped (bare inline content)
  if (!nodes.length && text(cell)) {
    const p = document.createElement('p');
    p.append(...cell.childNodes);
    return [p];
  }
  return nodes;
}

function buildCard(row) {
  const cells = [...row.children];
  const headCell = cells.find((c) => c.querySelector('h2, h3, h4')) || cells[0];
  const rest = cells.filter((c) => c !== headCell);
  const heading = headCell.querySelector('h2, h3, h4');

  const card = document.createElement('article');
  card.className = 'product-card';
  const header = div('product-card-header');
  const title = div('product-card-title');
  const intro = div('product-card-intro');
  const cta = div('product-card-cta');
  contentNodes(headCell).forEach((n) => {
    if (n === heading) title.append(n);
    else if (n.tagName === 'P' && isCta(n)) cta.append(n);
    else if (n.tagName === 'P' && isEyebrow(n)) intro.append(wrapNode(n, 'product-card-eyebrow'));
    else intro.append(n);
  });
  header.append(title, intro, cta);

  const key = div('product-card-key');
  const desc = div('product-card-desc');
  let first = true;
  rest.forEach((cell, i) => {
    const target = i === 0 ? key : desc;
    contentNodes(cell).forEach((n) => {
      const ruled = !first && !(n.tagName === 'P' && isLinkOnly(n));
      if (ruled) {
        const rule = div('product-card-rule');
        rule.setAttribute('aria-hidden', 'true');
        target.append(rule);
      }
      target.append(n);
      first = false;
    });
  });
  const body = div('product-card-body');
  body.append(key, desc);
  card.append(header, body);
  return { card, heading, cta: cta.querySelector('p') };
}

function presentationalClone(el) {
  const c = stripInstrumentation(el.cloneNode(true));
  c.classList.add('is-clone');
  c.classList.remove('is-active');
  c.setAttribute('aria-hidden', 'true');
  c.querySelectorAll('a, button').forEach((x) => {
    x.tabIndex = -1;
    x.removeAttribute('id');
  });
  return c;
}

function buildSticky(cards) {
  const sticky = div('product-sticky');
  sticky.setAttribute('aria-hidden', 'true');
  const inner = div('product-sticky-inner');
  const list = div('product-sticky-list');
  cards.forEach(({ heading, cta }) => {
    const item = div('product-sticky-item');
    const box = div('product-sticky-box');
    if (heading) box.append(wrapNode(presentationalClone(heading), 'product-sticky-title'));
    if (cta) box.append(wrapNode(presentationalClone(cta), 'product-sticky-cta'));
    item.append(box);
    list.append(item);
  });
  inner.append(list);
  sticky.append(inner);
  return { sticky, stickyInner: inner, stickyList: list };
}

function arrowButton([key, label, title, points]) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `product-details-arrow product-details-arrow-${key}`;
  b.setAttribute('aria-label', label);
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 30 55');
  svg.setAttribute('aria-hidden', 'true');
  svg.dataset.icon = title;
  const poly = document.createElementNS(ns, 'polyline');
  poly.setAttribute('points', points);
  poly.setAttribute('fill-rule', 'evenodd');
  svg.append(poly);
  b.append(svg);
  return b;
}

// two presentational clones on each side of the real slides (source carousel)
function loopClones(items) {
  const n = items.length;
  const before = [items[1 % n], items[2 % n]].map(presentationalClone);
  const after = [items[0], items[1 % n]].map(presentationalClone);
  return { before, after };
}

function initCarousel(content, list, tabs, real, sticky) {
  const mq = window.matchMedia('(width <= 639px)');
  const stickyReal = [...sticky.stickyList.children];
  const tracks = [list, sticky.stickyList];
  let current = 0;
  let clones = [];

  const go = (i) => {
    current = (i + real.length) % real.length;
    // CSS centres slide n: translateX((100% - slide) / 2 - n * slide)
    const lead = clones.length ? 2 : 0;
    tracks.forEach((t) => t.style.setProperty('--track-step', String(current + lead)));
    tabs.forEach((t, j) => {
      t.classList.toggle('is-active', j === current);
      t.setAttribute('aria-selected', String(j === current));
      t.tabIndex = j === current ? 0 : -1;
    });
    real.forEach((c, j) => c.classList.toggle('is-active', j === current));
  };

  const setup = () => {
    clones.forEach((c) => c.remove());
    clones = [];
    if (mq.matches && real.length > 1) {
      [[list, real], [sticky.stickyList, stickyReal]].forEach(([track, items]) => {
        const { before, after } = loopClones(items);
        track.prepend(...before);
        track.append(...after);
        clones.push(...before, ...after);
      });
    }
    go(current);
  };

  ARROWS.forEach((spec) => {
    const b = arrowButton(spec);
    b.addEventListener('click', () => go(current + spec[4]));
    content.append(b);
    const sb = arrowButton(spec);
    sb.tabIndex = -1;
    sb.addEventListener('click', () => go(current + spec[4]));
    sticky.stickyInner.append(sb);
  });
  tabs.forEach((tab, i) => tab.addEventListener('click', () => go(i)));
  mq.addEventListener('change', setup);
  setup();
}

// Source: the bar shows once the cards' CTAs have scrolled up under it (CTA bottom within
// ~195px of the viewport top) and hides when the card list has left the viewport.
const STICKY_REVEAL = 195;

function initStickyReveal(list, sticky) {
  let ticking = false;
  const update = () => {
    ticking = false;
    const cta = list.querySelector('.product-card.is-active .product-card-cta')
      || list.querySelector('.product-card-cta');
    if (!cta) return;
    const show = cta.getBoundingClientRect().bottom < STICKY_REVEAL
      && list.getBoundingClientRect().bottom > 0;
    sticky.classList.toggle('is-visible', show);
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }, { passive: true });
  update();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .product-details-inner')) return;

  // 1. QUERY: the section heading, then one card per row carrying a product heading
  const rows = [...block.children];
  const productRows = rows.filter((r) => r.querySelector('h3, h4')
    || r.children.length > 1);
  const headRows = rows.filter((r) => !productRows.includes(r));

  // 2. CREATE the template slots
  const inner = div('product-details-inner');
  const content = div('product-details-content');
  const tabsBar = div('product-details-tabs');
  tabsBar.setAttribute('role', 'tablist');
  const list = div('product-details-list');

  // 3. MOVE authored nodes
  headRows.forEach((r) => {
    const h = r.querySelector('h1, h2, h3');
    if (h) inner.append(wrapNode(h, 'product-details-heading'));
    else [...r.querySelectorAll(':scope > div > *')].forEach((n) => inner.append(n));
  });
  const cards = productRows.map(buildCard);
  const tabs = cards.map(({ heading }, i) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'product-details-tab';
    tab.setAttribute('role', 'tab');
    tab.dataset.index = String(i);
    tab.textContent = heading ? heading.textContent : '';
    tabsBar.append(tab);
    return tab;
  });
  list.append(...cards.map(({ card }) => card));
  // source a11y control: switches the mobile carousel to the plain stacked list
  const a11y = document.createElement('button');
  a11y.type = 'button';
  a11y.className = 'product-details-a11y';
  a11y.textContent = 'Change to accessible version';
  a11y.addEventListener('click', () => {
    const on = block.classList.toggle('accessible');
    a11y.setAttribute('aria-pressed', String(on));
  });
  content.append(a11y, tabsBar, list);
  inner.append(content);

  const sticky = buildSticky(cards);
  block.replaceChildren(inner, sticky.sticky);
  if (cards.length) {
    initCarousel(content, list, tabs, cards.map(({ card }) => card), sticky);
    initStickyReveal(list, sticky.sticky);
  }
}
