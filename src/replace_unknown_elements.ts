import { Step } from './step';

const DESCRIPTION = 'Replacing unknown HTML elements with div';

const HTML5_ELEMENTS = new Set([
  // Content sectioning
  'address', 'article', 'aside', 'footer', 'header',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'main', 'nav', 'section',
  // Text content
  'blockquote', 'dd', 'div', 'dl', 'dt', 'figcaption', 'figure',
  'hr', 'li', 'ol', 'p', 'pre', 'ul',
  // Inline text semantics
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data',
  'dfn', 'em', 'i', 'kbd', 'mark', 'q', 'rp', 'rt', 'ruby',
  's', 'samp', 'small', 'span', 'strong', 'sub', 'sup',
  'time', 'u', 'var', 'wbr',
  // Image and multimedia
  'area', 'audio', 'img', 'map', 'track', 'video',
  // Embedded content
  'embed', 'iframe', 'object', 'picture', 'portal', 'source',
  // SVG and MathML
  'math', 'svg',
  // Scripting
  'canvas', 'noscript', 'script',
  // Demarcating edits
  'del', 'ins',
  // Table content
  'caption', 'col', 'colgroup', 'table', 'tbody', 'td',
  'tfoot', 'th', 'thead', 'tr',
  // Forms
  'button', 'datalist', 'fieldset', 'form', 'input', 'label',
  'legend', 'meter', 'optgroup', 'option', 'output', 'progress',
  'select', 'textarea',
  // Interactive elements
  'details', 'dialog', 'summary',
]);

function replaceUnknownElements(mainElement: Element) {
  const elements = Array.from(mainElement.querySelectorAll('*'));

  for (const element of elements) {
    if (!HTML5_ELEMENTS.has(element.tagName.toLowerCase())) {
      const div = document.createElement('div');
      while (element.firstChild) {
        div.appendChild(element.firstChild);
      }
      element.replaceWith(div);
    }
  }
}

export default new Step(DESCRIPTION, replaceUnknownElements);
