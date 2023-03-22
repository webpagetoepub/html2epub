const PROXY_CORS = 'https://corsproxy.io/?';

export function loadDOMFrom(url: string) {
  return requestUrl(url).then(response => response.text()).then(content => {
    const parser = new DOMParser();

    return parser.parseFromString(content, 'text/html');
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
