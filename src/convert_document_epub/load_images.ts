import md5 from 'crypto-js/md5';

import { loadFileFrom } from './load_url';
import { Step } from '../step';
import { isEmptySvg } from './clean_document/remove_empty_svg';

import NO_IMAGE_DATA_URL from '../../img/no-image.png';

const DESCRIPTION = 'Loading images';
const parser = new DOMParser();

interface LoadedImage {
  id: string;
  blob: Blob;
}


async function loadImages(mainElement: Element, url: string) {
  const loadImage = memoizedLoadImage();
  const replaceImageSrcByAbsoluteSrc = replaceImageSrcByPageURLAbsoluteSrc(url);

  const images = getAllImages(mainElement)
      .filter(image => !image.getAttribute('src').startsWith('data:'));
  images.forEach(replaceImageSrcByAbsoluteSrc);
  const promises = images.map(image => loadImage(image).then(loadedImage => {
    replaceImageByID(image, loadedImage);

    return loadedImage;
  }));

  return Promise.allSettled(promises)
      .then(settledPromises => settledPromises.filter(promise => promise.status === 'fulfilled').map((promise: any) => promise.value))
      .then(results => Array.from(new Set(results)));
}

function getAllImages(mainElement: Element) {
  return Array.from(
    mainElement.querySelectorAll('img[src]')
  ).filter(element => element.getAttribute('src').trim());
}

function replaceImageSrcByPageURLAbsoluteSrc(pageURL: string) {
  return (image: Element) => {
    const srcURL = image.getAttribute('src').trim();
    const srcAbsoluteURL = new URL(srcURL, pageURL).toString();
    image.setAttribute('src', srcAbsoluteURL);
  };
}

function replaceImageByID(image: Element, loadedImage: LoadedImage) {
  const comment = document.createComment(`<%= image['${loadedImage.id}'] %>`);
  image.parentNode.replaceChild(comment, image)
}

function memoizedLoadImage() {
  let cache: {[src: string]: Promise<LoadedImage>} = {};

  return (image: Element) => {
    const srcURL = image.getAttribute('src');
    if (srcURL in cache) {
      return cache[srcURL];
    }

    const promise = loadFileFrom(srcURL).then(async (blob) => {
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

      const id = md5(srcURL);

      return {id, blob};
    }).catch(error => {
      return fetch(NO_IMAGE_DATA_URL)
          .then(response => response.blob())
          .then(blob => ({id: 'no-image', blob}));
    });

    cache[srcURL] = promise;

    return promise;
  }
}

export default new Step(DESCRIPTION, loadImages);
