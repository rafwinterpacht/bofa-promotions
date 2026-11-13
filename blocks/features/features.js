/**
 * features — grey band: red heading, a row of icon features (title, icon, copy), then an
 * optional large pill CTA (source .features "Cash back made simple" + background CTA).
 *
 * Authoring (reconstructive, classified by content): the h2 is the band heading; every h3
 * opens a feature item that takes the icon image and copy that follow it; a paragraph that is
 * only a link (<strong><em> = red pill) is the band CTA.
 */

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

const isCta = (p) => {
  if (p.tagName !== 'P' || p.querySelector('picture, img')) return false;
  const links = p.querySelectorAll('a');
  return links.length > 0
    && [...links].reduce((s, a) => s + a.textContent.trim().length, 0)
      >= p.textContent.trim().length;
};

const isImagePara = (n) => (n.tagName === 'PICTURE' || n.tagName === 'IMG')
  || (n.tagName === 'P' && !!n.querySelector('picture, img') && !n.textContent.trim());

export default function decorate(block) {
  if (block.querySelector(':scope > .features-body')) return;

  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const body = div('features-body');
  const head = div('features-heading');
  const items = div('features-items');
  const cta = div('features-cta');
  let item = null;
  nodes.forEach((n) => {
    if (n.tagName === 'H2' && !item && !head.children.length) {
      head.append(n);
    } else if (n.tagName === 'H3') {
      item = div('features-item');
      item.append(n);
      items.append(item);
    } else if (isCta(n)) {
      cta.append(n);
    } else if (item && isImagePara(n)) {
      const icon = div('features-icon');
      icon.append(n);
      item.append(icon);
    } else if (item) {
      item.append(n);
    } else {
      head.append(n);
    }
  });
  if (head.children.length) body.append(head);
  if (items.children.length) body.append(items);
  block.replaceChildren(body, ...(cta.children.length ? [cta] : []));
}
