import { test } from "node:test";
import * as assert from "node:assert/strict";
import { unzipSync, strFromU8 } from "fflate";
import convertDocumentToEPub from "../src/index";

const STEPS_LENGTH = 31;
const HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Test Article</title>
    <meta name="author" content="Test Author" />
  </head>
  <body>
    <main>
      <p>This is the main content of the test article. It has enough text to
      exceed the 80-character threshold used by the content splitter so it
      gets included as a chapter in the resulting EPUB file.</p>
    </main>
  </body>
</html>`;

class MockLogger {
  log() {}
  error() {}
}

// Builds a document whose <main> has several h2 sections, each carrying a
// paragraph of `paragraphLength` characters. Used to exercise how chapters are
// packed into jEpub pages by their combined content size.
function buildMultiChapterHtml(
  chapterCount: number,
  paragraphLength: number,
): string {
  const sections = Array.from({ length: chapterCount }, (_, i) => {
    const paragraph = "a".repeat(paragraphLength);
    return `<h2>Chapter ${i + 1}</h2><p>${paragraph}</p>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Multi Chapter Article</title>
    <meta name="author" content="Test Author" />
  </head>
  <body>
    <main>${sections}</main>
  </body>
</html>`;
}

async function pageFileNames(epub: Blob): Promise<string[]> {
  const files = unzipSync(new Uint8Array(await epub.arrayBuffer()));
  return Object.keys(files).filter((name) =>
    /^OEBPS\/page-\d+\.html$/.test(name),
  );
}

const NO_IMAGES = async (_: string): Promise<Blob> =>
  new Blob([], { type: "image/png" });

test("converts an HTML page to an EPUB without crashing", async () => {
  const url = "https://example.com/article";
  const loadImageFrom = async (_: string): Promise<Blob> =>
    new Blob([], { type: "image/png" });

  const result = await convertDocumentToEPub(
    url,
    Promise.resolve(HTML),
    loadImageFrom,
    () => {},
    () => {},
    new MockLogger(),
  );

  assert.ok(result, "result should be defined");
  assert.ok(result.epub instanceof Blob, "result.epub should be a Blob");
});

test("reports correct total step count and sequential progress through all sub-steps", async () => {
  const url = "https://example.com/article";
  const loadImageFrom = async (_: string): Promise<Blob> =>
    new Blob([], { type: "image/png" });
  const reportedSteps: number[] = [];
  let reportedLength = 0;
  let currentStep = 0;

  await convertDocumentToEPub(
    url,
    Promise.resolve(HTML),
    loadImageFrom,
    () => reportedSteps.push(++currentStep),
    (length) => {
      reportedLength = length;
    },
    new MockLogger(),
  );

  const expectedSteps = Array.from({ length: STEPS_LENGTH }, (_, i) => i + 1);
  assert.strictEqual(reportedLength, STEPS_LENGTH);
  assert.deepStrictEqual(reportedSteps, expectedSteps);
});

test("merges several small chapters into a single EPUB page", async () => {
  const html = buildMultiChapterHtml(4, 200);

  const result = await convertDocumentToEPub(
    "https://example.com/article",
    Promise.resolve(html),
    NO_IMAGES,
    () => {},
    () => {},
    new MockLogger(),
  );

  const pages = await pageFileNames(result.epub);
  assert.strictEqual(
    pages.length,
    1,
    `chapters under 200KB should share one page, got: ${JSON.stringify(pages)}`,
  );
});

test("splits chapters into multiple pages when combined content exceeds 200KB", async () => {
  // Three ~150KB chapters: no two fit together under the 200KB budget, so each
  // lands on its own page.
  const html = buildMultiChapterHtml(3, 150 * 1024);

  const result = await convertDocumentToEPub(
    "https://example.com/article",
    Promise.resolve(html),
    NO_IMAGES,
    () => {},
    () => {},
    new MockLogger(),
  );

  const pages = await pageFileNames(result.epub);
  assert.ok(
    pages.length >= 2,
    `chapters exceeding 200KB should split across pages, got: ${JSON.stringify(pages)}`,
  );
});

test("renders images in chapter HTML with src matching the stored asset path", async () => {
  const url = "https://example.com/article";
  const htmlWithImage = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Image Article</title>
    <meta name="author" content="Test Author" />
  </head>
  <body>
    <main>
      <p>This is the main content of the test article. It has enough text to
      exceed the 80-character threshold used by the content splitter so it
      gets included as a chapter in the resulting EPUB file.</p>
      <p><img src="https://example.com/photo.png" alt="photo"></p>
    </main>
  </body>
</html>`;
  const pngBytes = new Uint8Array([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
    0x0d, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
    0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
  ]);
  const loadImageFrom = async (_: string): Promise<Blob> =>
    new Blob([pngBytes], { type: "image/png" });

  const result = await convertDocumentToEPub(
    url,
    Promise.resolve(htmlWithImage),
    loadImageFrom,
    () => {},
    () => {},
    new MockLogger(),
  );

  const epubBytes = new Uint8Array(await result.epub.arrayBuffer());
  const files = unzipSync(epubBytes);
  const chapterFileName = Object.keys(files).find(
    (name) =>
      /^OEBPS\/page-\d+\.html$/.test(name) &&
      strFromU8(files[name]).includes("<img"),
  );
  assert.ok(
    chapterFileName,
    "expected a chapter HTML file containing an <img>",
  );
  const chapterHtml = strFromU8(files[chapterFileName]);
  const srcMatch = /<img[^>]*\ssrc="([^"]+)"/.exec(chapterHtml);
  assert.ok(
    srcMatch,
    `expected an <img> with a src attribute, got: ${chapterHtml}`,
  );
  const imgSrc = srcMatch[1];
  const assetFiles = Object.keys(files).filter((name) =>
    name.startsWith("OEBPS/assets/"),
  );

  const resolvedAssetPath = `OEBPS/${imgSrc.replace(/^\.\//, "")}`;
  assert.ok(
    assetFiles.includes(resolvedAssetPath),
    `chapter img src "${imgSrc}" should resolve to an existing EPUB asset; assets in EPUB: ${JSON.stringify(assetFiles)}`,
  );
});
