import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import '../../test/setup';
import mergeTextNodes from '../../src/clean_document/merge_text_nodes';

test('merges two adjacent text nodes into one', () => {
  const doc = makeDoc('<p></p>');
  const p = doc.querySelector('p')!;
  appendTextNode(p, 'hello ');
  appendTextNode(p, 'world');

  mergeTextNodes.run(doc);

  assert.equal(p.childNodes.length, 1);
  assert.equal(p.textContent, 'hello world');
});

test('merges multiple adjacent text nodes into one', () => {
  const doc = makeDoc('<p></p>');
  const p = doc.querySelector('p')!;
  appendTextNode(p, 'a');
  appendTextNode(p, 'b');
  appendTextNode(p, 'c');

  mergeTextNodes.run(doc);

  assert.equal(p.childNodes.length, 1);
  assert.equal(p.textContent, 'abc');
});

test('does not merge text nodes separated by an element node', () => {
  const doc = makeDoc('<p>first<em>em</em>last</p>');

  mergeTextNodes.run(doc);

  const p = doc.querySelector('p')!;

  assert.equal(p.textContent, 'firstemlast');
  assert.equal(p.childNodes.length, 3);
});

test('merges adjacent text nodes in nested elements', () => {
  const doc = makeDoc('<div><p></p></div>');
  const p = doc.querySelector('p')!;
  appendTextNode(p, 'foo');
  appendTextNode(p, 'bar');

  mergeTextNodes.run(doc);

  assert.equal(p.childNodes.length, 1);
  assert.equal(p.textContent, 'foobar');
});

test('leaves a single text node unchanged', () => {
  const doc = makeDoc('<p>only one</p>');

  mergeTextNodes.run(doc);

  const p = doc.querySelector('p')!;

  assert.equal(p.childNodes.length, 1);
  assert.equal(p.textContent, 'only one');
});

function makeDoc(bodyHTML: string): HTMLDocument {
  const doc = document.implementation.createHTMLDocument('');
  doc.body.innerHTML = bodyHTML;
  return doc as HTMLDocument;
}

function appendTextNode(parent: Element, text: string) {
  parent.appendChild(document.createTextNode(text));
}
