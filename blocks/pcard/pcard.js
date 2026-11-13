/**
 * pcard — rounded "preferred card": an image half beside a text half (heading, copy and an
 * optional two-column list). Source .preferred-card.
 *
 * Authoring: a row of two cells, image | text or text | image — the authored order is the
 * visual order from 768px (image first = image left). An optional extra row with two or more
 * text cells renders as columns under the copy.
 */

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

const isMediaCell = (cell) => !!cell.querySelector('picture, img') && !cell.textContent.trim();

export default function decorate(block) {
  if (block.querySelector(':scope > .pcard-card')) return;

  // 1. QUERY
  const rows = [...block.children];
  const mediaCells = [];
  const textCells = [];
  const colRows = [];
  let imageFirst = false;
  rows.forEach((row) => {
    const cells = [...row.children];
    const textOnly = cells.filter((c) => !isMediaCell(c));
    if (textOnly.length > 1 && textOnly.length === cells.length && textCells.length) {
      colRows.push(cells);
      return;
    }
    cells.forEach((c) => {
      if (isMediaCell(c)) {
        if (!mediaCells.length && !textCells.length) imageFirst = true;
        mediaCells.push(c);
      } else {
        textCells.push(c);
      }
    });
  });

  // 2. CREATE
  const card = div('pcard-card');
  const media = div('pcard-img');
  const content = div('pcard-content');
  const body = div('pcard-body');
  const text = div('pcard-text');
  content.append(body);

  // 3. MOVE
  mediaCells.forEach((c) => c.querySelectorAll('picture, img').forEach((p) => {
    if (p.tagName === 'IMG' && p.closest('picture')) return;
    media.append(p);
  }));
  textCells.forEach((c) => {
    [...c.children].forEach((n) => {
      if (/^H[1-6]$/.test(n.tagName) && !body.querySelector('.pcard-heading')) {
        const h = div('pcard-heading');
        h.append(n);
        body.prepend(h);
      } else {
        text.append(n);
      }
    });
  });
  colRows.forEach((cells) => {
    const row = div('pcard-row');
    cells.forEach((c) => {
      const col = div('pcard-col');
      col.append(...c.childNodes);
      row.append(col);
    });
    text.append(row);
  });
  body.append(text);

  block.classList.toggle('image-left', imageFirst);
  block.classList.toggle('image-right', !imageFirst);
  card.append(...(media.children.length ? [media] : []), content);
  block.replaceChildren(card);
}
