/**
 * masthead-notch — hero image with a white notch card overlapping its lower edge
 * (source .masthead with the floating card: heading, subheading, pill CTA).
 *
 * Authoring (classified by content, any row order):
 *   - image row: one or two images. Two = desktop first, mobile second (swap at 640px);
 *     one = used at every width.
 *   - text row: the heading (the page's h1), copy paragraphs, CTA paragraphs
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

export default function decorate(block) {
  if (block.querySelector(':scope > .masthead-notch-grid')) return;

  // 1. QUERY before moving anything
  const pictures = [...block.querySelectorAll('picture')];
  block.querySelectorAll('img').forEach((img) => {
    if (!img.closest('picture')) pictures.push(img);
  });
  const heading = block.querySelector('h1, h2, h3');
  const ps = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
  const ctas = ps.filter(isCta);
  const copy = ps.filter((p) => !ctas.includes(p));
  const lists = [...block.querySelectorAll('ul, ol')];

  // 2. CREATE the template slots
  const media = div('masthead-notch-media');
  const grid = div('masthead-notch-grid');
  const card = div('masthead-notch-card');
  grid.append(card);

  // 3. MOVE authored nodes
  pictures.forEach((pic, i) => {
    let cls = 'masthead-notch-img';
    if (pictures.length > 1) cls += i === 0 ? ' masthead-notch-desktop' : ' masthead-notch-mobile';
    const img = pic.tagName === 'IMG' ? pic : pic.querySelector('img');
    if (img && i < 2) img.loading = 'eager';
    const w = div(cls);
    w.append(pic);
    media.append(w);
  });
  if (heading) {
    const h = div('masthead-notch-heading');
    h.append(heading);
    card.append(h);
  }
  if (copy.length || lists.length) {
    const sub = div('masthead-notch-sub headline-sm-wrap');
    sub.append(...copy, ...lists);
    card.append(sub);
  }
  if (ctas.length) {
    const row = div('masthead-notch-cta');
    row.append(...ctas);
    card.append(row);
  }

  block.replaceChildren(media, grid);
}
