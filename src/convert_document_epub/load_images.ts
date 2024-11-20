import md5 from 'crypto-js/md5';
import { mime2ext } from 'jepub/src/utils.js';

import { loadFileFrom } from './load_url';
import { Step } from '../step';
import { isEmptySvg } from './clean_document/remove_empty_svg';

const DESCRIPTION = 'Loading images';
const parser = new DOMParser();


async function loadImages(mainElement: Element, url: string) {
  const images = getAllImages(mainElement);
  replaceImagesSrcByAbsoluteSrc(images, url);
  const imagesSrcs = getAllImagesSrcs(images);

  const promises = Object.entries(imagesSrcs).map(([src, images]) => {
    return loadImage(src).then(loadedImage => {
      images.forEach(image => replaceImageByID(image, loadedImage.id, loadedImage.blob));

      return loadedImage;
    });
  });

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
  const imagesUrls: { [src: string]: Element[]} = {};

  for (const image of images) {
    const src = image.getAttribute('src');
    if (!(src in imagesUrls)) {
      imagesUrls[src] = [];
    }

    imagesUrls[src].push(image);
  }

  return imagesUrls;
}

function replaceImageByID(image: Element, id: string, blob: Blob) {
  let extension = mime2ext(blob.type);
  if (extension === null) {
    extension = '';
  } else {
    extension = '.' + extension;
  }
  image.setAttribute('src', `assets/${id}${extension}`);
}

function loadImage(imageSrc: string) {
  const id = md5(imageSrc);

  return loadFileFrom(imageSrc).then(async (blob) => {
    if (!blob.type.startsWith('image/')) {
      throw new Error();
    }

    if (blob.type === 'image/svg+xml') {
      const svgContent = await blob.text();
      const svg = parser.parseFromString(svgContent, 'text/xml');
      if (isEmptySvg(svg)) {
        throw new Error();
      }
    }

    return {id, blob};
  });
}

export default new Step(DESCRIPTION, loadImages);
