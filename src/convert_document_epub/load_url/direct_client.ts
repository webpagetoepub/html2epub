import Client from './client';
import CantLoadFileError from './cantloadfileerror';


export default class DirectClient implements Client {
  requestTextContent(url: string) {
    return DirectClient.requestUrl(url).then(response => response.text());
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
