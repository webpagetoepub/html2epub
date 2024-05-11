import DirectUrlProxy from './direct_url_proxy';

const PROXY_URL_CORS = 'https://proxy.mangaraiku.eu.org/?url=';

const proxy = new DirectUrlProxy(PROXY_URL_CORS);

export const requestTextContent = proxy.generateRequestTextContent();
export const loadFileFrom = proxy.generateLoadFileFrom();
