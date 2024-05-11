import { requestTextContent, loadFileFrom } from './direct';

export default class DirectUrlProxy {
  proxyURL: string;

  constructor(proxyURL: string) {
    this.proxyURL = proxyURL;
  }

  generateRequestTextContent() {
    return (url: string) => requestTextContent(this.generateProxyUrl(url));
  }

  generateLoadFileFrom() {
    return (url: string) => loadFileFrom(this.generateProxyUrl(url));
  }

  generateProxyUrl(url: string) {
    return this.proxyURL + encodeURIComponent(url);
  }
}
