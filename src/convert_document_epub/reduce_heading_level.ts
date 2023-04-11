import { Step } from '../step';

const DESCRIPTION = 'Reducing the heading level';

const HEADING_MAP: { [key: string]: string } = {
  'H1': 'h2',
  'H2': 'h3',
  'H3': 'h4',
  'H4': 'h5',
  'H5': 'h6',
};

function reduceHeadingLevelPage(htmlDoc: HTMLDocument) {
  if (!hasH1Heading(htmlDoc)) {
    return;
  }

  const headings = Array.from(htmlDoc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  for (const heading of headings) {
    reduceHeadingLevel(heading);
  }
}

function hasH1Heading(htmlDoc: HTMLDocument) {
  return Array.from(htmlDoc.querySelectorAll('h1')).length > 0;
}

function reduceHeadingLevel(element: Element) {
  const newElement = getNewHeadingElementLowerThan(element);

  copyAttributes(element, newElement);
  copyChildNodes(element, newElement);

  element.parentNode.replaceChild(newElement, element);
}

function getNewHeadingElementLowerThan(element: Element) {
  const tagName = element.tagName;

  if (tagName === 'H6') {
    const newElement = document.createElement('p');
    newElement.setAttribute('role', 'heading');
    newElement.setAttribute('aria-level', '7');

    return newElement;
  }

  return document.createElement(HEADING_MAP[tagName]);
}

function copyAttributes(from: Element, to: Element) {
    for (const attribute of Array.from(from.attributes)) {
      to.setAttribute(attribute.name, attribute.value);
    }
}

function copyChildNodes(from: Element, to: Element) {
  const childNodesList = Array.from(from.childNodes);

  for (const childNode of childNodesList) {
    from.removeChild(childNode);

    to.appendChild(childNode);
  }
}

export default new Step(DESCRIPTION, reduceHeadingLevelPage);
