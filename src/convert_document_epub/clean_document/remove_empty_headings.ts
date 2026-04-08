import { Step } from '../../step';

const DESCRIPTION = 'Removing empty headings elements';

function removeEmptyHeadings(htmlDoc: HTMLDocument) {
  const headings = Array.from(htmlDoc.querySelectorAll('h1,h2,h3,h4,h5,h6'));

  headings
      .filter(heading => heading.innerHTML.trim())
      .forEach(heading => heading.remove());
}

export default new Step(DESCRIPTION, removeEmptyHeadings);
