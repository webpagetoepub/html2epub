import Client from './client';
import CantLoadFileError from './cantloadfileerror';
import FileNotAllowedError from './filenotallowederror';


export default class DirectClient implements Client {
  requestTextContent(url: string) {
    return DirectClient.requestUrl(url).then(response => {
      const contentType = response.headers.get('content-type');
      if (!contentType.includes('text/html')) {
        throw new FileNotAllowedError(url);
      }

      return response.text();
    });
  }

  loadFileFrom(url: string) {
    return DirectClient.requestUrl(url).then(response => response.blob());
  }

  static requestUrl(url: string) {
    return fetch(url).then(response => {
      if (!response.ok) {
        throw new CantLoadFileError(url);
      }

      return response;
    });
  }
}
