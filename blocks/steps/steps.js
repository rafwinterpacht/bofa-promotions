/**
 * steps — numbered "how to qualify" steps: a heading, a list of steps (icon beside the copy
 * from 640px, stacked and centred below), and closing sub-copy.
 *
 * Authoring (classified by content, any number of steps):
 *   - heading row: the heading (h2).
 *   - one row per step: an icon image cell, the copy cell (paragraphs, optional table —
 *     its first row is the table head, its first column the row labels), an optional
 *     note cell (small italic note under the copy).
 *   - any other row: sub-copy shown after the steps.
 * The section may carry section metadata `Anchor | <id>`: the section gets that id so
 * in-page links (`#<id>`) land on it.
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

const text = (el) => (el ? el.textContent.trim() : '');

function cellNodes(cell) {
  if (!cell) return [];
  const nodes = [...cell.children];
  if (!nodes.length && text(cell)) {
    const p = document.createElement('p');
    p.append(...cell.childNodes);
    return [p];
  }
  return nodes;
}

function decorateTable(table) {
  const wrap = div('step-table-wrap');
  table.before(wrap);
  wrap.append(table);
  table.classList.add('bonus-table');
  [...table.rows].forEach((tr, i) => {
    if (i === 0) tr.classList.add('bonus-head');
    else if (tr.cells[0]) tr.cells[0].classList.add('bonus-label');
  });
}

function buildStep(row) {
  const cells = [...row.children];
  const iconCell = cells.find((c) => c.querySelector('picture, img'));
  const others = cells.filter((c) => c !== iconCell && (text(c) || c.querySelector('table')));
  const step = document.createElement('li');
  step.className = 'step';

  const icon = div('step-icon');
  const media = iconCell && (iconCell.querySelector('picture') || iconCell.querySelector('img'));
  if (media) {
    const holder = media.closest('p') || media;
    icon.append(holder);
    const img = icon.querySelector('img');
    if (img) {
      img.width = 100;
      img.height = 70;
    }
  }
  step.append(icon);

  const content = div('step-content');
  const copy = div('step-copy');
  cellNodes(others[0]).forEach((n) => copy.append(n));
  copy.querySelectorAll('table').forEach(decorateTable);
  content.append(copy);
  step.append(content);

  if (others.length > 1) {
    const note = div('step-note');
    others.slice(1).forEach((c) => cellNodes(c).forEach((n) => note.append(n)));
    step.append(note);
  }
  return step;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .steps-container')) return;

  const section = block.closest('.section');
  if (section && section.dataset.anchor && !section.id) section.id = section.dataset.anchor;

  // 1. QUERY: classify rows by content
  const rows = [...block.children];
  const stepRows = rows.filter((r) => r.querySelector('picture, img'));
  const headRow = rows.find((r) => !stepRows.includes(r) && r.querySelector('h1, h2, h3'));
  const subRows = rows.filter((r) => r !== headRow && !stepRows.includes(r));

  // 2. CREATE the template slots
  const container = div('steps-container');
  const inner = div('steps-inner');
  container.append(inner);

  // 3. MOVE authored nodes
  if (headRow) {
    cellNodes(headRow.firstElementChild).forEach((n) => {
      if (/^H[1-6]$/.test(n.tagName)) inner.append(wrapNode(n, 'steps-heading'));
      else inner.append(n);
    });
  }
  if (stepRows.length) {
    const list = document.createElement('ol');
    list.className = 'steps-list';
    stepRows.forEach((r) => list.append(buildStep(r)));
    list.lastElementChild.classList.add('step-last');
    inner.append(list);
  }
  if (subRows.length) {
    const sub = div('steps-subcopy');
    subRows.forEach((r) => [...r.children].forEach((c) => {
      cellNodes(c).forEach((n) => sub.append(n));
    }));
    inner.append(sub);
  }

  block.replaceChildren(container);
}
