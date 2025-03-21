import setCompleteUrls from './set_complete_url';

import { Step, Process } from '../../step';

const DESCRIPTION = 'Fix URLs';

async function fixUrls(mainElement: Element, url: string) {
  const mainElementStep = new Step(null, () => mainElement);
  const urlStep = new Step(null, () => url);

  const fixURLsProcess = new Process();

  fixURLsProcess.addStep(urlStep);
  fixURLsProcess.addStep(mainElementStep);
  fixURLsProcess.addStep(setCompleteUrls, [mainElementStep, urlStep]);

  await fixURLsProcess.process(() => {}, () => {});
}

export default new Step(DESCRIPTION, fixUrls);
