import convertTextToDOM from './convert_text_dom';
import getMetadata from './get_metadata';
import cleanDocument from './clean_document';
import replaceElements from './replace_elements';
import getMainContent from './get_main_content';
import splitContentByHeadings, { SplittedElement } from './split_main_content';
import loadImagesStepFactory from './load_images';
import createEPUB from './create_epub';
import fixLinks from './fix_links';
import { Step, Process } from './step';


export default async function convertDocumentToEPub(
  url: string,
  htmlContent: Promise<string>,
  loadImageFrom: (url: string) => Promise<Blob>,
  callbackStep: (currentStep: number) => void,
  callbackLength: (length: number) => void,
) {
  const urlStep = new Step('URL recover step', () => url);
  const htmlContentStep = new Step(`Loading "${url}"`, () => htmlContent);
  const convertSplitedContentInHTMLContentStep = new Step(
    null,
    convertSplitedContentInHTMLContent,
  );
  const loadImages = loadImagesStepFactory(loadImageFrom);

  const convertDocumentProcess = new Process();
  convertDocumentProcess.addStep(urlStep);
  convertDocumentProcess.addStep(htmlContentStep);
  convertDocumentProcess.addStep(convertTextToDOM, [htmlContentStep]);
  convertDocumentProcess.addStep(getMetadata, [convertTextToDOM, urlStep]);
  convertDocumentProcess.addStep(cleanDocument, [convertTextToDOM]);
  convertDocumentProcess.addStep(replaceElements, [convertTextToDOM]);
  convertDocumentProcess.addStep(getMainContent, [convertTextToDOM]);
  convertDocumentProcess.addStep(loadImages, [getMainContent, urlStep]);
  convertDocumentProcess.addStep(
    splitContentByHeadings,
    [getMainContent, getMetadata],
  );
  convertDocumentProcess.addStep(fixLinks, [splitContentByHeadings, urlStep]);
  convertDocumentProcess.addStep(
    convertSplitedContentInHTMLContentStep,
    [splitContentByHeadings],
  );
  convertDocumentProcess.addStep(
    createEPUB,
    [convertSplitedContentInHTMLContentStep, getMetadata, loadImages],
  );

  return await convertDocumentProcess.process(callbackStep, callbackLength);
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

  return replaceCommentsImagesByImages(xhtmlDocument.body.innerHTML);
}

function replaceCommentsImagesByImages(content: string) {
  return content.replace(/<!--\s*<%= image\[/g, '<%= image[')
                .replace(/] %>\s*-->/g, '] %>');
}
