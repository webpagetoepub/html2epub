import { Step } from '../step';

const DESCRIPTION = 'Splitting the main content from HTML document by headings';
const REMAINING_TEXT_LIMIT = 80;


export interface SplittedElement {
  title: string;
  element: Element;
}


function splitMainContentByHeadings(
  mainContent: Element,
  metadata: any,
): SplittedElement[] {
  let headings = Array.from(mainContent.getElementsByTagName('h2'));

  if (headings.length === 0) {
    return [{title: metadata.title, element: mainContent}];
  }

  if (headings.length > 1) {
    return splitMainContent(mainContent, metadata, headings);
  }

  headings = Array.from(mainContent.querySelectorAll('h2, h3'));

  return splitMainContent(mainContent, metadata, headings);
}

function splitMainContent(mainContent: Element, metadata: any, elementReferences: Element[]) {
  const contentElements = [];

  for (const elementReference of elementReferences.reverse()) {
    const ancestors: Element[] = [];
    let parentElement = elementReference;

    while (parentElement !== mainContent) {
      ancestors.push(parentElement);

      parentElement = parentElement.parentNode as Element;
    }

    const newRootContentElement = document.createElement('div');
    const title = recursiveSplitContent(ancestors, newRootContentElement);

    if (newRootContentElement.innerText.trim() !== '') {
      contentElements.push({title, element: newRootContentElement});
    }
  }

  const remainingText = mainContent.textContent.trim();
  if (remainingText.length >= REMAINING_TEXT_LIMIT) {
    const newRootContentElement = document.createElement('div');
    moveElementsToNewParent(mainContent, newRootContentElement);
    if (newRootContentElement.innerText.trim() !== '') {
      contentElements.push({title: metadata.title, element: newRootContentElement});
    }
  }

  return contentElements.reverse();
}

function recursiveSplitContent(
  ancestors: Element[],
  newParentElement: Element,
): string {
  const cloneAncestors = [ ...ancestors ];
  const element = cloneAncestors.pop();
  const currentParentElement = element.parentNode as Element;

  let title;
  if (cloneAncestors.length > 0) {
    const newElement = cloneElementOnly(element);
    title = recursiveSplitContent(cloneAncestors, newElement);
    newParentElement.appendChild(newElement);
  }

  moveElementsToNewParentAfter(currentParentElement, newParentElement, element);

  if (cloneAncestors.length === 0) {
    element.remove();

    title = (element as HTMLElement).innerText;
  }

  return title;
}

function cloneElementOnly(element: Element) {
  const tagName = element.tagName;
  const newElement = document.createElement(tagName);
  copyAttributes(element, newElement);

  return newElement;
}

function copyAttributes(from: Element, to: Element) {
    for (const attribute of Array.from(from.attributes)) {
      to.setAttribute(attribute.name, attribute.value);
    }
}

function moveElementsToNewParentAfter(
  currentParentElement: Element,
  newParentElement: Element,
  referenceElement: Element,
) {
  const childNodesList = Array.from(currentParentElement.childNodes);

  let foundDElement = false;
  for (const childNode of childNodesList) {
    if (foundDElement) {
      currentParentElement.removeChild(childNode);
      newParentElement.appendChild(childNode);
    } else if (childNode === referenceElement) {
      foundDElement = true;
    }
  }
}

function moveElementsToNewParent(
  currentParentElement: Element,
  newParentElement: Element,
) {
  const childNodesList = Array.from(currentParentElement.childNodes);

  for (const childNode of childNodesList) {
    currentParentElement.removeChild(childNode);
    newParentElement.appendChild(childNode);
  }
}

export default new Step(DESCRIPTION, splitMainContentByHeadings);
