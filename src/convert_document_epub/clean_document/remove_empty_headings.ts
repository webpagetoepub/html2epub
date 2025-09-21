import { Step } from '../../step';

const DESCRIPTION = 'Removing empty headings elements';

const HEADING_TAGS = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];

function removeEmptyHeadings(htmlDoc: HTMLDocument) {
  const headings = Array.from(htmlDoc.querySelectorAll('h1,h2,h3,h4,h5,h6'));

  headings
      .filter(heading => heading.innerHTML.trim())
      .forEach(heading => heading.remove());
}

export default new Step(DESCRIPTION, removeEmptyHeadings);
