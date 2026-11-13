/**
 * content-tile — half image / half copy tile with an optional icon list (overview items).
 *
 * Authoring rows, classified by content (never by index):
 *   - image row: one image, or two (desktop first, mobile second — swap at 640px).
 *     Its position among the rows sets the side:
 *     image row first = image left, after the text = image right.
 *   - item rows: two cells — an icon (`:icon-name:`) | optional h3 + copy paragraph(s).
 *   - text rows before the items: the heading (h2) + intro copy.
 *   - text rows after the items: CTA paragraph (a link alone; <strong> = red button,
 *     <em> = blue button, plain = text CTA) and legal paragraphs.
 *
 * @variants left | right — documentary; the image side follows the authored row order.
 * @variants navy (dark-blue item icons) | small-title (2rem / 2.5rem title — source text-small)
 * @variants spaced (module margin below — source tile without `no-margin`)
 * @variants app (mobile-app band: red rule on top, centred copy — source .getapp2)
 */

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

const isImageRow = (row) => !!row.querySelector('picture, img')
  && !row.textContent.trim() && !row.querySelector('.icon');

const isItemRow = (row) => row.children.length > 1 && !!row.children[0].querySelector('.icon');

const isCta = (p) => {
  const links = p.querySelectorAll('a');
  return links.length === 1 && p.textContent.trim() === links[0].textContent.trim();
};

function buildItem(row) {
  const li = document.createElement('li');
  li.className = 'overview-item';
  const [iconCell, ...rest] = [...row.children];
  const icon = div('overview-item-icon');
  iconCell.querySelectorAll('.icon img[data-icon-name]').forEach((img) => img.remove());
  [...iconCell.children].forEach((n) => icon.append(n));
  const content = div('overview-item-content');
  rest.forEach((cell) => [...cell.children].forEach((n) => content.append(n)));
  li.append(icon, content);
  return li;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .content-tile-row')) return;

  const rows = [...block.children];
  const row = div('content-tile-row');
  const column = div('content-tile-column');
  const title = div('content-tile-title');
  const copy = div('content-tile-copy');
  const cta = div('content-tile-cta');
  const legal = div('content-tile-legal');
  let list = null;
  let seenItems = false;

  rows.forEach((r) => {
    if (isImageRow(r)) {
      const img = div('content-tile-img');
      const pics = [...r.querySelectorAll('picture, img')]
        .filter((n) => n.tagName === 'PICTURE' || !n.closest('picture'));
      pics.forEach((n, i) => {
        let variant = 'all';
        if (pics.length > 1) variant = i === 0 ? 'desktop' : 'mobile';
        const w = div(`content-tile-media-${variant}`);
        w.append(n);
        img.append(w);
      });
      if (!column.parentElement) block.classList.add('image-first');
      row.append(img);
      return;
    }
    if (!column.parentElement) row.append(column);
    if (isItemRow(r)) {
      seenItems = true;
      if (!list) {
        list = document.createElement('ul');
        list.className = 'overview-items';
        copy.append(list);
      }
      list.append(buildItem(r));
      return;
    }
    [...r.children].forEach((cell) => {
      [...cell.children].forEach((n) => {
        if (/^H[1-6]$/.test(n.tagName) && !title.childElementCount) title.append(n);
        else if (n.tagName === 'P' && isCta(n) && (seenItems || n.querySelector('.button'))) {
          cta.append(n);
        } else if (seenItems || cta.childElementCount) legal.append(n);
        else copy.append(n);
      });
    });
  });

  [title, copy, cta, legal].forEach((slot) => {
    if (slot.childElementCount) column.append(slot);
  });
  if (!column.parentElement) row.append(column);
  block.replaceChildren(row);
}
