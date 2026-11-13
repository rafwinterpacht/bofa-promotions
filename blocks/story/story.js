/**
 * story — full-width photo with a frosted panel (logo, heading, copy, pill CTA); on phones
 * the photo stacks above the panel. Source .storyblock.
 *
 * Authoring (classified by content, any row order):
 *   - image row: one or two images. Two = desktop first (cover band from 640px), mobile
 *     second (stacked above the panel); one = used at every width.
 *   - panel row: an optional logo image, the heading, copy paragraphs, CTA paragraphs
 *     (<strong><em> link = red pill).
 */

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

const isCta = (p) => {
  const links = p.querySelectorAll('a');
  return links.length > 0 && !p.querySelector('picture, img')
    && [...links].reduce((s, a) => s + a.textContent.trim().length, 0)
      >= p.textContent.trim().length;
};

const pictureOf = (n) => n.querySelector('picture') || n.querySelector('img');

export default function decorate(block) {
  if (block.querySelector(':scope > .story-panel')) return;

  // 1. QUERY — the cell holding the heading is the panel; images elsewhere are the photo
  const heading = block.querySelector('h1, h2, h3, h4');
  const panelCell = heading ? heading.closest('div') : null;
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const photos = [];
  cells.filter((c) => c !== panelCell).forEach((c) => {
    c.querySelectorAll('picture, img').forEach((p) => {
      if (p.tagName === 'IMG' && p.closest('picture')) return;
      photos.push(p);
    });
  });
  const panelNodes = panelCell ? [...panelCell.children] : [];

  // 2. CREATE
  const bg = div('story-bg');
  const stack = div('story-stack');
  const panel = div('story-panel');

  // 3. MOVE
  photos.forEach((p, i) => {
    if (photos.length > 1 && i === 1) stack.append(p);
    else if (photos.length > 1) bg.append(p);
    else stack.append(p);
  });
  if (photos.length === 1) bg.classList.add('story-bg-empty');
  panelNodes.forEach((n) => {
    if (n.tagName === 'P' && n.querySelector('picture, img') && !n.textContent.trim()) {
      const logo = div('story-logo');
      logo.append(pictureOf(n));
      panel.append(logo);
    } else if (n === heading) {
      const t = div('story-title');
      t.append(n);
      panel.append(t);
    } else if (n.tagName === 'P' && isCta(n)) {
      let row = panel.querySelector(':scope > .story-cta');
      if (!row) {
        row = div('story-cta');
        panel.append(row);
      }
      row.append(n);
    } else {
      let sub = panel.querySelector(':scope > .story-sub');
      if (!sub) {
        sub = div('story-sub');
        panel.append(sub);
      }
      sub.append(n);
    }
  });
  stack.setAttribute('aria-hidden', 'true');
  [...bg.querySelectorAll('img'), ...stack.querySelectorAll('img')].forEach((img) => {
    img.loading = 'eager';
  });

  block.replaceChildren(bg, stack, panel);
}
