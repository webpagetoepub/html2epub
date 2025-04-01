import { Step } from '../../step';

const DESCRIPTION = 'Fix links';

function fixLinks(splitedContents: Element[], originUrl: string) {
  const linksElements = splitedContents.flatMap(splitedContent => Array.from(splitedContent.querySelectorAll('a[href]')));

  for (const linkElement of linksElements) {
    let newUrl = linkElement.getAttribute('href');
    newUrl = convertUrlToAbsolute(newUrl, originUrl);
    newUrl = retrieveAnchorIfLocalUrl(newUrl, originUrl);

    linkElement.setAttribute('href', newUrl);
  }

  return splitedContents;
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
