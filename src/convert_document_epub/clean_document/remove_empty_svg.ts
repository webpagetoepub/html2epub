import { Step } from '../../step';


const DESCRIPTION = 'Remove empty SVGs';

function removeEmptySVGs(htmlDoc: HTMLDocument) {
  const svgs = Array.from(htmlDoc.querySelectorAll('svg'));
  svgs.filter(isEmptySvg).forEach(svg => svg.remove());

  const parser = new DOMParser();
  const images = Array.from(htmlDoc.querySelectorAll('img[src]'));
  images
      .filter(image => image.getAttribute('src').startsWith('data:image/svg+xml'))
      .forEach(image => {
        const src = image.getAttribute('src');
        fetch(src)
            .then(response => response.text())
            .then(content => parser.parseFromString(content, 'text/xml'))
            .then(svg => {
              if (isEmptySvg(svg)) {
                image.remove();
              }
            });
      });
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
