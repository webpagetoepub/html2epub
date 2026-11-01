import { isEmptySvg } from "./clean_document/remove_empty_svg";

const parser = new DOMParser();

// A single <img> that has been turned into an embeddable EPUB asset: the binary
// blob plus the `<img>` attributes to re-emit around it (see create_epub).
export interface LoadedImage {
  id: string;
  blob: Blob;
  attributes: Record<string, string>;
}

// Swap the <img> for a comment placeholder so jEpub can later inject the
// embedded asset path in its place (see create_epub `_processContent`).
export function replaceImageByComment(
  image: Element,
  loadedImage: LoadedImage,
) {
  const comment = document.createComment(`<%= image['${loadedImage.id}'] %>`);
  image.parentNode!.replaceChild(comment, image);
}

export async function assertImageBlob(
  blob: Blob,
  source: string,
): Promise<void> {
  if (!blob.type.startsWith("image/")) {
    throw new Error(
      `Expected an image/* blob for "${source}", got "${blob.type}".`,
    );
  }

  if (blob.type === "image/svg+xml") {
    const svg = parser.parseFromString(await blob.text(), "text/xml");
    if (isEmptySvg(svg)) {
      throw new Error(`Expected a non-empty SVG for "${source}".`);
    }
  }
}

export function getImageAttributes(image: Element): Record<string, string> {
  return Array.from(image.attributes).reduce(
    (attributes: Record<string, string>, attribute) => {
      if (attribute.nodeValue) {
        attributes[attribute.nodeName] = attribute.nodeValue;
      } else if (attribute.nodeName !== "alt") {
        attributes[attribute.nodeName] = attribute.nodeName;
      }

      return attributes;
    },
    {},
  );
}

export function hashImageSource(source: string): string {
  let hash = 0;

  if (source.length === 0) return "w" + hash.toString(36);

  for (let i = 0; i < source.length; i++) {
    const char = source.charCodeAt(i);
    hash = (hash << 5) - hash + char;
  }

  return "w" + (hash >>> 0).toString(36);
}
