import { Step } from "../step";

const DESCRIPTION = "Set external links to open in a new tab";

function setExternalLinksBlank(splittedContents: Element[]) {
  const linksElements = splittedContents.flatMap((splittedContent) =>
    Array.from(
      splittedContent.querySelectorAll(
        'a[href^="http://"], a[href^="https://"]',
      ),
    ),
  );

  for (const linkElement of linksElements) {
    linkElement.setAttribute("target", "_blank");
  }

  return splittedContents;
}

export default new Step(DESCRIPTION, setExternalLinksBlank);
