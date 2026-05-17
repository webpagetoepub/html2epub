import { Step } from '../step';

const DESCRIPTION = 'Replacing unknown HTML elements with div';

const HTML5_TAGS = new Set([
  // Content sectioning
  'address', 'article', 'aside', 'footer', 'header',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hgroup',
  'main', 'section',
  // Text content
  'blockquote', 'dd', 'div', 'dl', 'dt', 'figcaption', 'figure',
  'hr', 'li', 'ol', 'p', 'pre', 'ul',
  // Inline text semantics
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data',
  'dfn', 'em', 'i', 'kbd', 'mark', 'q', 'rp', 'rt', 'ruby',
  's', 'samp', 'small', 'span', 'strong', 'sub', 'sup',
  'time', 'u', 'var', 'wbr',
  // Image and multimedia
  'img',
  // Embedded content
  'picture', 'portal',
  // Scripting
  'noscript',
  // Demarcating edits
  'del', 'ins',
  // Table content
  'caption', 'table', 'tbody', 'td',
  'tfoot', 'th', 'thead', 'tr',
  // Forms
  'fieldset', 'form', 'label',
  'legend', 'meter', 'progress',
  // Interactive elements
  'details', 'summary',
]);

function replaceUnknownElements(htmlDoc: HTMLDocument) {
  const elements = Array.from(htmlDoc.querySelectorAll('body *'));

  for (const element of elements) {
    if (!HTML5_TAGS.has(element.tagName.toLowerCase())) {
      const div = document.createElement('div');
      while (element.firstChild) {
        div.appendChild(element.firstChild);
      }
      element.replaceWith(div);
    }
  }
}

export default new Step(DESCRIPTION, replaceUnknownElements);
