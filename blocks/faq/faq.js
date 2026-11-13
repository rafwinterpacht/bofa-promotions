/**
 * faq — accordion of questions (source .accordion, section-left, bright-red control).
 * Each question row toggles its answer; the chevron rotates when open. An optional options
 * paragraph (two links: "Expand all" | "Collapse all") opens or closes every item; only the
 * relevant one shows.
 *
 * Authoring (reconstructive, segmented on the question heading): every h2/h3 opens an item
 * and the content after it (paragraphs, lists) is its answer. A paragraph of exactly two
 * links before the first question is the options row (link 1 = expand, link 2 = collapse).
 */

let faqId = 0;

function el(tag, className, attrs = {}) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
  return n;
}

function decorateOptions(p) {
  const links = [...p.querySelectorAll('a')];
  const expand = el('span', 'faq-expand');
  const divider = el('span', 'faq-divider');
  const collapse = el('span', 'faq-collapse');
  const nodes = [...p.childNodes];
  const first = nodes.indexOf(links[0].closest('p > *') || links[0]);
  const second = nodes.indexOf(links[1].closest('p > *') || links[1]);
  nodes.forEach((n, i) => {
    if (i === first) expand.append(n);
    else if (i === second) collapse.append(n);
    else if (i > first && i < second) divider.append(n);
    else if (i < first) expand.append(n);
    else collapse.append(n);
  });
  p.append(expand, divider, collapse);
  return { expand: links[0], collapse: links[1] };
}

export default function decorate(block) {
  if (block.querySelector(':scope > .faq-items')) return;
  faqId += 1;

  // 1. QUERY
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const items = el('div', 'faq-items');
  const handles = [];
  let options = null;
  let answer = null;

  // 2-3. CREATE + MOVE
  nodes.forEach((n) => {
    if (/^H[2-4]$/.test(n.tagName)) {
      const k = handles.length + 1;
      const item = el('div', 'faq-item');
      const handle = el('div', 'faq-handle');
      const toggle = el('button', 'faq-toggle', {
        type: 'button',
        'aria-expanded': 'false',
        'aria-controls': `faq-${faqId}-answer-${k}`,
        'aria-labelledby': `faq-${faqId}-question-${k}`,
      });
      const title = el('div', 'faq-title');
      if (!n.id) n.id = `faq-${faqId}-question-${k}`;
      else toggle.setAttribute('aria-labelledby', n.id);
      title.append(n);
      handle.append(toggle, title);
      answer = el('div', 'faq-answer', { id: `faq-${faqId}-answer-${k}` });
      answer.append(el('div', 'faq-answer-text'));
      item.append(handle, answer);
      items.append(item);
      handles.push(handle);
    } else if (!answer && !options && n.tagName === 'P' && n.querySelectorAll('a').length === 2) {
      const row = el('div', 'faq-options');
      row.append(n);
      options = { row, ...decorateOptions(n) };
    } else if (answer) {
      answer.firstElementChild.append(n);
    } else {
      items.append(n);
    }
  });
  if (options) items.prepend(options.row);

  // behaviour
  const set = (h, open) => {
    h.classList.toggle('is-active', open);
    h.querySelector('.faq-toggle').setAttribute('aria-expanded', String(open));
    h.closest('.faq-item').classList.toggle('is-open', open);
  };
  const sync = () => {
    block.classList.toggle('all-open', handles.length > 0
      && handles.every((h) => h.classList.contains('is-active')));
  };
  handles.forEach((h) => h.addEventListener('click', () => {
    set(h, !h.classList.contains('is-active'));
    sync();
  }));
  if (options) {
    options.expand.addEventListener('click', (e) => {
      e.preventDefault();
      handles.forEach((h) => set(h, true));
      sync();
    });
    options.collapse.addEventListener('click', (e) => {
      e.preventDefault();
      handles.forEach((h) => set(h, false));
      sync();
    });
  }

  block.replaceChildren(items);
}
