import { Step } from '../../step';

import {
  requestTextContent as requestTextContentDirect,
  loadFileFrom as loadFileFromDirect,
} from './direct';
import {
  requestTextContent as requestTextContentProxyCodeTabs,
  loadFileFrom as loadFileFromProxyCodeTabs,
} from './proxy_codetabs';
import {
  requestTextContent as requestTextContentProxyMangaRaiku,
  loadFileFrom as loadFileFromProxyMangaRaiku,
} from './proxy_mangaraiku';
import {
  requestTextContent as requestTextContentProxyAllOrigins,
  loadFileFrom as loadFileFromProxyAllOrigins,
} from './proxy_allorigins';


export function requestTextContent(urlDescription: string) {
  return new Step(`Downloading "${urlDescription}"`, (url: string) => {
    return requestTextContentDirect(url)
        .catch(() => requestTextContentProxyMangaRaiku(url))
        .catch(() => requestTextContentProxyCodeTabs(url))
        .catch(() => requestTextContentProxyAllOrigins(url));
  });
}

export function loadFileFrom(url: string) {
  return loadFileFromDirect(url)
      .catch(() => loadFileFromProxyMangaRaiku(url))
      .catch(() => loadFileFromProxyCodeTabs(url))
      .catch(() => loadFileFromProxyAllOrigins(url));
}
