import fixUrlLinks from './fix_url_links';
import setExternalLinksBlank from './set_external_links_blank';
import removeBrokenAnchorLinks from './remove_broken_anchor_links';
import { Step, Process } from '../../step';
import { SplittedElement } from '../split_main_content';

const DESCRIPTION = 'Fix links';


async function fixLinks(splitedContents: SplittedElement[], originUrl: string) {
  const splitedContentsStep = new Step(null, () => splitedContents.map(splitedContent => splitedContent.element));
  const originUrlStep = new Step(null, () => originUrl);

  const fixLinksProcess = new Process();

  fixLinksProcess.addStep(splitedContentsStep);
  fixLinksProcess.addStep(originUrlStep);
  fixLinksProcess.addStep(fixUrlLinks, [splitedContentsStep, originUrlStep]);
  fixLinksProcess.addStep(setExternalLinksBlank, [fixUrlLinks]);
  fixLinksProcess.addStep(removeBrokenAnchorLinks, [fixUrlLinks]);

  await fixLinksProcess.process(() => {}, () => {});
}

export default new Step(DESCRIPTION, fixLinks);
