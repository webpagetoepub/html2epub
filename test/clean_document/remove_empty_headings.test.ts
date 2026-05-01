import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import '../../test/setup';
import removeEmptyHeadings from '../../src/clean_document/remove_empty_headings';

test('removes an empty h1', () => {
  const doc = makeDoc('<h1></h1>');

  removeEmptyHeadings.run(doc);

  assert.equal(doc.querySelectorAll('h1').length, 0);
});

test('removes empty headings of every level', () => {
  const doc = makeDoc('<h1></h1><h2></h2><h3></h3><h4></h4><h5></h5><h6></h6>');

  removeEmptyHeadings.run(doc);

  assert.equal(doc.querySelectorAll('h1,h2,h3,h4,h5,h6').length, 0);
});

test('removes a heading containing only whitespace', () => {
  const doc = makeDoc('<h2>   </h2>');

  removeEmptyHeadings.run(doc);

  assert.equal(doc.querySelectorAll('h2').length, 0);
});

test('preserves headings that have content', () => {
  const doc = makeDoc('<h1>Title</h1>');

  removeEmptyHeadings.run(doc);

  assert.equal(doc.querySelectorAll('h1').length, 1);
  assert.equal(doc.querySelector('h1')!.textContent, 'Title');
});

test('removes only empty headings when mixed with non-empty ones', () => {
  const doc = makeDoc('<h2>Section</h2><h3></h3>');

  removeEmptyHeadings.run(doc);

  assert.equal(doc.querySelectorAll('h2').length, 1);
  assert.equal(doc.querySelectorAll('h3').length, 0);
});

function makeDoc(bodyHTML: string): HTMLDocument {
  const doc = document.implementation.createHTMLDocument('');
  doc.body.innerHTML = bodyHTML;
  return doc as HTMLDocument;
}
