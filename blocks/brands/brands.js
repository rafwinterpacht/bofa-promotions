/**
 * brands — centred intro text (heading, subheading, lead-in) over a strip of brand images
 * (source .long-form-text + the two brand-logo tiles).
 *
 * Authoring (classified by content, any row order): text rows (headings, paragraphs);
 * image cells (one image each) form the strip, in authored order (two = 50/50 from 640px).
 */

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

const isImagePara = (n) => (n.tagName === 'PICTURE' || n.tagName === 'IMG')
  || (n.tagName === 'P' && !!n.querySelector('picture, img') && !n.textContent.trim());

export default function decorate(block) {
  if (block.querySelector(':scope > .brands-text')) return;

  const text = div('brands-text');
  const strip = div('brands-strip');
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    [...cell.children].forEach((n) => {
      if (isImagePara(n)) {
        const item = div('brands-item');
        item.append(n.tagName === 'P' ? n.querySelector('picture, img') : n);
        strip.append(item);
      } else {
        text.append(n);
      }
    });
  });
  strip.querySelectorAll('img').forEach((img) => img.setAttribute('role', 'img'));
  const parts = [];
  if (text.children.length) parts.push(text);
  if (strip.children.length) parts.push(strip);
  block.replaceChildren(...parts);
}
