import jEpub from 'jepub/dist/jepub.js';

import step from '../step';

const DESCRIPTION = 'Creating ePUB file';


export interface SplittedContent {
  title: string;
  content: string;
}


async function createEPUB(
  contents: SplittedContent[],
  metadata: any,
  images: {id: string, blob: Blob}[],
): Promise<Blob> {
  const jepub = new jEpub();

  jepub.init({ i18n: 'en', ...metadata });
  jepub.uuid(metadata.uuid);
  jepub.date(metadata.date);

  images.forEach(image => jepub.image(image.blob, image.id));

  for (const content of contents) {
    jepub.add(content.title, content.content);
  }

  return await jepub.generate('blob', (metadata: any) => {
    console.log('progression: ' + metadata.percent.toFixed(2) + ' %');

    if (metadata.currentFile) {
      console.log('current file = ' + metadata.currentFile);
    }
  });
}

export default step(DESCRIPTION, createEPUB);
