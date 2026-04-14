export default function replaceElementWithStructure(from: Element, to: Element) {
  copyAttributes(from, to);
  transferChildNodes(from, to);
  from.parentNode.replaceChild(to, from);
}

function copyAttributes(from: Element, to: Element) {
  const attributes = Array.from(from.attributes);
  for (const attribute of attributes) {
    to.setAttribute(attribute.name, attribute.value);
  }
}

function transferChildNodes(from: Element, to: Element) {
  const childNodesList = Array.from(from.childNodes);

  for (const childNode of childNodesList) {
    from.removeChild(childNode);

    to.appendChild(childNode);
  }
}
