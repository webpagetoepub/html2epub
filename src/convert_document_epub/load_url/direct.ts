import CantLoadFileError from './cantloadfileerror';

export function requestTextContent(url: string) {
  return requestUrl(url).then(response => response.text());
}

export function loadFileFrom(url: string) {
  return requestUrl(url).then(response => response.blob());
}

function requestUrl(url: string) {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new CantLoadFileError(url);
    }

    return response;
  });
}
