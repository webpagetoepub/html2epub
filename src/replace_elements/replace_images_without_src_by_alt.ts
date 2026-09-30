import { Step } from "../step";
import hasAttributeText from "../has_attribute_text";

const DESCRIPTION = "Replacing images without source by their alt text";

// An <img> with no usable src would otherwise fall back to the placeholder
// image; when it has alt text, that text is a better stand-in for the reader,
// so the image becomes a <span> holding it.
//
// Usage:
//   replaceImagesWithoutSrcByAlt.run(htmlDoc);
function replaceImagesWithoutSrcByAlt(htmlDoc: HTMLDocument) {
  const images = Array.from(htmlDoc.querySelectorAll("img"));

  images
    .filter((image) => !hasAttributeText(image, "src"))
    .filter((image) => hasAttributeText(image, "alt"))
    .forEach(replaceImageByAltSpan);
}

function replaceImageByAltSpan(image: Element) {
  const span = image.ownerDocument.createElement("span");
  span.textContent = image.getAttribute("alt")!.trim();
  image.replaceWith(span);
}

export default new Step(DESCRIPTION, replaceImagesWithoutSrcByAlt);
