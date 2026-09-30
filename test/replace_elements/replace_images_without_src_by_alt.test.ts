import { test } from "node:test";
import * as assert from "node:assert/strict";
import "../../test/setup";
import replaceImagesWithoutSrcByAlt from "../../src/replace_elements/replace_images_without_src_by_alt";

test("replaces an <img> without src by a <span> with its alt text", () => {
  const doc = makeDoc('<p>See <img alt="A chart"> above</p>');

  replaceImagesWithoutSrcByAlt.run(doc);

  assert.equal(doc.querySelectorAll("img").length, 0);
  assert.equal(doc.body.innerHTML, "<p>See <span>A chart</span> above</p>");
});

test("replaces an <img> with blank src by a <span> with its alt text", () => {
  const doc = makeDoc('<img src="  " alt="A chart">');

  replaceImagesWithoutSrcByAlt.run(doc);

  assert.equal(doc.body.innerHTML, "<span>A chart</span>");
});

test("trims the alt text placed in the <span>", () => {
  const doc = makeDoc('<img alt="  A chart  ">');

  replaceImagesWithoutSrcByAlt.run(doc);

  assert.equal(doc.body.innerHTML, "<span>A chart</span>");
});

test("preserves an <img> with src and alt", () => {
  const doc = makeDoc('<img src="image.png" alt="A chart">');

  replaceImagesWithoutSrcByAlt.run(doc);

  assert.equal(doc.querySelectorAll("img").length, 1);
  assert.equal(doc.querySelectorAll("span").length, 0);
});

test("preserves an <img> without src and with blank alt", () => {
  const doc = makeDoc('<img alt="  ">');

  replaceImagesWithoutSrcByAlt.run(doc);

  assert.equal(doc.querySelectorAll("img").length, 1);
  assert.equal(doc.querySelectorAll("span").length, 0);
});

function makeDoc(bodyHTML: string): HTMLDocument {
  const doc = document.implementation.createHTMLDocument("");
  doc.body.innerHTML = bodyHTML;
  return doc as HTMLDocument;
}
