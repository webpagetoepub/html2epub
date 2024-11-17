import { Step } from '../step';
import replaceElementWithStructure from './replace_element';


const DESCRIPTION = 'Converting noscript tags to div';

function convertNoscriptToDiv(htmlDoc: HTMLDocument) {
  const noscripts = Array.from(htmlDoc.querySelectorAll('noscript'));
  noscripts.forEach(replaceElementByDiv);
}

function replaceElementByDiv(element: Element) {
  const div = document.createElement('div');
  replaceElementWithStructure(element, div);
}

export default new Step(DESCRIPTION, convertNoscriptToDiv);
