import { Step, Process } from '../step';

const DESCRIPTION = 'Fix URLs';

async function fixUrls(mainElement: Element, originUrl: string) {
  const linksElements = mainElement.querySelectorAll(`a[href]`);

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
    var anchor = href.split('#')[1];

    if (anchor) {
      return `#${anchor}`;
    }
  }

  return href;
}

function isSamePage(originUrl: string, url: string) {
  var originUrlWithoutAnchor = originUrl.split('#')[0];
  var urlWithoutAnchor = url.split('#')[0];

  return originUrlWithoutAnchor === urlWithoutAnchor;
}

export default new Step(DESCRIPTION, fixUrls);
