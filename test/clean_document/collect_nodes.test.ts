import { test } from "node:test";
import * as assert from "node:assert/strict";
import "../../test/setup";
import { collectNodes } from "../../src/clean_document/collect_nodes";

test("collects element nodes under the root", () => {
  const doc = makeDoc("<p>one</p><span>two</span>");

  const elements = collectNodes<HTMLElement>(
    doc.documentElement,
    NodeFilter.SHOW_ELEMENT,
  );
  const tagNames = elements.map((element) => element.tagName);

  assert.equal(tagNames.includes("P"), true);
  assert.equal(tagNames.includes("SPAN"), true);
});

test("collects comment nodes under the root", () => {
  const doc = makeDoc("<p>text<!-- a comment --></p>");

  const comments = collectNodes<Comment>(
    doc.documentElement,
    NodeFilter.SHOW_COMMENT,
  );

  assert.equal(comments.length, 1);
  assert.equal(comments[0].nodeValue, " a comment ");
});

test("returns an empty array when nothing matches", () => {
  const doc = makeDoc("<p>no comments here</p>");

  const comments = collectNodes<Comment>(
    doc.documentElement,
    NodeFilter.SHOW_COMMENT,
  );

  assert.deepEqual(comments, []);
});

test("collects nodes eagerly so callers may remove them while iterating", () => {
  const doc = makeDoc("<p>a</p><p>b</p><p>c</p>");

  const paragraphs = collectNodes<HTMLElement>(
    doc.documentElement,
    NodeFilter.SHOW_ELEMENT,
  ).filter((element) => element.tagName === "P");
  paragraphs.forEach((paragraph) => paragraph.remove());

  assert.equal(doc.querySelectorAll("p").length, 0);
});

test("throws with the node name when the root has no ownerDocument", () => {
  const detached = { nodeName: "#document", ownerDocument: null } as Node;

  assert.throws(
    () => collectNodes(detached, NodeFilter.SHOW_ELEMENT),
    /no ownerDocument/,
  );
});

function makeDoc(bodyHTML: string): HTMLDocument {
  const doc = document.implementation.createHTMLDocument("");
  doc.body.innerHTML = bodyHTML;
  return doc as HTMLDocument;
}
