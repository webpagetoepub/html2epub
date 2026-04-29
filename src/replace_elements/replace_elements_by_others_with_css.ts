import { Step } from '../step';
import replaceElementWithStructure from '../replace_element';

interface MyCSSProperties {
  [property: string]: string;
}
interface MyMap {
  [key: string]: {
    tag: string,
    properties: MyCSSProperties,
  };
}

const SIMPLE_TAGS: MyMap = {
  'mark': {
    tag: 'span',
    properties: {'background-color': '#ff0'},
  },
  'u': {
    tag: 'span',
    properties: {
      'text-decoration-color': 'red',
      'text-decoration-style': 'wavy',
      'text-decoration-line': 'underline',
      'text-decoration': 'red wavy underline',
    },
  },
  'center': {
    tag: 'div',
    properties: {'text-align': 'center'},
  }
};

const DESCRIPTION = 'Replace elements by others with CSS style';

function replaceElementsByOtherWithCSS(htmlDoc: HTMLDocument) {
  for (const fromTag in SIMPLE_TAGS) {
    if (!Object.prototype.hasOwnProperty.call(SIMPLE_TAGS, fromTag)) {
      continue;
    }

    const {tag: targetTag, properties} = SIMPLE_TAGS[fromTag];
    const elements = Array.from(htmlDoc.querySelectorAll(fromTag));
    elements.forEach(element => replaceElementTag(element, targetTag, properties));
  }
}

function replaceElementTag(element: Element, targetTag: string, properties: MyCSSProperties) {
  const targetElement = createElement(targetTag, properties);
  replaceElementWithStructure(element, targetElement);
}

function createElement(tag: string, properties: MyCSSProperties) {
  const element = document.createElement(tag);
  let styleValue = '';
  for (const property in properties) {
    if (!Object.prototype.hasOwnProperty.call(properties, property)) {
      continue;
    }

    styleValue = `${styleValue}${property}: ${properties[property]};`;
  }
  if (styleValue.length > 0) {
    element.setAttribute('style', styleValue);
  }

  return element;
}

export default new Step(DESCRIPTION, replaceElementsByOtherWithCSS);
