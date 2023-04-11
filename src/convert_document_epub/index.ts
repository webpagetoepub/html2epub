import { requestTextContent } from './load_url';
import convertTextToDOM from './convert_text_dom';
import getMetadata from './get_metadata';
import cleanDocument from './clean_document';
import reduceHeadingLevelPage from './reduce_heading_level';
import getMainContent from './get_main_content';
import splitContentByHeadings, { SplittedElement } from './split_main_content';
import loadImages from './load_images';
import createEPUB from './create_epub';
import { Step, Process } from '../step';


export default async function convertDocumentToEPub(url: string) {
  const urlStep = new Step(null, () => url);
  const loadTextContentFromStep = requestTextContent(url);
  const convertSplitedContentInHTMLContentStep = new Step(
    null,
    convertSplitedContentInHTMLContent,
  );

  const convertDocumentProcess = new Process();
  convertDocumentProcess.addStep(urlStep);
  convertDocumentProcess.addStep(loadTextContentFromStep, [urlStep]);
  convertDocumentProcess.addStep(convertTextToDOM, [loadTextContentFromStep]);
  convertDocumentProcess.addStep(getMetadata, [convertTextToDOM, urlStep]);
  convertDocumentProcess.addStep(cleanDocument, [convertTextToDOM]);
  convertDocumentProcess.addStep(reduceHeadingLevelPage, [convertTextToDOM]);
  convertDocumentProcess.addStep(getMainContent, [convertTextToDOM]);
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
