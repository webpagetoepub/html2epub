import { Step } from '../step';
import replaceElementWithStructure from './replace_element';

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
  replaceElementWithStructure(element, newElement);
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

export default new Step(DESCRIPTION, reduceHeadingLevelPage);
