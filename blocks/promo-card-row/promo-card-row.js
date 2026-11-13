/**
 * promo-card-row — rounded promo card(s) on a light-blue ground: a square photo (right from
 * 640px, on top below) beside a logo, a heading and body copy.
 *
 * Authoring: one row per card, two cells (any order):
 *   - photo cell: one image (decorative photo, cover-cropped square);
 *   - text cell: optional logo image paragraph, the heading (h2/h3), body paragraphs.
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

function buildCard(row) {
  const cells = [...row.children];
  const textCell = cells.find((c) => c.querySelector('h1, h2, h3, h4'))
    || cells.find((c) => !c.querySelector('picture, img'))
    || cells[cells.length - 1];
  const mediaCell = cells.find((c) => c !== textCell && c.querySelector('picture, img'));

  const card = document.createElement('article');
  card.className = 'promo-card';

  const media = div('promo-card-media');
  if (mediaCell) {
    const pic = mediaCell.querySelector('picture') || mediaCell.querySelector('img');
    media.append(pic.closest('p') || pic);
  }

  const textBox = div('promo-card-text');
  const body = div('promo-card-body');
  const heading = textCell ? textCell.querySelector('h1, h2, h3, h4') : null;
  const nodes = textCell ? [...textCell.children] : [];
  nodes.forEach((n) => {
    if (n === heading) {
      textBox.append(wrapNode(n, 'promo-card-title'));
    } else if (!heading || nodes.indexOf(n) < nodes.indexOf(heading)) {
      if (n.querySelector('picture, img')) textBox.append(wrapNode(n, 'promo-card-logo'));
      else textBox.append(n);
    } else {
      body.append(n);
    }
  });
  if (body.children.length) textBox.append(body);

  if (mediaCell) card.append(media);
  card.append(textBox);
  return card;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .promo-card-row-inner')) return;

  const inner = div('promo-card-row-inner');
  [...block.children].forEach((row) => inner.append(buildCard(row)));
  block.replaceChildren(inner);
}
