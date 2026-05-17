import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import '../../test/setup';
import removeEmptyElements from '../../src/clean_document/remove_empty_elements';

test('removes an empty <p>', () => {
  const doc = makeDoc('<p></p>');

  removeEmptyElements.run(doc);

  assert.equal(doc.querySelectorAll('p').length, 0);
});

test('removes an empty <span>', () => {
  const doc = makeDoc('<span></span>');

  removeEmptyElements.run(doc);

  assert.equal(doc.querySelectorAll('span').length, 0);
});

test('removes a <p> containing only whitespace', () => {
  const doc = makeDoc('<p>   </p>');

  removeEmptyElements.run(doc);

  assert.equal(doc.querySelectorAll('p').length, 0);
});

test('preserves elements with text content', () => {
  const doc = makeDoc('<p>some text</p>');

  removeEmptyElements.run(doc);

  assert.equal(doc.querySelectorAll('p').length, 1);
  assert.equal(doc.querySelector('p')!.textContent, 'some text');
});

test('removes parent element when it becomes empty after child removal', () => {
  const doc = makeDoc('<div><span></span></div>');

  removeEmptyElements.run(doc);

  assert.equal(doc.querySelectorAll('span').length, 0);
  assert.equal(doc.querySelectorAll('div').length, 0);
});

test('preserves elements not in the removable list even when empty', () => {
  const doc = makeDoc('<img src="pic.jpg">');

  removeEmptyElements.run(doc);

  assert.equal(doc.querySelectorAll('img').length, 1);
});

test('removes multiple empty elements', () => {
  const doc = makeDoc('<p></p><div></div><span></span>');

  removeEmptyElements.run(doc);

  assert.equal(doc.querySelectorAll('p,div,span').length, 0);
});

test('preserves a non-empty sibling when another sibling is empty', () => {
  const doc = makeDoc('<p></p><p>keep me</p>');

  removeEmptyElements.run(doc);

  assert.equal(doc.querySelectorAll('p').length, 1);
  assert.equal(doc.querySelector('p')!.textContent, 'keep me');
});

function makeDoc(bodyHTML: string): HTMLDocument {
  const doc = document.implementation.createHTMLDocument('');
  doc.body.innerHTML = bodyHTML;
  return doc as HTMLDocument;
}
