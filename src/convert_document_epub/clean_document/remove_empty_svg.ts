import { Step } from '../../step';


const DESCRIPTION = 'Remove empty SVGs';

function removeEmptySVGs(htmlDoc: HTMLDocument) {
  const svgs = Array.from(htmlDoc.querySelectorAll('svg'));
  for (const svg of svgs) {
    if (isEmptySvg(svg)) {
      svg.remove();
    }
  }
}

export function isEmptySvg(svg: XMLDocument | SVGElement) {
  if (svg instanceof XMLDocument) {
    return isEmptySvgXML(svg);
  }

  return isEmptySvgElement(svg);
}

function isEmptySvgXML(svg: XMLDocument) {
  return svg.rootElement.children.length === 0;
}

function isEmptySvgElement(svg: SVGElement) {
  return svg.children.length === 0;
}

export default new Step(DESCRIPTION, removeEmptySVGs);
