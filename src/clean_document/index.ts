import removeElementsFromDocument from './remove_elements';
import removeHiddenElements from './remove_hidden_elements';
import removeAllComments from './remove_comments';
import removeEmptyElements from './remove_empty_elements';
import removeDataAttributes from './remove_data_attributes';
import removeAttributes from './remove_attributes';
import mergeTextNodes from './merge_text_nodes';
import removeExtraWhitespacesFromDocument from './remove_whitespaces';
import removeEmptySVGs from './remove_empty_svg';
import removeEmptyHeadings from './remove_empty_headings';
import { Step, SubProcessStep, Process } from '../step';

const DESCRIPTION = 'Cleaning HTML document';


function buildCleanDocumentProcess(htmlDoc: HTMLDocument): Process {
  const firstStep = new Step('HTML document step', () => htmlDoc);

  return new Process([
    {step: firstStep},
    {step: removeElementsFromDocument, dependencies: [firstStep]},
    {step: removeHiddenElements, dependencies: [firstStep]},
    {step: removeAllComments, dependencies: [firstStep]},
    {step: removeEmptyElements, dependencies: [firstStep]},
    {step: removeDataAttributes, dependencies: [firstStep]},
    {step: removeAttributes, dependencies: [firstStep]},
    {step: mergeTextNodes, dependencies: [firstStep]},
    {step: removeExtraWhitespacesFromDocument, dependencies: [firstStep]},
    {step: removeEmptySVGs, dependencies: [firstStep]},
    {step: removeEmptyHeadings, dependencies: [firstStep]},
  ]);
}

export default new SubProcessStep(DESCRIPTION, buildCleanDocumentProcess);
