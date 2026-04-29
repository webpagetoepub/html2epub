import { Step } from '../step';
import replaceElementWithStructure from '../replace_element';

interface MyMap {
  [key: string]: string[];
}

const SIMPLE_TAGS: MyMap = {
  'div': [
    'article', 'aside', 'details', 'figure', 'fieldset', 'footer', 'form',
    'header', 'hgroup', 'main', 'noframes', 'noscript', 'picture', 'search',
    'section',
  ],
  'ul': ['dir'],
  'span': ['bdi', 'data', 'label', 'rt', 'ruby', 'time', 'rp', 'wbr'],
  'p': ['figcaption', 'summary', 'legend'],
  'del': ['s', 'strike'],
};

const DESCRIPTION = 'Replace simple elements tag';

function replaceSimpleElementsTag(htmlDoc: HTMLDocument) {
  for (const targetTag in SIMPLE_TAGS) {
    if (!Object.prototype.hasOwnProperty.call(SIMPLE_TAGS, targetTag)) {
      continue;
    }

    const selector = SIMPLE_TAGS[targetTag].join(',');
    const elements = Array.from(htmlDoc.querySelectorAll(selector));
    elements.forEach(element => replaceElementTag(element, targetTag));
  }
}

function replaceElementTag(element: Element, targetTag: string) {
  const targetElement = document.createElement(targetTag);
  replaceElementWithStructure(element, targetElement);
}

export default new Step(DESCRIPTION, replaceSimpleElementsTag);
