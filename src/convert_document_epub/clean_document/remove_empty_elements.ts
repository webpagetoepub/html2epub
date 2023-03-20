const TAGS_CAN_REMOVE = [
  'SPAN', 'ABBR', 'CITE', 'EM', 'I', 'B', 'SUB', 'SUP', 'SMALL', 'STRONG',
  'MARK', 'DEL', 'S', 'CODE', 'P', 'OL', 'UL', 'LI', 'DIV', 'PRE', 'BLOCKQUOTE',
  'LABEL', 'ASIDE', 'ADDRESS', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'MAIN',
  'SECTION', 'HEADER', 'ARTICLE', 'FOOTER', 'SUMMARY', 'DETAILS', 'TABLE',
  'CAPTION', 'THEAD', 'TBODY', 'TFOOT',
];

export default function removeEmptyElements(htmlDoc: HTMLDocument) {
  function filterNode() {
    return NodeFilter.FILTER_ACCEPT;
  }

  const elements = [];
  const iterator = htmlDoc.createNodeIterator(
    htmlDoc.documentElement,
    NodeFilter.SHOW_ELEMENT,
    filterNode
  );
  let node: HTMLElement;

  while (node = iterator.nextNode() as HTMLElement) {
    elements.push(node);
  }

  for (const element of elements) {
    removeIfEmptyElement(element);
  }
}

function removeIfEmptyElement(element: HTMLElement) {
  if (canRemoveElement(element)) {
    const parentElement = element.parentElement;
    element.remove();

    removeIfEmptyElement(parentElement);
  }
}

function canRemoveElement(element: HTMLElement) {
  return (
    (TAGS_CAN_REMOVE.indexOf(element.tagName) !== -1)
    && (!element.innerHTML.trim())
  );
}
