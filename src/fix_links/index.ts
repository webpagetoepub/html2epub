import replaceUrlLinks from "./replace_url_links";
import setExternalLinksBlank from "./set_external_links_blank";
import removeBrokenAnchorLinks from "./remove_broken_anchor_links";
import { Step, SubProcessStep, Process } from "../step";
import { SplittedElement } from "../split_main_content";

const DESCRIPTION = "Fix links";

function buildFixLinksProcess(
  splittedContents: SplittedElement[],
  originUrl: string,
): Process {
  const splittedContentsStep = new Step("Splitted elements step", () =>
    splittedContents.map((splittedContent) => splittedContent.element),
  );
  const originUrlStep = new Step("Origin URL step", () => originUrl);

  return new Process([
    { step: splittedContentsStep },
    { step: originUrlStep },
    {
      step: replaceUrlLinks,
      dependencies: [splittedContentsStep, originUrlStep],
    },
    { step: setExternalLinksBlank, dependencies: [replaceUrlLinks] },
    { step: removeBrokenAnchorLinks, dependencies: [replaceUrlLinks] },
  ]);
}

export default new SubProcessStep(DESCRIPTION, buildFixLinksProcess);
