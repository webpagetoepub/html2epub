import { Step } from "../step";
import { collectNodes } from "./collect_nodes";

const DESCRIPTION = "Removing extra whitespaces";

function removeExtraWhitespacesFromDocument(htmlDoc: HTMLDocument) {
  mergeTextNodesElement(htmlDoc.documentElement);

  const textNodes = collectNodes<Text>(
    htmlDoc.documentElement,
    NodeFilter.SHOW_TEXT,
  );

  for (const textNode of textNodes) {
    removeExtraWhitespaces(textNode);
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

  textNode.nodeValue = textNode
    .nodeValue!.replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/  +/g, " ")
    .replace(/\n[\n ]+/g, "\n")
    .replace(/ +\n/g, "\n");
}

function canRemoveWhitespaces(textNode: Text) {
  const parentTagName = textNode.parentElement!.tagName;

  return ["PRE", "CODE"].indexOf(parentTagName) == -1;
}

export default new Step(DESCRIPTION, removeExtraWhitespacesFromDocument);
