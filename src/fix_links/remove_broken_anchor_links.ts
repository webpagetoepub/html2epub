import { Step } from "../step";
import replaceElementWithStructure from "../replace_element";

const DESCRIPTION = "Remove broken anchor links";

function removeBrokenAnchorLinks(splittedContents: Element[]) {
  for (let i = 0, length = splittedContents.length; i < length; i++) {
    const splittedContent = splittedContents[i];
    const anchorLinkElements = Array.from(
      splittedContent.querySelectorAll('a[href^="#"]'),
    );

    for (const anchorLinkElement of anchorLinkElements) {
      const anchor = anchorLinkElement.getAttribute("href")!.substring(1);
      const indexContent = indexOfAnchor(splittedContents, anchor);

      if (indexContent === -1) {
        replaceLinkBySpan(anchorLinkElement);
      } else if (indexContent !== i) {
        fixAnchorLink(anchorLinkElement, indexContent);
      }
    }
  }

  return splittedContents;
}

function indexOfAnchor(splittedContents: Element[], anchor: string) {
  for (let i = 0, length = splittedContents.length; i < length; i++) {
    const splittedContent = splittedContents[i];
    const anchorElement = splittedContent.querySelector(
      `[id="${anchor}"],a[name="${anchor}"]`,
    );

    if (anchorElement !== null) {
      return i;
    }
  }

  return -1;
}

function replaceLinkBySpan(anchorLinkElement: Element) {
  const span = document.createElement("span");
  replaceElementWithStructure(anchorLinkElement, span);
  span.removeAttribute("href");
}

function fixAnchorLink(anchorLinkElement: Element, indexContent: number) {
  const anchor = anchorLinkElement.getAttribute("href");
  const newHref = `page-${indexContent}.html${anchor}`;

  anchorLinkElement.setAttribute("href", newHref);
}

export default new Step(DESCRIPTION, removeBrokenAnchorLinks);
