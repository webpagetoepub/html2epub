import step from '../../step';

const DESCRIPTION = 'Removing extra whitespaces';


function removeExtraWhitespacesFromDocument(
  htmlDoc: HTMLDocument,
) {
  function filterNode() {
    return NodeFilter.FILTER_ACCEPT;
  }

  const iterator = htmlDoc.createNodeIterator(
    htmlDoc.documentElement,
    NodeFilter.SHOW_TEXT,
    filterNode,
  );
  let node;

  while (node = iterator.nextNode()) {
    removeExtraWhitespaces(node as Text);
  }
}

function removeExtraWhitespaces(textNode: Text) {
    if (!canRemoveWhitespaces(textNode)) {
      return;
    }

    textNode.nodeValue = textNode.nodeValue.replace(/\r/g, '')
                                           .replace(/\t/g, ' ')
                                           .replace(/  +/g, ' ')
                                           .replace(/\n[\n ]+/g, '\n')
                                           .replace(/ +\n/g, '\n');
}

function canRemoveWhitespaces(textNode: Text) {
    const parentTagName = textNode.parentElement.tagName;

    return ['PRE', 'CODE'].indexOf(parentTagName) == -1;
}

export default step(DESCRIPTION, removeExtraWhitespacesFromDocument);
