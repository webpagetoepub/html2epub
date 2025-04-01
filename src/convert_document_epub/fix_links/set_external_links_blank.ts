import { Step, Process } from '../../step';
import replaceElementWithStructure from '../replace_element';

const DESCRIPTION = 'Set external links to open in a new tab';

function setExternalLinksBlank(mainElement: Element) {
  const linksElements = mainElement.querySelectorAll('a[href^="http://"], a[href^="https://"]');

  for (const linkElement of Array.from(linksElements)) {
    linkElement.setAttribute('target', '_blank');
  }

  return mainElement;
}

export default new Step(DESCRIPTION, setExternalLinksBlank);
