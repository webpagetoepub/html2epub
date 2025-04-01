import { Step } from '../../step';

const DESCRIPTION = 'Set external links to open in a new tab';

function setExternalLinksBlank(splitedContents: Element[]) {
  const linksElements = splitedContents.flatMap(splitedContent => Array.from(splitedContent.querySelectorAll('a[href^="http://"], a[href^="https://"]')));

  for (const linkElement of linksElements) {
    linkElement.setAttribute('target', '_blank');
  }

  return splitedContents;
}

export default new Step(DESCRIPTION, setExternalLinksBlank);
