import { test } from "node:test";
import * as assert from "node:assert/strict";
import "./setup";
import createImagesFromDataUrls from "../src/create_images_from_data_urls";

const PNG_DATA_URL = "data:image/png;base64,iVBORw0KGgo=";

test("creates image metadata from a data URL image", async () => {
  const main = makeElement(`<img src="${PNG_DATA_URL}" alt="a cat">`);

  const result = await createImagesFromDataUrls.run(main);

  assert.equal(result.length, 1);
  assert.ok(result[0].id, "created image should have an id");
  assert.ok(result[0].blob instanceof Blob);
  assert.equal(result[0].blob.type, "image/png");
  assert.equal(result[0].attributes.alt, "a cat");
});

test("replaces the data URL image by a comment placeholder", async () => {
  const main = makeElement(`<img src="${PNG_DATA_URL}">`);

  const [image] = await createImagesFromDataUrls.run(main);

  assert.equal(main.querySelectorAll("img").length, 0);
  assert.ok(
    main.innerHTML.includes(`<%= image['${image.id}'] %>`),
    "img should be replaced by its placeholder comment",
  );
});

test("ignores images whose src is not a data URL", async () => {
  const main = makeElement('<img src="https://example.com/photo.jpg">');

  const result = await createImagesFromDataUrls.run(main);

  assert.equal(result.length, 0);
  assert.equal(main.querySelectorAll("img").length, 1);
});

test("drops data URLs that are not images", async () => {
  const main = makeElement('<img src="data:text/plain;base64,aGk=">');

  const result = await createImagesFromDataUrls.run(main);

  assert.equal(result.length, 0, "non-image data URLs should be skipped");
});

test("deduplicates images sharing the same data URL", async () => {
  const main = makeElement(
    `<img src="${PNG_DATA_URL}"><img src="${PNG_DATA_URL}">`,
  );

  const result = await createImagesFromDataUrls.run(main);

  assert.equal(result.length, 1);
});

function makeElement(bodyHTML: string): Element {
  const doc = document.implementation.createHTMLDocument("");
  doc.body.innerHTML = bodyHTML;
  return doc.body;
}
