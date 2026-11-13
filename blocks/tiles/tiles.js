/**
 * tiles — centred heading over a row of image tiles, each with a subheading and a CTA
 * (source .tiles / .tile).
 *
 * Authoring (reconstructive, classified by content): a cell holding only a heading (and
 * copy) before the first tile is the band heading; every cell with images is one tile.
 * Tile images by count: three = desktop (1068px+), tablet (640px+), mobile; two = desktop
 * (640px+), mobile; one = every width. Then the tile heading and the CTA paragraph
 * (<strong> link = red button).
 */

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

const MEDIA_CLASSES = {
  1: ['tiles-img-all'],
  2: ['tiles-img-desktop tiles-img-wide', 'tiles-img-mobile'],
  3: ['tiles-img-desktop', 'tiles-img-tablet', 'tiles-img-mobile'],
};

const isImagePara = (n) => (n.tagName === 'PICTURE' || n.tagName === 'IMG')
  || (n.tagName === 'P' && !!n.querySelector('picture, img') && !n.textContent.trim());

const isCta = (p) => {
  if (p.tagName !== 'P' || p.querySelector('picture, img')) return false;
  const links = p.querySelectorAll('a');
  return links.length > 0
    && [...links].reduce((s, a) => s + a.textContent.trim().length, 0)
      >= p.textContent.trim().length;
};

export default function decorate(block) {
  if (block.querySelector(':scope > .tiles-row')) return;

  const head = div('tiles-heading');
  const row = div('tiles-row');
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    if (!cell.querySelector('picture, img')) {
      head.append(...cell.children);
      return;
    }
    const item = div(row.children.length ? 'tiles-item' : 'tiles-item tiles-item-first');
    const media = div('tiles-media');
    const nodes = [...cell.children];
    const imgs = nodes.filter(isImagePara);
    const classes = MEDIA_CLASSES[Math.min(imgs.length, 3)] || [];
    imgs.forEach((n, i) => {
      const w = div(`tiles-img ${classes[i] || 'tiles-img-extra'}`);
      w.append(n.tagName === 'P' ? (n.querySelector('picture') || n.querySelector('img')) : n);
      media.append(w);
    });
    item.append(media);
    nodes.filter((n) => !imgs.includes(n)).forEach((n) => {
      if (/^H[1-6]$/.test(n.tagName)) {
        const h = div('tiles-subheading');
        h.append(n);
        item.append(h);
      } else if (isCta(n)) {
        const c = div('tiles-cta');
        c.append(n);
        item.append(c);
      } else {
        item.append(n);
      }
    });
    row.append(item);
  });
  block.replaceChildren(...(head.children.length ? [head] : []), row);
}
