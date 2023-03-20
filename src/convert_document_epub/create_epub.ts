import jEpub from 'jepub/dist/jepub.js';

export default async function createEPUB(
  content: string,
  metadata: any,
  images: {id: string, blob: Blob}[],
): Promise<Blob> {
  const jepub = new jEpub();

  jepub.init({ i18n: 'en', ...metadata });
  jepub.uuid(metadata.uuid);
  jepub.date(metadata.date);

  images.forEach(image => jepub.image(image.blob, image.id));
  jepub.add(metadata.title, content);

  return await jepub.generate('blob', (metadata: any) => {
    console.log('progression: ' + metadata.percent.toFixed(2) + ' %');

    if (metadata.currentFile) {
      console.log('current file = ' + metadata.currentFile);
    }
  });
}
