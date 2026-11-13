/**
 * disclosures — the page's numbered footnotes on the grey legal ground.
 *
 * Authoring: one row per footnote, one cell: the footnote copy (paragraphs, lists), then a
 * paragraph holding only the return link `<a href="#footnote-<id>-0">N</a>` (the number).
 * Each footnote gets id `disclosure-<id>`, so in-copy `<sup><a href="#disclosure-<id>">`
 * references resolve; those references get ids `footnote-<id>-<k>` for the return links.
 *
 * A footnote row without a return link is a generic disclosure (no number); a list closing a
 * generic disclosure renders as the boxed "Not FDIC insured" table (source ul.table).
 *
 * @ew-exempt derived index — the visually hidden "Footnote N" label (screen readers) repeats
 *   the number of the authored return link; it is generated, the authored link stays editable.
 */

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

const RETURN = /^#footnote-(.+)-\d+$/;

const isReturnPara = (n) => {
  if (n.tagName !== 'P') return false;
  const links = n.querySelectorAll('a');
  return links.length === 1 && RETURN.test(links[0].getAttribute('href') || '')
    && n.textContent.trim() === links[0].textContent.trim();
};

function linkReferences(ids) {
  ids.forEach((id) => {
    document.querySelectorAll(`a[href="#disclosure-${id}"]`).forEach((a, k) => {
      if (!a.id) a.id = `footnote-${id}-${k}`;
    });
  });
}

export default function decorate(block) {
  if (block.querySelector(':scope > .disclosures-inner')) return;

  const inner = div('disclosures-inner');
  const ids = [];
  [...block.children].forEach((row) => {
    const item = div('disclosure');
    const text = div('disclosure-text');
    const body = div('disclosure-body');
    let note = null;
    [...row.querySelectorAll(':scope > div > *')].forEach((n) => {
      if (!note && isReturnPara(n)) {
        note = div('disclosure-note');
        note.append(n);
      } else {
        body.append(n);
      }
    });
    if (note) {
      const link = note.querySelector('a');
      const [, id] = link.getAttribute('href').match(RETURN);
      item.id = `disclosure-${id}`;
      ids.push(id);
      const label = document.createElement('a');
      label.className = 'disclosure-label';
      label.tabIndex = -1;
      label.setAttribute('aria-label', `Footnote ${link.textContent.trim()}`);
      label.textContent = link.textContent.trim();
      item.append(label);
    }
    // the first paragraph runs inline beside the number (source), the last has no bottom margin
    const paras = [...body.children].filter((n) => n.tagName === 'P');
    if (paras.length) {
      const lead = div('disclosure-lead');
      paras[0].before(lead);
      lead.append(paras[0]);
    }
    if (paras.length > 1) {
      const last = div('disclosure-last');
      paras[paras.length - 1].before(last);
      last.append(paras[paras.length - 1]);
    }
    text.append(body);
    if (note) text.append(note);
    item.append(text);
    inner.append(item);
  });
  block.replaceChildren(inner);
  linkReferences(ids);
}
