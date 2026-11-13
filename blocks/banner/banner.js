/**
 * banner — centred content banner: one large heading (source .content-banner).
 *
 * Authoring: one cell — the heading (plus any copy paragraphs).
 *
 * @variants dark (dark-blue band, white heading)
 */

export default function decorate(block) {
  if (block.querySelector(':scope > .banner-inner')) return;

  const inner = document.createElement('div');
  inner.className = 'banner-inner';
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    inner.append(...cell.children);
  });
  block.replaceChildren(inner);
}
