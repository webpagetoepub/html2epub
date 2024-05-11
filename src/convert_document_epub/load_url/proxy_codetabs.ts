import DirectUrlProxy from './direct_url_proxy';

const PROXY_URL_CORS = 'https://api.codetabs.com/v1/proxy?quest=';

const proxy = new DirectUrlProxy(PROXY_URL_CORS);

export const requestTextContent = proxy.generateRequestTextContent();
export const loadFileFrom = proxy.generateLoadFileFrom();
