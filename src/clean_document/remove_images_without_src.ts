import { Step } from "../step";
import hasAttributeText from "../has_attribute_text";

const DESCRIPTION = "Removing images without source";

// An <img> with no usable src can't be loaded into the EPUB; if it also has no
// alt text there is nothing left to show the reader, so it is dropped. Images
// that keep an alt text are preserved because the text still carries meaning.
//
// Usage:
//   removeImagesWithoutSrc.run(htmlDoc);
function removeImagesWithoutSrc(htmlDoc: HTMLDocument) {
  const images = Array.from(htmlDoc.querySelectorAll("img"));

  images
    .filter((image) => !hasAttributeText(image, "src"))
    .filter((image) => !hasAttributeText(image, "alt"))
    .forEach((image) => image.remove());
}

export default new Step(DESCRIPTION, removeImagesWithoutSrc);
