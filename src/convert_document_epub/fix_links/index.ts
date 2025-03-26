import fixUrlLinks from './fix_url_links';
import setExternalLinksBlank from './set_external_links_blank';
import { Step, Process } from '../../step';

const DESCRIPTION = 'Fix links';


async function fixLinks(mainElement: Element, originUrl: string) {
  const mainElementStep = new Step(null, () => mainElement);
  const originUrlStep = new Step(null, () => originUrl);

  const fixLinksProcess = new Process();

  fixLinksProcess.addStep(mainElementStep);
  fixLinksProcess.addStep(originUrlStep);
  fixLinksProcess.addStep(fixUrlLinks, [mainElementStep, originUrlStep]);
  fixLinksProcess.addStep(setExternalLinksBlank, [fixUrlLinks]);

  await fixLinksProcess.process(() => {}, () => {});
}

export default new Step(DESCRIPTION, fixLinks);
