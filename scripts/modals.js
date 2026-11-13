/*
 * Site modals (canon .modal-dialog, rebuilt as dialog.site-modal):
 *  - fragment modals: a link whose path starts with /content/experience-fragments/ (the
 *    source's offer-term modals) or /modals/ opens that page's .plain.html in a <dialog>;
 *  - exit notice: a link to a host outside Bank of America opens /modals/exit-notice first;
 *    its "#continue" link proceeds to the destination, "#cancel" closes.
 * Variant classes are read from the fragment's sections/blocks: a class containing `wide`
 * (750px box), `center` (centred text) or `notice` (exit-notice heading style).
 */

// eslint-disable-next-line import/no-cycle
import { decorateMain } from './scripts.js';
import { loadSections } from './aem.js';

const FRAGMENT_PREFIXES = ['/content/experience-fragments/', '/modals/'];
const EXIT_NOTICE = '/modals/exit-notice';
const SOURCE_HOSTS = ['promotions.bankofamerica.com'];
const SAFE_HOSTS = [
  'bankofamerica.com', 'bofa.com', 'ml.com', 'merrill.com', 'merrilledge.com',
  'aem.page', 'aem.live', 'hlx.page', 'hlx.live', 'localhost',
];

const cache = new Map();
let dialog;
let opener;

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function isSafeHost(host) {
  return host === window.location.hostname
    || SAFE_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
}

/** the modal path for a link, or null */
function modalPath(url) {
  if (url.origin !== window.location.origin && !SOURCE_HOSTS.includes(url.hostname)) return null;
  // EDS serves lower-case hyphenated paths (consumer_marketing → consumer-marketing)
  const path = url.pathname.replace(/\.(plain\.)?html$/, '').toLowerCase().replace(/_/g, '-');
  return FRAGMENT_PREFIXES.some((p) => path.startsWith(p)) ? path : null;
}

async function fetchFragment(path) {
  if (!cache.has(path)) {
    cache.set(path, fetch(`${path}.plain.html`).then((r) => (r.ok ? r.text() : null)));
  }
  const html = await cache.get(path);
  if (!html) {
    cache.delete(path);
    return null;
  }
  const main = document.createElement('main');
  // blocks can detect the modal context with block.closest('.modal-fragment')
  main.className = 'modal-fragment';
  main.innerHTML = html;
  // section metadata `style` -> section classes when the pipeline has not rendered it
  main.querySelectorAll(':scope > div > .section-metadata').forEach((meta) => {
    [...meta.children].forEach((row) => {
      const [key, value] = row.children;
      if (key && value && key.textContent.trim().toLowerCase() === 'style') {
        value.textContent.split(',').map((v) => v.trim().toLowerCase().replace(/\s+/g, '-'))
          .filter(Boolean).forEach((v) => meta.parentElement.classList.add(v));
      }
    });
    meta.remove();
  });
  main.querySelectorAll('img[src^="./media_"], source[srcset^="./media_"]').forEach((m) => {
    const attr = m.tagName === 'IMG' ? 'src' : 'srcset';
    m[attr] = new URL(m.getAttribute(attr), new URL(path, window.location)).href;
  });
  decorateMain(main);
  await loadSections(main);
  return main;
}

function getDialog() {
  if (dialog) return dialog;
  dialog = el('dialog', 'site-modal');
  const content = el('div', 'site-modal-content', { role: 'document' });
  const nav = el('div', 'site-modal-nav');
  const close = el('button', 'site-modal-close', {
    type: 'button',
    'aria-label': 'Close Dialog Popup',
  });
  const x = el('span', '', { 'aria-hidden': 'true' });
  x.textContent = '×';
  close.append(x);
  nav.append(close);
  const wrapper = el('div', 'site-modal-wrapper');
  wrapper.append(el('div', 'site-modal-body'));
  content.append(nav, wrapper);
  dialog.append(content);
  document.body.append(dialog);

  dialog.addEventListener('click', (e) => {
    const cancel = e.target.closest('.site-modal-close, a[href$="#cancel"]');
    if (cancel || !e.target.closest('.site-modal-content')) {
      e.preventDefault();
      dialog.close();
    }
  });
  dialog.addEventListener('close', () => {
    dialog.querySelector('.site-modal-body').replaceChildren();
    if (opener && opener.isConnected) opener.focus();
    opener = null;
  });
  return dialog;
}

function variants(main) {
  const tokens = [...main.querySelectorAll('.section, .block')]
    .flatMap((n) => [...n.classList]);
  return ['wide', 'center', 'notice'].filter((v) => tokens.some((t) => t.includes(v)));
}

function decorateNotice(body) {
  const h2 = body.querySelector('h2');
  if (!h2) return;
  const prev = h2.previousElementSibling;
  if (prev && prev.tagName === 'P') prev.classList.add('site-modal-eyebrow');
  if (!h2.nextElementSibling?.classList.contains('horizontal-line')) {
    h2.after(el('span', 'horizontal-line', { 'aria-hidden': 'true' }));
  }
}

function groupButtons(body) {
  body.querySelectorAll('.default-content-wrapper').forEach((wrapper) => {
    const ctas = [...wrapper.querySelectorAll(':scope > p.button-wrapper')];
    if (ctas.length < 2) return;
    const row = el('div', 'site-modal-links');
    ctas[0].before(row);
    row.append(...ctas);
  });
}

async function openModal(path, from, setup) {
  const main = await fetchFragment(path);
  if (!main) return false;
  const d = getDialog();
  const body = d.querySelector('.site-modal-body');
  const found = variants(main);
  d.className = ['site-modal', ...found.map((v) => `site-modal-${v}`)].join(' ');
  body.replaceChildren(...main.children);
  if (found.includes('notice')) decorateNotice(body);
  groupButtons(body);
  if (setup) setup(body);
  const heading = body.querySelector('h1, h2, h3');
  d.setAttribute('aria-label', (from && from.title) || (heading ? heading.textContent.trim() : ''));
  if (!d.open) {
    opener = from;
    d.showModal();
  }
  return true;
}

function exitNotice(url, from) {
  return openModal(EXIT_NOTICE, from, (body) => {
    body.querySelectorAll('a[href$="#continue"]').forEach((a) => {
      a.href = url.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.dataset.exitContinue = '';
      a.addEventListener('click', () => dialog.close());
    });
  });
}

async function onClick(e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
  const a = e.target.closest('a[href]');
  if (!a || a.matches('[data-exit-continue]')) return;
  let url;
  try {
    url = new URL(a.href, window.location);
  } catch {
    return;
  }
  if (!['http:', 'https:'].includes(url.protocol)) return;
  const path = modalPath(url);
  if (path) {
    e.preventDefault();
    if (!(await openModal(path, a))) window.location.href = url.href;
    return;
  }
  if (isSafeHost(url.hostname)) return;
  e.preventDefault();
  if (!(await exitNotice(url, a))) window.open(url.href, a.target || '_self', 'noopener');
}

export default function initModals() {
  document.addEventListener('click', onClick);
}
