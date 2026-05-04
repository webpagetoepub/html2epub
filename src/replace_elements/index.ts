import { Step, SubProcessStep, Process } from '../step';
import reduceHeadingLevelPage from './reduce_heading_level';
import replaceUnknownElements from './replace_unknown_elements';
import replaceSimpleElementsTag from './replace_simple_elements_tag';

const DESCRIPTION = 'Replace HTML elements';


function buildReplaceElementsProcess(htmlDoc: HTMLDocument): Process {
  const htmlDocStep = new Step('HTML document step', () => htmlDoc);

  return new Process([
    {step: htmlDocStep},
    {step: reduceHeadingLevelPage, dependencies: [htmlDocStep]},
    {step: replaceSimpleElementsTag, dependencies: [htmlDocStep]},
    {step: replaceUnknownElements, dependencies: [htmlDocStep]},
  ]);
}

export default new SubProcessStep(DESCRIPTION, buildReplaceElementsProcess);
