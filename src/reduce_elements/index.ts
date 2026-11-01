import removeEmptyElements from "./remove_empty_elements";
import flattenNestedElements from "./flatten_nested_elements";
import { Step, SubProcessStep, Process } from "../step";

const DESCRIPTION = "Reducing redundant elements";

function buildReduceElementsProcess(htmlDoc: HTMLDocument): Process {
  const htmlDocStep = new Step("HTML document step", () => htmlDoc);

  return new Process([
    { step: htmlDocStep },
    { step: removeEmptyElements, dependencies: [htmlDocStep] },
    { step: flattenNestedElements, dependencies: [htmlDocStep] },
  ]);
}

export default new SubProcessStep(DESCRIPTION, buildReduceElementsProcess);
