import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * Footer — the grey legal bar (canon .site-footer). Page disclosures are page content.
 * The footer document (default /footer, per page via `footer` metadata) is classified by
 * content: the paragraph holding only a link = logo; the one with several links = legal
 * links; the one with "©" = copyright; any other paragraph = the legal code (AR) line.
 * Authored nodes are MOVED into the slots.
 *
 * @ew-exempt page metadata `legal-code` (per-page AR line) replaces the default code line.
 */

const LOGO_SRC = '/icons/bofa-logo.svg';

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function isLogo(p) {
  const links = p.querySelectorAll('a');
  return links.length === 1 && p.textContent.trim() === links[0].textContent.trim();
}

function decorateLogo(p) {
  const link = p.querySelector('a');
  if (!link || link.querySelector('img, picture, .icon')) return;
  const label = el('span', 'visually-hidden');
  [...link.childNodes].forEach((n) => label.append(n));
  link.append(el('img', '', {
    src: LOGO_SRC, alt: '', width: '200', height: '20', loading: 'lazy',
  }), label);
}

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  block.textContent = '';
  if (!fragment) return;

  const nodes = [...fragment.querySelectorAll(':scope > .section > div')]
    .flatMap((wrapper) => [...wrapper.children])
    .filter((n) => !n.matches('.metadata, .metadata-wrapper, .section-metadata-wrapper'));
  const inner = el('div', 'footer-inner');
  let logoDone = false;
  let codeLine = null;
  nodes.forEach((node) => {
    if (node.tagName !== 'P') {
      inner.append(node);
      return;
    }
    if (!logoDone && isLogo(node)) {
      logoDone = true;
      node.classList.add('footer-logo');
      decorateLogo(node);
    } else if (node.querySelectorAll('a').length > 1) {
      node.classList.add('footer-copy');
      node.prepend(el('span', 'footer-lock', { 'aria-hidden': 'true' }));
      node.querySelectorAll('a[href*="equalhousing"]')
        .forEach((a) => a.classList.add('footer-ehl'));
    } else if (node.textContent.includes('©')) {
      node.classList.add('footer-copyright');
    } else if (!codeLine) {
      codeLine = node;
      node.classList.add('footer-code');
    }
    inner.append(node);
  });

  const code = getMetadata('legal-code');
  if (code) {
    const line = el('p', 'footer-code');
    line.textContent = code;
    if (codeLine) codeLine.replaceWith(line);
    else inner.append(line);
  }

  block.append(inner);
}
