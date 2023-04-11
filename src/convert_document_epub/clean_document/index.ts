import removeElementsFromDocument from './remove_elements';
import removeHiddenElements from './remove_hidden_elements';
import removeAllComments from './remove_comments';
import removeEmptyElements from './remove_empty_elements';
import removeDataAttributes from './remove_data_attributes';
import removeAttributes from './remove_attributes';
import mergeTextNodes from './merge_text_nodes';
import removeExtraWhitespacesFromDocument from './remove_whitespaces';
import step, { Process } from '../../step';

const DESCRIPTION = 'Cleaning HTML document';


function cleanDocument(htmlDoc: HTMLDocument) {
  const cleanDocumentProcess = new Process();
  cleanDocumentProcess.addStep(removeElementsFromDocument);
  cleanDocumentProcess.addStep(removeHiddenElements);
  cleanDocumentProcess.addStep(removeAllComments);
  cleanDocumentProcess.addStep(removeEmptyElements);
  cleanDocumentProcess.addStep(removeDataAttributes);
  cleanDocumentProcess.addStep(removeAttributes);
  cleanDocumentProcess.addStep(mergeTextNodes);
  cleanDocumentProcess.addStep(removeExtraWhitespacesFromDocument);

  cleanDocumentProcess.process(htmlDoc);
}

export default step(DESCRIPTION, cleanDocument);
