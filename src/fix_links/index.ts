import replaceUrlLinks from './replace_url_links';
import setExternalLinksBlank from './set_external_links_blank';
import removeBrokenAnchorLinks from './remove_broken_anchor_links';
import { Step, SubProcessStep, Process } from '../step';
import { SplittedElement } from '../split_main_content';

const DESCRIPTION = 'Fix links';


function buildFixLinksProcess(splitedContents: SplittedElement[], originUrl: string): Process {
  const splitedContentsStep = new Step(
    'Splitted elements step',
    () => splitedContents.map(splitedContent => splitedContent.element)
  );
  const originUrlStep = new Step('Origin URL step', () => originUrl);

  return new Process([
    {step: splitedContentsStep},
    {step: originUrlStep},
    {step: replaceUrlLinks, dependencies: [splitedContentsStep, originUrlStep]},
    {step: setExternalLinksBlank, dependencies: [replaceUrlLinks]},
    {step: removeBrokenAnchorLinks, dependencies: [replaceUrlLinks]},
  ]);
}

export default new SubProcessStep(DESCRIPTION, buildFixLinksProcess);
