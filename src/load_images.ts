import { Step } from "./step";
import {
  LoadedImage,
  assertImageBlob,
  getImageAttributes,
  hashImageSource,
  replaceImageByComment,
} from "./loaded_image";

import NO_IMAGE_DATA_URL from "../img/no-image.png";

const DESCRIPTION = "Loading images";

export default function loadImagesStepFactory(
  loadImageFrom: (url: string) => Promise<Blob>,
) {
  async function loadImages(mainElement: Element, url: string) {
    const loadImage = memoizedLoadImage();
    const replaceImageSrcByAbsoluteSrc =
      replaceImageSrcByPageURLAbsoluteSrc(url);

    const images = getAllImages(mainElement).filter(
      (image) => !image.getAttribute("src")!.startsWith("data:"),
    );
    images.forEach(replaceImageSrcByAbsoluteSrc);
    const promises = images.map((image) =>
      loadImage(image).then((loadedImage) => {
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

  function getAllImages(mainElement: Element) {
    return Array.from(mainElement.querySelectorAll("img[src]")).filter(
      (element) => element.getAttribute("src")!.trim(),
    );
  }

  function replaceImageSrcByPageURLAbsoluteSrc(pageURL: string) {
    return (image: Element) => {
      const srcURL = image.getAttribute("src")!.trim();
      const srcAbsoluteURL = new URL(srcURL, pageURL).toString();
      image.setAttribute("src", srcAbsoluteURL);
    };
  }

  function memoizedLoadImage() {
    const cache: Record<string, Promise<LoadedImage>> = {};

    return (image: Element) => {
      const srcURL = image.getAttribute("src")!;
      if (srcURL in cache) {
        return cache[srcURL];
      }

      const promise = loadImageFrom(srcURL)
        .then(async (blob) => {
          await assertImageBlob(blob, srcURL);

          return {
            id: hashImageSource(srcURL),
            blob,
            attributes: getImageAttributes(image),
          };
        })
        .catch((_) => {
          return fetch(NO_IMAGE_DATA_URL)
            .then((response) => response.blob())
            .then((blob) => ({ id: "no-image", blob, attributes: {} }));
        });

      cache[srcURL] = promise;

      return promise;
    };
  }

  return new Step(DESCRIPTION, loadImages);
}
