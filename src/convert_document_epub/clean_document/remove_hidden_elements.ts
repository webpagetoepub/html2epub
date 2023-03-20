export default function removeHiddenElements(htmlDoc: HTMLDocument) {
  const hiddenElements = htmlDoc.querySelectorAll(`[hidden]`);

  for (const hiddenElement of Array.from(hiddenElements)) {
    hiddenElement.remove();
  }
}
