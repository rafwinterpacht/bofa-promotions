/**
 * long-form-text — centred text band (optional icon image above the copy).
 *
 * Authoring: one cell — an optional icon image paragraph, then copy paragraphs/lists.
 * The first copy paragraph after an icon is the lead (larger type).
 *
 * @variants blue (dark-blue band, white text) | red (bright-red band, white heading)
 * @variants flagscape (red flagscape band — source .secondary-cta--flagscape-red)
 * @variants white-cta (<em> link buttons render white with dark-blue text — source .cta--white)
 * Headings (h2) and CTA paragraphs (<strong>/<em> links) are centred; the h2 of a band with
 * CTAs is the source secondary-cta heading.
 */

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

const isPicturePara = (n) => n.tagName === 'PICTURE' || n.tagName === 'IMG'
  || (n.tagName === 'P' && !!n.querySelector('picture, img') && !n.textContent.trim());

export default function decorate(block) {
  if (block.querySelector(':scope > .long-form-text-wrapper')) return;

  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const wrapper = div('long-form-text-wrapper');
  let icon = null;
  let lead = null;
  nodes.forEach((n) => {
    if (isPicturePara(n) && !icon) {
      icon = div('long-form-text-icon');
      icon.append(n);
      wrapper.append(icon);
    } else if (icon && !lead && n.tagName === 'P') {
      lead = div('long-form-text-lead');
      lead.append(n);
      wrapper.append(lead);
    } else {
      wrapper.append(n);
    }
  });
  block.replaceChildren(wrapper);
}
