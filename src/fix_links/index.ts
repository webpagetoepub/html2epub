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

  const fixLinksProcess = new Process();

  fixLinksProcess.addStep(splitedContentsStep);
  fixLinksProcess.addStep(originUrlStep);
  fixLinksProcess.addStep(replaceUrlLinks, [splitedContentsStep, originUrlStep]);
  fixLinksProcess.addStep(setExternalLinksBlank, [replaceUrlLinks]);
  fixLinksProcess.addStep(removeBrokenAnchorLinks, [replaceUrlLinks]);

  return fixLinksProcess;
}

export default new SubProcessStep(DESCRIPTION, buildFixLinksProcess);
