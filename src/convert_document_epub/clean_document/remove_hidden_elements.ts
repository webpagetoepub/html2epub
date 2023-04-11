import { Step } from '../../step';

const DESCRIPTION = 'Removing HTML hidden elements';


function removeHiddenElements(htmlDoc: HTMLDocument) {
  const hiddenElements = htmlDoc.querySelectorAll(`[hidden]`);

  for (const hiddenElement of Array.from(hiddenElements)) {
    hiddenElement.remove();
  }
}

export default new Step(DESCRIPTION, removeHiddenElements);
