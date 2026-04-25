import { Step, Process } from '../step';
import reduceHeadingLevelPage from './reduce_heading_level';
import convertNoscriptToDiv from './convert_noscript_div';
import replaceUnknownElements from './replace_unknown_elements';

const DESCRIPTION = 'Replace HTML elements';


async function replaceElements(htmlDoc: HTMLDocument) {
  const htmlDocStep = new Step('HTML document step', () => htmlDoc);

  const replaceElementsProcess = new Process();
  replaceElementsProcess.addStep(htmlDocStep);
  replaceElementsProcess.addStep(reduceHeadingLevelPage, [htmlDocStep]);
  replaceElementsProcess.addStep(convertNoscriptToDiv, [htmlDocStep]);
  replaceElementsProcess.addStep(replaceUnknownElements, [htmlDocStep]);

  await replaceElementsProcess.process(() => {}, () => {});
}

export default new Step(DESCRIPTION, replaceElements);
