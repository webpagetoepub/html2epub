import { loadDOMFrom } from './load_url';
import convertDocumentToEPUB from './convert_document_epub';

const formElement = document.getElementById('form');

formElement.onsubmit = async (event: Event) => {
  event.preventDefault();

  const inputUrlElement = document.getElementById('url') as HTMLInputElement;
  const url = inputUrlElement.value;
  const externalDOM = await loadDOMFrom(url);

  convertDocumentToEPUB(externalDOM, url).then(downloadEPUB);

  return false;
};

function downloadEPUB(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.textContent = 'Download EPUB';
  link.download = 'pagina.epub';

  document.body.appendChild(link);
  link.click();
  link.remove();
}
