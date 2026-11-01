import { test } from "node:test";
import * as assert from "node:assert/strict";
import "../../test/setup";
import flattenNestedElements from "../../src/reduce_elements/flatten_nested_elements";

test("collapses a three-level <div> chain into one <div>", () => {
  const doc = makeDoc("<div><div><div>Hello</div></div></div>");

  flattenNestedElements.run(doc);

  assert.equal(doc.querySelectorAll("div").length, 1);
  assert.equal(doc.querySelector("div")!.textContent, "Hello");
});

test("collapses a three-level <span> chain into one <span>", () => {
  const doc = makeDoc("<span><span><span>Hello</span></span></span>");

  flattenNestedElements.run(doc);

  assert.equal(doc.querySelectorAll("span").length, 1);
  assert.equal(doc.querySelector("span")!.textContent, "Hello");
});

test("does not collapse when the wrapper has extra text content", () => {
  const doc = makeDoc("<div>text<div>x</div></div>");

  flattenNestedElements.run(doc);

  assert.equal(doc.querySelectorAll("div").length, 2);
});

test("does not collapse elements of different tags", () => {
  const doc = makeDoc("<div><span>Hello</span></div>");

  flattenNestedElements.run(doc);

  assert.equal(doc.querySelectorAll("div").length, 1);
  assert.equal(doc.querySelectorAll("span").length, 1);
});

test("does not collapse a wrapper with multiple element children", () => {
  const doc = makeDoc("<div><div>a</div><div>b</div></div>");

  flattenNestedElements.run(doc);

  assert.equal(doc.querySelectorAll("div").length, 3);
});

test("ignores whitespace-only text around the inner child", () => {
  const doc = makeDoc("<div>  <div>Hello</div>  </div>");

  flattenNestedElements.run(doc);

  assert.equal(doc.querySelectorAll("div").length, 1);
  assert.equal(doc.querySelector("div")!.textContent!.trim(), "Hello");
});

test("collapses even when wrappers carry attributes", () => {
  const doc = makeDoc('<div id="a"><div id="b">Hello</div></div>');

  flattenNestedElements.run(doc);

  assert.equal(doc.querySelectorAll("div").length, 1);
  assert.equal(doc.querySelector("div")!.textContent, "Hello");
});

test("leaves tags outside the flattenable list untouched", () => {
  const doc = makeDoc("<b><b>x</b></b>");

  flattenNestedElements.run(doc);

  assert.equal(doc.querySelectorAll("b").length, 2);
});

function makeDoc(bodyHTML: string): HTMLDocument {
  const doc = document.implementation.createHTMLDocument("");
  doc.body.innerHTML = bodyHTML;
  return doc as HTMLDocument;
}
