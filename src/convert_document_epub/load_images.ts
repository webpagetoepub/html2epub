import { loadFileFrom } from '../load_url';

export default async function loadImages(element: Element, url: string) {
  const images = getAllImages(element);

  const promises = images.map(
    image => loadImage(image, url, replaceImageForID(image))
  );

  return Promise.all(promises);
}

function getAllImages(element: Element) {
  return Array.from(element.querySelectorAll('img[src]'));
}

async function loadImage(
  image: Element,
  pageURL: string,
  callback: (blob: Blob) => {id: string, blob: Blob},
) {
  const imageSrc = image.getAttribute('src').trim();

  if (!imageSrc) {
    return;
  }

  const imageUrl = new URL(imageSrc, pageURL).toString();

  return await loadFileFrom(imageUrl).then(callback);
}

function replaceImageForID(
  image: Element,
): (blob: Blob) => {id: string, blob: Blob} {
  return (blob: Blob) => {
    const id = crypto.randomUUID();

    const comment = document.createComment(`<%= image['${id}'] %>`);
    image.parentNode.replaceChild(comment, image)

    return {id, blob};
  };
}
