import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * Header — template-slotted chrome for promotions.bankofamerica.com.
 *
 * The nav document (default /nav, per page via the `nav` metadata) is classified by
 * content, never by position:
 *   - a section styled `utility`            -> grey utility bar (desktop top row)
 *   - the section holding a <ul>            -> main menu (style `tabs` = tabbed menu)
 *   - the first other section               -> brand (logo link)
 *   - any remaining section                 -> header CTA links (e.g. "En español")
 * Authored nodes are MOVED into the slots, never rebuilt. Page metadata `spanish-url`
 * re-targets the "En español" link of a shared nav document.
 *
 * @ew-exempt "Skip to content" skip link and toggle-button aria labels are chrome UI text.
 */

const isDesktop = window.matchMedia('(width >= 1024px)');
const LOGO_SRC = '/icons/bofa-logo.svg';

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

/** section style from server-rendered classes, or a client-side section-metadata block */
function sectionStyle(section) {
  const meta = section.querySelector('.section-metadata');
  if (meta) {
    [...meta.querySelectorAll(':scope > div')].forEach((row) => {
      const [key, value] = row.children;
      if (key && value && key.textContent.trim().toLowerCase() === 'style') {
        value.textContent.split(',').map((s) => s.trim().toLowerCase().replace(/\s+/g, '-'))
          .filter(Boolean).forEach((s) => section.classList.add(s));
      }
    });
    (meta.closest('.section-metadata-wrapper') || meta).remove();
  }
  return section.classList;
}

/** all authored nodes of a section, in order (wrappers flattened) */
function sectionNodes(section) {
  return [...section.querySelectorAll(':scope > div')]
    .flatMap((wrapper) => [...wrapper.children])
    .filter((n) => !n.matches('.metadata, .metadata-wrapper, .section-metadata-wrapper'));
}

function normalizePath(href) {
  try {
    const { pathname } = new URL(href, window.location);
    return pathname.replace(/\.html$/, '').replace(/\/index$/, '').replace(/\/$/, '') || '/';
  } catch {
    return '';
  }
}

function decorateBrand(brand) {
  const link = brand.querySelector('a');
  if (!link || link.querySelector('img, picture, .icon')) return;
  const label = el('span', 'visually-hidden');
  [...link.childNodes].forEach((n) => label.append(n));
  const logo = el('img', 'header-logo', {
    src: LOGO_SRC, alt: '', width: '245', height: '44',
  });
  link.append(logo, label);
}

function closeSubmenus(nav, except) {
  nav.querySelectorAll('li.is-expanded').forEach((li) => {
    if (li === except) return;
    li.classList.remove('is-expanded');
    li.querySelector(':scope > .header-nav-toggle')?.setAttribute('aria-expanded', 'false');
  });
}

function decorateMenu(nav, tabbed) {
  const here = normalizePath(window.location.href);
  nav.querySelectorAll('li').forEach((li) => {
    const trigger = li.querySelector(':scope > a, :scope > p > a');
    if (trigger && normalizePath(trigger.href) === here) {
      trigger.setAttribute('aria-current', 'page');
    }
    const sub = li.querySelector(':scope > ul');
    if (!sub || tabbed) return;
    li.classList.add('has-sub');
    const label = trigger ? trigger.textContent.trim() : '';
    const toggle = el('button', 'header-nav-toggle', {
      type: 'button',
      'aria-label': `Open ${label} Menu`,
      'aria-expanded': 'false',
    });
    sub.before(toggle);
    toggle.addEventListener('click', () => {
      const open = !li.classList.contains('is-expanded');
      closeSubmenus(nav, li);
      li.classList.toggle('is-expanded', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
  });
}

function retargetSpanish(container) {
  const url = getMetadata('spanish-url');
  container.querySelectorAll('a').forEach((a) => {
    if (!/espa[nñ]ol/i.test(a.textContent)) return;
    a.setAttribute('lang', 'es');
    if (url) a.href = url;
  });
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  block.textContent = '';
  if (!fragment) return;

  const slots = {
    utility: null, menu: null, brand: null, ctas: [],
  };
  let tabbed = false;
  [...fragment.querySelectorAll(':scope > .section')].forEach((section) => {
    const style = sectionStyle(section);
    const nodes = sectionNodes(section);
    if (!nodes.length) return;
    if (style.contains('utility') && !slots.utility) slots.utility = nodes;
    else if (!slots.menu && section.querySelector('ul')) {
      slots.menu = nodes;
      tabbed = style.contains('tabs');
    } else if (!slots.brand) slots.brand = nodes;
    else slots.ctas.push(...nodes);
  });

  const skip = el('a', 'header-skip', { href: '#main-content' });
  skip.textContent = 'Skip to content';
  const main = document.querySelector('main');
  if (main && !document.getElementById('main-content')) main.id = 'main-content';

  const inner = el('div', 'header-inner');
  const bar = el('div', 'header-bar');
  const brand = el('div', 'header-brand');
  if (slots.brand) brand.append(...slots.brand);
  decorateBrand(brand);

  const panel = el('div', 'header-panel', { id: 'header-panel' });
  const nav = slots.menu ? el('nav', 'header-nav', { 'aria-label': 'Main Menu' }) : null;
  if (nav) {
    nav.append(...slots.menu);
    if (tabbed) nav.classList.add('tabs');
    decorateMenu(nav, tabbed);
  }
  const utility = slots.utility ? el('div', 'header-utility') : null;
  if (utility) utility.append(...slots.utility);
  const ctas = slots.ctas.length ? el('div', 'header-ctas') : null;
  if (ctas) ctas.append(...slots.ctas);
  [utility, ctas].forEach((c) => c && retargetSpanish(c));

  const toggle = el('button', 'header-toggle', {
    type: 'button',
    'aria-label': 'Open The Main Menu',
    'aria-expanded': 'false',
    'aria-controls': 'header-panel',
  });
  toggle.append(el('span', 'header-icon-menu', { 'aria-hidden': 'true' }));

  bar.append(brand, toggle);
  inner.append(bar, panel);
  block.classList.add(nav ? 'has-nav' : 'no-nav');
  block.append(skip, inner);

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close The Main Menu' : 'Open The Main Menu');
    block.classList.toggle('is-open', open);
  };

  // one set of authored nodes, moved between the desktop and mobile layouts
  const place = () => {
    if (isDesktop.matches) {
      if (utility) inner.prepend(utility);
      if (ctas) bar.insertBefore(ctas, toggle);
      if (nav) bar.after(nav);
      setOpen(false);
    } else {
      panel.append(...[nav, utility, ctas].filter(Boolean));
    }
    if (nav) closeSubmenus(nav);
  };
  place();
  isDesktop.addEventListener('change', place);

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  block.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (nav && nav.querySelector('li.is-expanded')) closeSubmenus(nav);
    else if (block.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
  block.addEventListener('focusout', (e) => {
    if (nav && isDesktop.matches && !nav.contains(e.relatedTarget)) closeSubmenus(nav);
  });
}
