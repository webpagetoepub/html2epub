const PROXY_CORS = 'https://corsproxy.io/?';

export function loadDOMFrom(url: string) {
  const newUrl = PROXY_CORS + encodeURIComponent(url);

  return fetch(newUrl).then(response => response.text()).then(content => {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(content, 'text/html');

    return htmlDoc;
  });
}

export function loadFileFrom(url: string) {
  const newUrl = PROXY_CORS + encodeURIComponent(url);

  return fetch(newUrl).then(response => {
    if (response.ok) return response.blob();
    throw Error(`Can't load file "${url}"`);
  });
}
