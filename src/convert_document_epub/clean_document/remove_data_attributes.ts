import { Step } from '../../step';

const DESCRIPTION = 'Removing custom attributes';


function removeDataAttributes(htmlDoc: HTMLDocument) {
  function removeDataAttributesElement(element: Element) {
    const attributes = [];
    for (const attribute of Array.from(element.attributes)) {
      if (attribute.name.indexOf('data-') === 0) {
        attributes.push(attribute);
      }
    }

    for (const attribute of attributes) {
      element.removeAttribute(attribute.name);
    }
  }

  visitAllElements(htmlDoc, removeDataAttributesElement);
}

function visitAllElements(htmlDoc: HTMLDocument, callback: Function) {
  visitElement(htmlDoc.documentElement, callback);
}

function visitElement(element: Element, callback: Function) {
  callback(element);

  for (const child of Array.from(element.children)) {
    visitElement(child, callback);
  }
}

export default new Step(DESCRIPTION, removeDataAttributes);
