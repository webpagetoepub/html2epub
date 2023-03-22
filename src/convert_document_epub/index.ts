import getMetadata from './get_metadata';
import cleanDocument from './clean_document';
import getMainContent from './get_main_content';
import loadImages from './load_images';
import createEPUB from './create_epub';

export default async function convertDocumentToEPub(
  htmlDoc: HTMLDocument,
  url: string,
) {
  const metadata = getMetadata(htmlDoc, url);

  cleanDocument(htmlDoc);

  const content = getMainContent(htmlDoc);
  const images = await loadImages(content, url);

  return await createEPUB(
    getHtmlContent(content),
    metadata,
    images,
  );
}

function getHtmlContent(element: Element) {
  const htmlCode = new XMLSerializer().serializeToString(element);
  const xhtmlElement = new DOMParser().parseFromString(htmlCode, 'text/html');
  const xhtmlCode = new XMLSerializer().serializeToString(xhtmlElement);
  const xhtmlDocument = new DOMParser().parseFromString(xhtmlCode, 'text/html');

  return replaceCommentsImagesByImages(xhtmlDocument.body.innerHTML);
}

function replaceCommentsImagesByImages(content: string) {
  return content.replace(/<!\-\-\s*<%= image\[/g, '<%= image[')
                .replace(/] %>\s*\-\->/g, '] %>');
}
