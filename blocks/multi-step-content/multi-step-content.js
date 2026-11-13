/**
 * multi-step-content — section heading over a row of numbered steps (icon, heading, copy).
 *
 * Authoring (reconstructive — classified by content, segmented on the step heading):
 *   - the section heading (h2) and any intro paragraphs before the first step;
 *   - one step per row (or a run of elements): an icon (image, or an `:icon-name:` glyph
 *     paragraph), an optional step heading (h3 — or an h2 once the section heading is set),
 *     copy paragraph(s). A new step starts at each step heading, or at an icon once the
 *     current step has its heading or icon.
 *   - paragraphs after the last step's copy that sit in their own row = subcopy.
 *
 * @variants vertical (default — icon above heading, steps in a row from 640px)
 * @variants features (source .features metrics: 60px icons, 300px items, 1.25rem copy)
 * @variants gray (light-grey band) | red (bright-red section heading)
 * @variants spaced (module margin below — source module without `no-margin`)
 * @variants inline (icon beside the copy, three-column grid from 980px — source .features.threeCol)
 * @variants carousel (below 640px one step at a time with arrows and dash indicators —
 *   source .features slick carousel on /deposits/debitcard/overview)
 */

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

const isIconPara = (n) => n.tagName === 'P' && !!n.querySelector(':scope > .icon')
  && !n.textContent.trim();

const isPicturePara = (n) => isIconPara(n) || n.tagName === 'PICTURE' || n.tagName === 'IMG'
  || (n.tagName === 'P' && !!n.querySelector('picture, img') && !n.textContent.trim());

function newStep() {
  const step = div('multi-step-content-item');
  const icon = div('multi-step-content-item-icon');
  const copy = div('multi-step-content-item-copy');
  return {
    step, icon, copy, heading: null, hasIcon: false,
  };
}

const CHEVRON = '<svg viewBox="0 0 16 28" aria-hidden="true" focusable="false">'
  + '<polyline points="15,1 1,14 15,27" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';

function button(className, label, html) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = className;
  b.setAttribute('aria-label', label);
  b.innerHTML = html;
  return b;
}

/* carousel: the steps go into a clipped viewport; arrows and dashes move one step */
function carousel(list, items) {
  const viewport = div('multi-step-content-viewport');
  const track = div('multi-step-content-track');
  track.append(...items);
  viewport.append(track);
  const prev = button('multi-step-content-prev', 'Previous', CHEVRON);
  const next = button('multi-step-content-next', 'Next', CHEVRON);
  const dots = div('multi-step-content-dots');
  let index = 0;
  const go = (i) => {
    index = (i + items.length) % items.length;
    track.style.setProperty('--slide', index);
    [...dots.children].forEach((d, n) => d.setAttribute('aria-current', n === index));
  };
  items.forEach((item, n) => {
    const dot = button('multi-step-content-dot', `Go to slide ${n + 1}`, '');
    dot.addEventListener('click', () => go(n));
    dots.append(dot);
  });
  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));
  list.append(prev, viewport, next, dots);
  go(0);
}

function finish(s) {
  const parts = [];
  if (s.hasIcon) parts.push(s.icon);
  if (s.heading) parts.push(s.heading);
  if (s.copy.childElementCount) parts.push(s.copy);
  s.step.append(...parts);
  const items = div('multi-step-content-items');
  items.append(s.step);
  return items;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .multi-step-content-wrapper')) return;

  // icon-font glyphs: drop the /icons/<name>.svg image decorateIcons adds (no such file)
  block.querySelectorAll('.icon img[data-icon-name]').forEach((img) => img.remove());
  const rows = [...block.children];
  const wrapper = div('multi-step-content-wrapper');
  const head = div('multi-step-content-heading');
  const intro = div('multi-step-content-intro');
  const list = div('multi-step-content-list');
  const subcopy = div('multi-step-content-subcopy');
  const steps = [];
  let cur = null;

  rows.forEach((row) => {
    const nodes = [...row.querySelectorAll(':scope > div > *')];
    const isStepHeading = (n) => n.tagName === 'H3'
      || (n.tagName === 'H2' && head.childElementCount > 0);
    const rowHasStep = nodes.some((n) => isStepHeading(n) || isPicturePara(n));
    nodes.forEach((n) => {
      if (/^H[12]$/.test(n.tagName) && !head.childElementCount) {
        head.append(n);
      } else if (isPicturePara(n)) {
        if (!cur || cur.heading || cur.hasIcon) {
          cur = newStep();
          steps.push(cur);
        }
        cur.icon.append(n);
        cur.hasIcon = true;
      } else if (isStepHeading(n)) {
        if (!cur || cur.heading) {
          cur = newStep();
          steps.push(cur);
        }
        cur.heading = n;
      } else if (!cur) {
        intro.append(n);
      } else if (!rowHasStep) {
        subcopy.append(n);
      } else {
        cur.copy.append(n);
      }
    });
  });

  if (head.childElementCount) wrapper.append(head);
  if (intro.childElementCount) wrapper.append(intro);
  if (block.classList.contains('carousel') && steps.length > 1) {
    carousel(list, steps.map(finish));
  } else {
    steps.forEach((s) => list.append(finish(s), ' '));
  }
  list.append(subcopy);
  wrapper.append(list);
  block.replaceChildren(wrapper);
}
