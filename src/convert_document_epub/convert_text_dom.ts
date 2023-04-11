import { Step } from '../step';


const DESCRIPTION = 'Converting downloaded text to DOM';


function convertTextToDOM(content: string) {
  const parser = new DOMParser();

  return parser.parseFromString(content, 'text/html');
}

export default new Step(DESCRIPTION, convertTextToDOM);
