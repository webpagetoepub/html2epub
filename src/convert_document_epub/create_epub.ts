import jEpub from 'jepub/dist/jepub.js';

import { Step } from '../step';

const DESCRIPTION = 'Creating EPUB file';


export interface SplittedContent {
  title: string;
  content: string;
}


async function createEPUB(
  contents: SplittedContent[],
  metadata: any,
  images: {id: string, blob: Blob}[],
): Promise<{title: string, epub: Blob}> {
  const jepub = new jEpub();

  jepub.init({ i18n: 'en', ...metadata });
  jepub.uuid(metadata.uuid);
  jepub.date(metadata.date);

  images.forEach(image => jepub.image(image.blob, image.id));

  for (const content of contents) {
    jepub.add(content.title, content.content);
  }

  const epub = await jepub.generate('blob', (metadata: any) => {
    console.log('progression: ' + metadata.percent.toFixed(2) + ' %');

    if (metadata.currentFile) {
      console.log('current file = ' + metadata.currentFile);
    }
  });

  return {title: metadata.title, epub};
}

export default new Step(DESCRIPTION, createEPUB);
