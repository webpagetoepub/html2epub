import step from '../../step';

const DESCRIPTION = 'Removing unused HTML elements';

const EMBEDDED_ELEMENTS_TO_REMOVE = [
  'map', 'embed', 'object', 'video', 'audio', 'iframe', 'canvas', 'applet',
  'frameset',
];
const FORM_ELEMENTS_TO_REMOVE = [
  'button', 'input', 'textarea', 'select', 'output', 'datalist', 'keygen',
];
const METADATA_SCRIPT_ELEMENTS_TO_REMOVE = [
  'base', 'script', 'meta', 'link', 'style', 'template',
];
const INTERACTIVE_ELEMENTS_TO_REMOVE = ['menu', 'command', 'nav'];
const NOT_SUPPORTED_ELEMENTS_TO_REMOVE = ['svg'];

const ELEMENTS_TO_REMOVE = [].concat(
  EMBEDDED_ELEMENTS_TO_REMOVE,
  FORM_ELEMENTS_TO_REMOVE,
  METADATA_SCRIPT_ELEMENTS_TO_REMOVE,
  INTERACTIVE_ELEMENTS_TO_REMOVE,
  NOT_SUPPORTED_ELEMENTS_TO_REMOVE,
);

function removeElementsFromDocument(htmlDoc: HTMLDocument) {
  removeElementsByTags(htmlDoc, ELEMENTS_TO_REMOVE);
}

function removeElementsByTags(htmlDoc: HTMLDocument, tags: string[]) {
  for (const tag of tags) {
    const elements = htmlDoc.getElementsByTagName(tag);
    removeElements(elements);
  }
}

function removeElements(elements: HTMLCollectionOf<Element>) {
  for (let i = elements.length - 1; i >= 0; i--) {
    const element = elements[i];
    element.remove();
  }
}

export default step(DESCRIPTION, removeElementsFromDocument);
