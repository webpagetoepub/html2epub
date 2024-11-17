import Client from './client';
import CantLoadFileError from './cantloadfileerror';
import FileNotAllowedError from './filenotallowederror';

const PROXY_CORS = 'https://api.allorigins.win/get?url=';

interface AllOriginsResponse {
  contents: string;
  status: {
    url: string;
    content_type: string;
    http_code: number;
    response_time: number;
    content_length: number;
  };
}

class AllOriginsClient implements Client {
  requestTextContent(url: string) {
    return AllOriginsClient.requestUrl(url).then(response => {
      if (!response.status.content_type.includes('text/html')) {
        throw new FileNotAllowedError(url);
      }

      return response.contents;
    });
  }

  loadFileFrom(url: string) {
    return this.requestTextContent(url).then(dataUrl => {
      return fetch(dataUrl).then(response => response.blob());
    });
  }

  static requestUrl(url: string) {
    const newUrl = PROXY_CORS + encodeURIComponent(url);

    return fetch(newUrl).then(response => {
      if (!response.ok) {
        throw new CantLoadFileError(url);
      }

      return response.json();
    }).then((json: AllOriginsResponse) => {
      const http_code = json.status.http_code;
      if ((http_code < 200) && (http_code > 299)) {
        throw new CantLoadFileError(url);
      }

      return json;
    });
  }
}

export default new AllOriginsClient();
