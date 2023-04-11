import { Step } from '../step';

const PROXY_CORS = 'https://corsproxy.io/?';


export function requestTextContent(urlDescription: string) {
  return new Step(`Downloading "${urlDescription}"`, (url: string) => {
    return requestUrl(url).then(response => response.text());
  });
}

export function loadFileFrom(url: string) {
  return requestUrl(url).then(response => {
    if (!response.ok) {
      throw Error(`Can't load file "${url}"`);
    }

    return response.blob();
  });
}

function requestUrl(url: string) {
  return fetch(url).catch(() => {
    const newUrl = PROXY_CORS + encodeURIComponent(url);

    return fetch(newUrl);
  });
}
