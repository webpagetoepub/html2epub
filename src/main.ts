import { loadDOMFrom } from './load_url';
import convertDocumentToEPUB from './convert_document_epub';

function convertPageToEPUB(url: string) {
  return loadDOMFrom(url).then(
    externalDOM => convertDocumentToEPUB(externalDOM, url)
  );
}
