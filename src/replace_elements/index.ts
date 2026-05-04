import { Step, SubProcessStep, Process } from '../step';
import reduceHeadingLevelPage from './reduce_heading_level';
import replaceUnknownElements from './replace_unknown_elements';
import replaceSimpleElementsTag from './replace_simple_elements_tag';

const DESCRIPTION = 'Replace HTML elements';


function buildReplaceElementsProcess(htmlDoc: HTMLDocument): Process {
  const htmlDocStep = new Step('HTML document step', () => htmlDoc);

  const replaceElementsProcess = new Process();
  replaceElementsProcess.addStep(htmlDocStep);
  replaceElementsProcess.addStep(reduceHeadingLevelPage, [htmlDocStep]);
  replaceElementsProcess.addStep(replaceSimpleElementsTag, [htmlDocStep]);
  replaceElementsProcess.addStep(replaceUnknownElements, [htmlDocStep]);

  return replaceElementsProcess;
}

export default new SubProcessStep(DESCRIPTION, buildReplaceElementsProcess);
