import getMetadata from './get_metadata';
import cleanDocument from './clean_document';
import reduceHeadingLevelPage from './reduce_heading_level';
import getMainContent from './get_main_content';
import splitContentByHeadings, { SplittedElement } from './split_main_content';
import loadImages from './load_images';
import createEPUB from './create_epub';
import { Step, Process } from '../step';


export default async function convertDocumentToEPub(
  htmlDoc: HTMLDocument,
  url: string,
) {
  const htmlDocStep = new Step(null, () => htmlDoc);
  const urlStep = new Step(null, () => url);
  const convertSplitedContentInHTMLContentStep = new Step(
    null,
    convertSplitedContentInHTMLContent,
  );

  const convertDocumentProcess = new Process();
  convertDocumentProcess.addStep(htmlDocStep);
  convertDocumentProcess.addStep(urlStep);
  convertDocumentProcess.addStep(getMetadata, [htmlDocStep, urlStep]);
  convertDocumentProcess.addStep(cleanDocument, [htmlDocStep]);
  convertDocumentProcess.addStep(reduceHeadingLevelPage, [htmlDocStep]);
  convertDocumentProcess.addStep(getMainContent, [htmlDocStep]);
  convertDocumentProcess.addStep(loadImages, [getMainContent, urlStep]);
  convertDocumentProcess.addStep(
    splitContentByHeadings,
    [getMainContent, getMetadata],
  );
  convertDocumentProcess.addStep(
    convertSplitedContentInHTMLContentStep,
    [splitContentByHeadings],
  );
  convertDocumentProcess.addStep(
    createEPUB,
    [convertSplitedContentInHTMLContentStep, getMetadata, loadImages],
  );

  return await convertDocumentProcess.process();
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
  return content.replace(/<!\-\-\s*<%= image\[/g, '<%= image[')
                .replace(/] %>\s*\-\->/g, '] %>');
}
