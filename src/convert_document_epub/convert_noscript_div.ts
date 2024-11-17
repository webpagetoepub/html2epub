import { Step } from '../step';
import replaceElementWithStructure from './replace_element';


const DESCRIPTION = 'Converting noscript tags to div';

function convertNoscriptToDiv(mainElement: Element) {
  const noscripts = Array.from(mainElement.querySelectorAll('noscript'));
  noscripts.forEach(replaceElementByDiv);
}

function replaceElementByDiv(element: Element) {
  const div = document.createElement('div');
  replaceElementWithStructure(element, div);
}

export default new Step(DESCRIPTION, convertNoscriptToDiv);
