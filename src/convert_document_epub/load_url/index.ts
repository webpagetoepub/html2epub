import { Step } from '../../step';

import directClient from './direct';
import mangaraikuClient from './proxy_mangaraiku';
import codetabsClient from './proxy_codetabs';
import alloriginsClient from './proxy_allorigins';


export function requestTextContent(urlDescription: string) {
  return new Step(`Downloading "${urlDescription}"`, (url: string) => {
    return directClient.requestTextContent(url)
        .catch(() => mangaraikuClient.requestTextContent(url))
        .catch(() => codetabsClient.requestTextContent(url))
        .catch(() => alloriginsClient.requestTextContent(url));
  });
}

export function loadFileFrom(url: string) {
  return directClient.loadFileFrom(url)
      .catch(() => mangaraikuClient.loadFileFrom(url))
      .catch(() => codetabsClient.loadFileFrom(url))
      .catch(() => alloriginsClient.loadFileFrom(url));
}
