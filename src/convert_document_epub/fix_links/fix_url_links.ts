import { Step, Process } from '../../step';
import replaceElementWithStructure from '../replace_element';

const DESCRIPTION = 'Fix links';

function fixLinks(mainElement: Element, originUrl: string) {
  const linksElements = mainElement.querySelectorAll('a[href]');

  for (const linkElement of Array.from(linksElements)) {
    let newUrl = linkElement.getAttribute('href');
    newUrl = convertUrlToAbsolute(newUrl, originUrl);
    newUrl = retrieveAnchorIfLocalUrl(newUrl, originUrl);

    linkElement.setAttribute('href', newUrl);
  }

  return mainElement;
}

function convertUrlToAbsolute(href: string, originUrl: string) {
  return new URL(href, originUrl).href;
}

function retrieveAnchorIfLocalUrl(href: string, originUrl: string) {
  if (isSamePage(originUrl, href)) {
    const anchor = href.split('#')[1];

    if (anchor) {
      return `#${anchor}`;
    }
  }

  return href;
}

function isSamePage(originUrl: string, url: string) {
  const originUrlWithoutAnchor = originUrl.split('#')[0];
  const urlWithoutAnchor = url.split('#')[0];

  return originUrlWithoutAnchor === urlWithoutAnchor;
}

export default new Step(DESCRIPTION, fixLinks);
