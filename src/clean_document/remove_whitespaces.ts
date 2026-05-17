import { Step } from '../step';

const DESCRIPTION = 'Removing extra whitespaces';


function removeExtraWhitespacesFromDocument(htmlDoc: HTMLDocument) {
  function filterNode() {
    return NodeFilter.FILTER_ACCEPT;
  }

  mergeTextNodesElement(htmlDoc.documentElement);

  const iterator = htmlDoc.createNodeIterator(
    htmlDoc.documentElement,
    NodeFilter.SHOW_TEXT,
    filterNode,
  );
  let node;

  while ((node = iterator.nextNode()) !== null) {
    removeExtraWhitespaces(node as Text);
  }
}

function mergeTextNodesElement(element: Element) {
  const childNodesList = Array.from(element.childNodes);
  let lastNodeIsTextNode = false;

  for (let i = childNodesList.length - 1; i >= 0; i--) {
    const currentNode = childNodesList[i];
    const currentNodeIsTextNode = currentNode.nodeType === Node.TEXT_NODE;

    if (lastNodeIsTextNode && currentNodeIsTextNode) {
      const lastNode = childNodesList[i + 1];
      currentNode.nodeValue! += lastNode.nodeValue!;

      lastNode.remove();
    }

    lastNodeIsTextNode = currentNodeIsTextNode;
  }

  for (const child of Array.from(element.children)) {
    if (child.childNodes) {
      mergeTextNodesElement(child);
    }
  }
}

function removeExtraWhitespaces(textNode: Text) {
    if (!canRemoveWhitespaces(textNode)) {
      return;
    }

    textNode.nodeValue = textNode.nodeValue!.replace(/\r/g, '')
                                           .replace(/\t/g, ' ')
                                           .replace(/  +/g, ' ')
                                           .replace(/\n[\n ]+/g, '\n')
                                           .replace(/ +\n/g, '\n');
}

function canRemoveWhitespaces(textNode: Text) {
    const parentTagName = textNode.parentElement!.tagName;

    return ['PRE', 'CODE'].indexOf(parentTagName) == -1;
}

export default new Step(DESCRIPTION, removeExtraWhitespacesFromDocument);
