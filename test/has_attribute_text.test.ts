import { test } from "node:test";
import * as assert from "node:assert/strict";
import "../test/setup";
import hasAttributeText from "../src/has_attribute_text";

test("returns true when the attribute has text", () => {
  const image = makeImage('<img alt="A chart">');

  assert.equal(hasAttributeText(image, "alt"), true);
});

test("returns false when the attribute is missing", () => {
  const image = makeImage("<img>");

  assert.equal(hasAttributeText(image, "alt"), false);
});

test("returns false when the attribute is empty", () => {
  const image = makeImage('<img alt="">');

  assert.equal(hasAttributeText(image, "alt"), false);
});

test("returns false when the attribute is whitespace only", () => {
  const image = makeImage('<img alt="   ">');

  assert.equal(hasAttributeText(image, "alt"), false);
});

function makeImage(imageHTML: string): Element {
  const doc = document.implementation.createHTMLDocument("");
  doc.body.innerHTML = imageHTML;
  return doc.querySelector("img")!;
}
