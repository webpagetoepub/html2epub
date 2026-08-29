import jEpub from "jepub";

import { Step } from "./step";
import { Logger } from "./logger";

const DESCRIPTION = "Creating EPUB file";

// jEpub's addPage merges several chapters into one page file; we pack as many
// chapters as possible per call while their content stays under this budget.
const MAX_PAGE_CONTENT_BYTES = 200 * 1024;

export interface SplittedContent {
  title: string;
  content: string;
}

export interface Metadata {
  title: string;
  date: Date;
  author: string;
  publisher: string;
  uuid: string;
  description: string;
  tags: string[];
}

async function createEPUB(
  logger: Logger,
  contents: SplittedContent[],
  metadata: Metadata,
  images: { id: string; blob: Blob; attributes: Record<string, string> }[],
): Promise<{ title: string; epub: Blob }> {
  const jepub = new jEpub();

  jepub.init({ i18n: "en", ...metadata });
  jepub.uuid(metadata.uuid);
  jepub.date(metadata.date);

  images.forEach((image) =>
    jepub.image(image.blob, image.id, image.attributes),
  );

  for (const group of groupChaptersBySize(contents)) {
    jepub.addPage(group);
  }

  const epub = (await jepub.generate(
    "blob",
    (metadata: { percent: number; currentFile: string }) => {
      logger.log(`progression: ${metadata.percent.toFixed(2)} %`);

      if (metadata.currentFile) {
        logger.log(`current file = ${metadata.currentFile}`);
      }
    },
  )) as Blob;

  return { title: metadata.title, epub };
}

// Greedy next-fit: keep chapters in reading order, opening a new group only
// once the next chapter would push the running content size to the budget.
// A group always holds at least one chapter, so an oversized chapter stands
// alone (preserving the pre-addPage behavior of one page per chapter).
function groupChaptersBySize(contents: SplittedContent[]): SplittedContent[][] {
  const encoder = new TextEncoder();
  const groups: SplittedContent[][] = [];
  let currentGroup: SplittedContent[] = [];
  let currentBytes = 0;

  for (const content of contents) {
    const contentBytes = encoder.encode(content.content).length;
    const fits = currentBytes + contentBytes < MAX_PAGE_CONTENT_BYTES;

    if (currentGroup.length > 0 && !fits) {
      groups.push(currentGroup);
      currentGroup = [];
      currentBytes = 0;
    }

    currentGroup.push(content);
    currentBytes += contentBytes;
  }

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}

export default function createEpubStep(logger: Logger) {
  return new Step(
    DESCRIPTION,
    (
      contents: SplittedContent[],
      metadata: Metadata,
      images: { id: string; blob: Blob; attributes: Record<string, string> }[],
    ) => createEPUB(logger, contents, metadata, images),
  );
}
