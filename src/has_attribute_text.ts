// True when `attribute` is present on `element` with non-whitespace content.
// Empty and blank values are treated as missing, e.g. `alt=""` or `src="  "`.
//
// Usage:
//   if (!hasAttributeText(image, "src")) image.remove();
export default function hasAttributeText(element: Element, attribute: string) {
  return Boolean(element.getAttribute(attribute)?.trim());
}
