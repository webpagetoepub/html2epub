import convertTextToDOM from './convert_text_dom';
import getMetadata from './get_metadata';
import cleanDocument from './clean_document';
import replaceElements from './replace_elements';
import getMainContent from './get_main_content';
import splitContentByHeadings, { SplittedElement } from './split_main_content';
import loadImagesStepFactory from './load_images';
import createEpubStepFactory from './create_epub';
import fixLinks from './fix_links';
import { Step, Process } from './step';
import { Logger } from './logger';


export default async function convertDocumentToEPub(
  url: string,
  htmlContent: Promise<string>,
  loadImageFrom: (url: string) => Promise<Blob>,
  callbackStepCompleted: () => void,
  callbackLength: (length: number) => void,
  logger: Logger,
) {
  const urlStep = new Step('URL recover step', () => url);
  const htmlContentStep = new Step(`Loading "${url}"`, () => htmlContent);
  const convertSplitedContentInHTMLContentStep = new Step(
    'Convert splited content in HTML content',
    convertSplitedContentInHTMLContent,
  );
  const loadImages = loadImagesStepFactory(loadImageFrom);
  const createEPUB = createEpubStepFactory(logger);

  const convertDocumentProcess = new Process([
    {step: urlStep},
    {step: htmlContentStep},
    {step: convertTextToDOM, dependencies: [htmlContentStep]},
    {step: getMetadata, dependencies: [convertTextToDOM, urlStep]},
    {step: cleanDocument, dependencies: [convertTextToDOM]},
    {step: replaceElements, dependencies: [convertTextToDOM]},
    {step: getMainContent, dependencies: [convertTextToDOM]},
    {step: loadImages, dependencies: [getMainContent, urlStep]},
    {step: splitContentByHeadings, dependencies: [getMainContent, getMetadata]},
    {step: fixLinks, dependencies: [splitContentByHeadings, urlStep]},
    {step: convertSplitedContentInHTMLContentStep, dependencies: [splitContentByHeadings]},
    {step: createEPUB, dependencies: [convertSplitedContentInHTMLContentStep, getMetadata, loadImages]},
  ]);

  callbackLength(convertDocumentProcess.getLength());

  return await convertDocumentProcess.process(callbackStepCompleted, logger);
}

function convertSplitedContentInHTMLContent(
  splitedContents: SplittedElement[],
) {
  return splitedContents.map(splitedContent => ({
    title: splitedContent.title,
    content: getHtmlContent(splitedContent.element),
  }));
}

function getHtmlContent(element: Element) {
  const htmlCode = new XMLSerializer().serializeToString(element);
  const xhtmlElement = new DOMParser().parseFromString(htmlCode, 'text/html');
  const xhtmlCode = new XMLSerializer().serializeToString(xhtmlElement);
  const xhtmlDocument = new DOMParser().parseFromString(xhtmlCode, 'text/html');

  return xhtmlDocument.body.innerHTML;
}
