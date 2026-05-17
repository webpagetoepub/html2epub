import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import '../../test/setup';
import removeHiddenElements from '../../src/clean_document/remove_hidden_elements';

test('removes an element with a hidden attribute', () => {
  const doc = makeDoc('<div hidden>secret</div>');

  removeHiddenElements.run(doc);

  assert.equal(doc.querySelectorAll('[hidden]').length, 0);
  assert.equal(doc.querySelectorAll('div').length, 0);
});

test('removes multiple hidden elements', () => {
  const doc = makeDoc('<span hidden>a</span><p>visible</p><span hidden>b</span>');

  removeHiddenElements.run(doc);

  assert.equal(doc.querySelectorAll('[hidden]').length, 0);
  assert.equal(doc.querySelectorAll('span').length, 0);
});

test('preserves visible elements', () => {
  const doc = makeDoc('<p>visible</p><div hidden>hidden</div>');

  removeHiddenElements.run(doc);

  assert.equal(doc.querySelectorAll('p').length, 1);
  assert.equal(doc.querySelector('p')!.textContent, 'visible');
});

test('removes nested hidden elements', () => {
  const doc = makeDoc('<div><p hidden>nested hidden</p></div>');

  removeHiddenElements.run(doc);

  assert.equal(doc.querySelectorAll('[hidden]').length, 0);
  assert.equal(doc.querySelectorAll('p').length, 0);
});

test('does nothing when there are no hidden elements', () => {
  const doc = makeDoc('<p>plain</p>');

  removeHiddenElements.run(doc);

  assert.equal(doc.querySelectorAll('p').length, 1);
});

function makeDoc(bodyHTML: string): HTMLDocument {
  const doc = document.implementation.createHTMLDocument('');
  doc.body.innerHTML = bodyHTML;
  return doc as HTMLDocument;
}
