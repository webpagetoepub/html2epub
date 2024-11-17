import md5 from 'crypto-js/md5';

import { loadFileFrom } from './load_url';
import { Step } from '../step';

const DESCRIPTION = 'Loading images';


async function loadImages(mainElement: Element, url: string) {
  const images = getAllImages(mainElement);
  replaceImagesSrcByAbsoluteSrc(images, url);
  const imagesSrcs = getAllImagesSrcs(images);
  replaceImagesByID(images);

  const promises = imagesSrcs.map(loadImage);

  return Promise.allSettled(promises).then(results => results.filter(result => result.status === 'fulfilled').map((result: any) => result.value));
}

function getAllImages(mainElement: Element) {
  return Array.from(
    mainElement.querySelectorAll('img[src]')
  ).filter(element => element.getAttribute('src').trim());
}

function replaceImagesSrcByAbsoluteSrc(images: Element[], pageURL: string) {
  for (const image of images) {
    const imageSrc = image.getAttribute('src').trim();

    if (imageSrc.startsWith('data:')) {
      continue;
    }

    const imageAbsoluteSrc = new URL(imageSrc, pageURL).toString();
    image.setAttribute('src', imageAbsoluteSrc);
  }
}

function getAllImagesSrcs(images: Element[]) {
  const imagesUrls: string[] = [];

  for (const image of images) {
    imagesUrls.push(image.getAttribute('src'));
  }

  return Array.from(new Set(imagesUrls));
}

function replaceImagesByID(images: Element[]) {
  for (const image of images) {
    const imageSrc = image.getAttribute('src');
    const id = md5(imageSrc);

    const comment = document.createComment(`<%= image['${id}'] %>`);
    image.parentNode.replaceChild(comment, image)
  }
}

function loadImage(imageSrc: string) {
  const id = md5(imageSrc);

  return loadFileFrom(imageSrc).then(blob => {
    if (!blob.type.startsWith('image/')) {
      throw new Error();
    }

    return {id, blob};
  });
}

export default new Step(DESCRIPTION, loadImages);
