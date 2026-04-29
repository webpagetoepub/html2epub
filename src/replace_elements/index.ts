import { Step, Process } from '../step';
import reduceHeadingLevelPage from './reduce_heading_level';
import replaceUnknownElements from './replace_unknown_elements';
import replaceSimpleElementsTag from './replace_simple_elements_tag';

const DESCRIPTION = 'Replace HTML elements';


async function replaceElements(htmlDoc: HTMLDocument) {
  const htmlDocStep = new Step('HTML document step', () => htmlDoc);

  const replaceElementsProcess = new Process();
  replaceElementsProcess.addStep(htmlDocStep);
  replaceElementsProcess.addStep(reduceHeadingLevelPage, [htmlDocStep]);
  replaceElementsProcess.addStep(replaceSimpleElementsTag, [htmlDocStep]);
  replaceElementsProcess.addStep(replaceUnknownElements, [htmlDocStep]);

  await replaceElementsProcess.process(() => {}, () => {});
}

export default new Step(DESCRIPTION, replaceElements);
