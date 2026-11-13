/**
 * modal-dialog — offer-term pop-up panel (source experience-fragment modal, .helix-modal).
 *
 * Authoring: one cell — a heading, then copy paragraphs. Paragraph roles by content:
 *  - a paragraph holding only bold text is the emphasis line (regal red);
 *  - a paragraph whose text is "or" is the ornament divider (rules either side).
 * Optional further rows: footnotes, left-aligned even in a centred dialog (source p.text-left).
 *
 * Two contexts:
 *  - inside the site modal (scripts/modals.js loads this page's .plain.html into
 *    dialog.site-modal on a link click): the block only lays out its copy;
 *  - standalone (the fragment URL opened directly): the block opens its own modal
 *    <dialog> (showModal on load, close button), as the source renders it.
 *
 * Blank lines above the emphasis line (source &nbsp; divs; the delivery pipeline drops
 * whitespace-only paragraphs) are a variant: blank-lines-1 / blank-lines-2.
 *
 * The grey rule under the heading (source span.horizontal-line in an nbsp-only paragraph,
 * also dropped by the pipeline) is the variant `rule`.
 *
 * @variants wide (750px box, large heading), center (centred copy), blank-lines-1|2, rule
 */

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

function role(n) {
  if (n.tagName !== 'P') return null;
  if (/^or$/i.test(n.textContent.trim())) return 'ornament';
  const kids = [...n.childNodes].filter((c) => c.nodeType !== 3 || c.textContent.trim());
  if (kids.length === 1 && kids[0].nodeType === 1 && /^(STRONG|B)$/.test(kids[0].tagName)) {
    return 'emphasis';
  }
  return null;
}

function openStandalone(block, body) {
  const dialog = document.createElement('dialog');
  dialog.className = 'modal-dialog-dialog';
  const content = div('modal-dialog-content');
  content.setAttribute('role', 'document');
  const nav = div('modal-dialog-nav');
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'modal-dialog-close';
  close.setAttribute('aria-label', 'Close Dialog Popup');
  const x = document.createElement('span');
  x.setAttribute('aria-hidden', 'true');
  x.textContent = '×';
  close.append(x);
  nav.append(close);
  const frame = div('modal-dialog-frame');
  frame.append(body);
  content.append(nav, frame);
  dialog.append(content);
  const heading = body.querySelector('h1, h2, h3');
  if (heading) dialog.setAttribute('aria-label', heading.textContent.trim());
  block.append(dialog);

  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    if (!e.target.closest('.modal-dialog-content')) dialog.close();
  });
  if (dialog.isConnected && !dialog.open) dialog.showModal();
}

export default function decorate(block) {
  if (block.querySelector('.modal-dialog-body')) return;

  const [main, ...noteRows] = [...block.children];
  const body = div('modal-dialog-body');
  const nodes = main ? [...main.querySelectorAll(':scope > div > *')] : [];
  nodes.forEach((n) => {
    const r = role(n);
    if (r) {
      const wrap = div(`modal-dialog-${r}`);
      wrap.append(n);
      body.append(wrap);
    } else {
      body.append(n);
    }
  });
  if (block.classList.contains('rule')) {
    const rule = div('modal-dialog-rule');
    rule.setAttribute('aria-hidden', 'true');
    const heading = body.querySelector(':scope > h1, :scope > h2, :scope > h3');
    if (heading) heading.after(rule);
    else body.prepend(rule);
  }
  const notes = noteRows.flatMap((row) => [...row.querySelectorAll(':scope > div > *')]);
  if (notes.length) {
    const wrap = div('modal-dialog-notes');
    wrap.append(...notes);
    body.append(wrap);
  }
  block.replaceChildren(body);

  if (!block.closest('.modal-fragment, .site-modal')) openStandalone(block, body);
}
