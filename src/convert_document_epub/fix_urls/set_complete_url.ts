import { Step } from '../../step';

const DESCRIPTION = 'Set the complete URL';

function setCompleteUrls(mainElement: Element, originUrl: string) {
  const linksElements = mainElement.querySelectorAll(`a[href]`);

  for (const linkElement of Array.from(linksElements)) {
    setCompleteUrl(linkElement, originUrl);
  }

  return mainElement;
}

function setCompleteUrl(linkElement: Element, originUrl: string) {
  const href = linkElement.getAttribute('href');
  const completeUrl = new URL(href, originUrl).href;

  if (isSamePage(originUrl, completeUrl)) {
    return;
  }

  linkElement.setAttribute('href', completeUrl);
}

function isSamePage(originUrl: string, url: string) {
  var originUrlWithoutAnchor = originUrl.split('#')[0];
  var urlWithoutAnchor = url.split('#')[0];

  return originUrlWithoutAnchor === urlWithoutAnchor;
}

export default new Step(DESCRIPTION, setCompleteUrls);
