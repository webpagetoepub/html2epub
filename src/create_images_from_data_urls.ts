import { Step } from "./step";
import {
  LoadedImage,
  assertImageBlob,
  getImageAttributes,
  hashImageSource,
  replaceImageByComment,
} from "./loaded_image";

const DESCRIPTION = "Creating images from data URLs";

// `loadImagesStepFactory` deliberately skips `data:` images because they carry
// no network source; this step decodes them into embeddable EPUB assets so they
// stop bloating the chapter XHTML as inline base64 and become real image files.
async function createImagesFromDataUrls(mainElement: Element) {
  const createImage = memoizedCreateImage();

  const images = getDataUrlImages(mainElement);
  const promises = images.map((image) =>
    createImage(image).then((loadedImage) => {
      replaceImageByComment(image, loadedImage);

      return loadedImage;
    }),
  );

  return Promise.allSettled(promises)
    .then((settledPromises) =>
      settledPromises
        .filter((promise) => promise.status === "fulfilled")
        .map((promise: PromiseFulfilledResult<LoadedImage>) => promise.value),
    )
    .then((results) => Array.from(new Set(results)));
}

function getDataUrlImages(mainElement: Element) {
  return Array.from(mainElement.querySelectorAll("img[src]")).filter((image) =>
    image.getAttribute("src")!.trim().startsWith("data:"),
  );
}

function memoizedCreateImage() {
  const cache: Record<string, Promise<LoadedImage>> = {};

  return (image: Element) => {
    const dataURL = image.getAttribute("src")!.trim();
    if (dataURL in cache) {
      return cache[dataURL];
    }

    const promise = fetch(dataURL)
      .then((response) => response.blob())
      .then(async (blob) => {
        await assertImageBlob(blob, dataURL);

        return {
          id: hashImageSource(dataURL),
          blob,
          attributes: getImageAttributes(image),
        };
      });

    cache[dataURL] = promise;

    return promise;
  };
}

export default new Step(DESCRIPTION, createImagesFromDataUrls);
