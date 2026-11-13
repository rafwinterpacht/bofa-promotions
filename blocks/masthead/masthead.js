/**
 * masthead — full-bleed hero band: background image(s) behind a heading, copy and CTAs.
 *
 * Authoring (classified by content, any row order):
 *   - image row: one or two images. Two = desktop first, mobile second (swap at 643px);
 *     one = used at every width. Rendered as a cover layer behind the text.
 *   - text row: the heading (the page's h1), copy paragraphs, CTA paragraphs
 *     (<strong> link = red button, <em> link = blue button, plain link = text link).
 *
 * @variants left (default — text left from 640px) | center (text centred at every width)
 * @variants dark (black text on a light image — source masthead--text-black)
 * @variants short (500px band from 1068px — source wrapper `default`, not `deep`)
 * @variants large (56px heading from 1068px — source heading text-large)
 * @variants spaced (module margin below — source masthead without `no-margin`)
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const isCta = (p) => {
  const links = p.querySelectorAll('a');
  return links.length > 0 && !p.querySelector('picture, img')
    && [...links].reduce((s, a) => s + a.textContent.trim().length, 0)
      >= p.textContent.trim().length;
};

export default function decorate(block) {
  if (block.querySelector(':scope > .masthead-wrapper')) return;

  // 1. QUERY before moving anything
  const pictures = [...block.querySelectorAll('picture')];
  block.querySelectorAll('img').forEach((img) => {
    if (!img.closest('picture')) pictures.push(img);
  });
  const heading = block.querySelector('h1, h2, h3');
  const ps = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
  const ctas = ps.filter(isCta);
  const copy = ps.filter((p) => !ctas.includes(p));
  const others = [...block.querySelectorAll('ul, ol')];

  // 2. CREATE the template slots
  const media = document.createElement('div');
  media.className = 'masthead-media';
  const wrapper = document.createElement('div');
  wrapper.className = 'masthead-wrapper';
  const section = document.createElement('div');
  section.className = 'masthead-section';
  const upper = document.createElement('div');
  upper.className = 'masthead-upper';
  section.append(upper);
  wrapper.append(section);

  // 3. MOVE authored nodes
  pictures.forEach((pic, i) => {
    let cls = 'masthead-media-all';
    if (pictures.length > 1) cls = i === 0 ? 'masthead-media-desktop' : 'masthead-media-mobile';
    const img = pic.tagName === 'IMG' ? pic : pic.querySelector('img');
    if (img && i < 2) img.loading = 'eager';
    media.append(wrapNode(pic, cls));
  });
  if (heading) upper.append(wrapNode(heading, 'masthead-heading'));
  if (copy.length || others.length) {
    const c = document.createElement('div');
    c.className = 'masthead-copy';
    c.append(...copy, ...others);
    upper.append(c);
  }
  if (ctas.length) {
    const lower = document.createElement('div');
    lower.className = 'masthead-lower';
    lower.append(...ctas);
    section.append(lower);
  }

  block.replaceChildren(...(pictures.length ? [media] : []), wrapper);
}
