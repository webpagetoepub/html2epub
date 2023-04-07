import removeElementsFromDocument from './remove_elements';
import removeHiddenElements from './remove_hidden_elements';
import removeAllComments from './remove_comments';
import removeEmptyElements from './remove_empty_elements';
import removeDataAttributes from './remove_data_attributes';
import removeAttributes from './remove_attributes';
import mergeTextNodes from './merge_text_nodes';
import removeExtraWhitespacesFromDocument from './remove_whitespaces';
import step from '../../step';

const DESCRIPTION = 'Cleaning HTML document';


function cleanDocument(htmlDoc: HTMLDocument) {
  removeElementsFromDocument(htmlDoc);
  removeHiddenElements(htmlDoc);
  removeAllComments(htmlDoc);
  removeEmptyElements(htmlDoc);
  removeDataAttributes(htmlDoc);
  removeAttributes(htmlDoc);
  mergeTextNodes(htmlDoc);
  removeExtraWhitespacesFromDocument(htmlDoc);
}

export default step(DESCRIPTION, cleanDocument);
