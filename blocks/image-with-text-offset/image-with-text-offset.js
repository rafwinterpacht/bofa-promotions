/**
 * image-with-text-offset — wide photo with a coloured text panel overlapping its lower edge.
 *
 * Authoring (classified by content):
 *   - image row: one or two images. Two = desktop first, mobile second (swap at 643px).
 *   - text row: heading (h2), copy paragraphs, links. A bold link (<strong>) renders as a
 *     bold white text link; an italic link (<em>) stays a blue button.
 *
 * @variants left (panel offset to the left, photo inset on the right) | right (mirror)
 * @variants red (regal-red panel, default) | blue (dark-blue panel)
 */

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

const isPicturePara = (n) => n.tagName === 'PICTURE' || n.tagName === 'IMG'
  || (n.tagName === 'P' && !!n.querySelector('picture, img') && !n.textContent.trim());

export default function decorate(block) {
  if (block.querySelector(':scope > .image-with-text-offset-wrapper')) return;

  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const background = div('image-with-text-offset-background');
  background.setAttribute('role', 'presentation');
  const wrapper = div('image-with-text-offset-wrapper');
  const section = div('image-with-text-offset-section');
  const heading = div('image-with-text-offset-heading');
  const copy = div('image-with-text-offset-copy');

  const pics = nodes.filter(isPicturePara);
  pics.forEach((n, i) => {
    let variant = 'all';
    if (pics.length > 1) variant = i === 0 ? 'desktop' : 'mobile';
    const w = div(`image-with-text-offset-media-${variant}`);
    w.append(n);
    background.append(w);
  });
  nodes.filter((n) => !pics.includes(n)).forEach((n) => {
    if (/^H[1-6]$/.test(n.tagName) && !heading.childElementCount) heading.append(n);
    else copy.append(n);
  });

  // a bold link (<strong><a>) is the source's bold white text link, not a red button:
  // undo the primary buttonization the page decorator applied (the anchor itself stays).
  copy.querySelectorAll('a.button.primary').forEach((a) => {
    a.classList.remove('button', 'primary');
    a.classList.add('image-with-text-offset-strong');
    const par = a.closest('p.button-wrapper');
    if (par) par.classList.remove('button-wrapper');
  });

  if (heading.childElementCount) section.append(heading);
  if (copy.childElementCount) section.append(copy);
  wrapper.append(section);
  if (!block.classList.contains('right')) block.classList.add('left');
  block.replaceChildren(background, wrapper);
}
