export default function mergeTextNodes(htmlDoc: HTMLDocument) {
  mergeTextNodesElement(htmlDoc.documentElement);
}

function mergeTextNodesElement(element: Element) {
  const childNodesList = Array.from(element.childNodes);
  let lastNodeIsTextNode = false;

  for (let i = childNodesList.length - 1; i >= 0; i--) {
    const currentNode = childNodesList[i];
    const currentNodeIsTextNode = currentNode.nodeType === Node.TEXT_NODE;

    if (lastNodeIsTextNode && currentNodeIsTextNode) {
      const lastNode = childNodesList[i + 1];
      currentNode.nodeValue += lastNode.nodeValue;

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
