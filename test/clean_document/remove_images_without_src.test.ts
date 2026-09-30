import { test } from "node:test";
import * as assert from "node:assert/strict";
import "../../test/setup";
import removeImagesWithoutSrc from "../../src/clean_document/remove_images_without_src";

test("removes an <img> without src and without alt", () => {
  const doc = makeDoc("<img>");

  removeImagesWithoutSrc.run(doc);

  assert.equal(doc.querySelectorAll("img").length, 0);
});

test("removes an <img> with blank src and blank alt", () => {
  const doc = makeDoc('<img src="  " alt=" ">');

  removeImagesWithoutSrc.run(doc);

  assert.equal(doc.querySelectorAll("img").length, 0);
});

test("removes an <img> without src and with empty alt", () => {
  const doc = makeDoc('<img alt="">');

  removeImagesWithoutSrc.run(doc);

  assert.equal(doc.querySelectorAll("img").length, 0);
});

test("removes an <img> without src and with whitespace-only alt", () => {
  const doc = makeDoc('<img alt="   ">');

  removeImagesWithoutSrc.run(doc);

  assert.equal(doc.querySelectorAll("img").length, 0);
});

test("preserves an <img> without src that has alt text", () => {
  const doc = makeDoc('<img alt="A chart">');

  removeImagesWithoutSrc.run(doc);

  assert.equal(doc.querySelectorAll("img").length, 1);
});

test("preserves an <img> with src and without alt", () => {
  const doc = makeDoc('<img src="image.png">');

  removeImagesWithoutSrc.run(doc);

  assert.equal(doc.querySelectorAll("img").length, 1);
});

function makeDoc(bodyHTML: string): HTMLDocument {
  const doc = document.implementation.createHTMLDocument("");
  doc.body.innerHTML = bodyHTML;
  return doc as HTMLDocument;
}
