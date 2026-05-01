import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import '../../test/setup';
import removeDataAttributes from '../../src/clean_document/remove_data_attributes';

test('removes a data- attribute from an element', () => {
  const doc = makeDoc('<p data-id="123">text</p>');

  removeDataAttributes.run(doc);

  assert.equal(doc.querySelector('p')!.hasAttribute('data-id'), false);
});

test('removes multiple data- attributes from the same element', () => {
  const doc = makeDoc('<p data-id="1" data-value="two">text</p>');

  removeDataAttributes.run(doc);

  const p = doc.querySelector('p')!;

  assert.equal(p.hasAttribute('data-id'), false);
  assert.equal(p.hasAttribute('data-value'), false);
});

test('removes data- attributes from nested elements', () => {
  const doc = makeDoc('<div data-outer="x"><span data-inner="y">text</span></div>');

  removeDataAttributes.run(doc);

  assert.equal(doc.querySelector('div')!.hasAttribute('data-outer'), false);
  assert.equal(doc.querySelector('span')!.hasAttribute('data-inner'), false);
});

test('preserves non-data- attributes', () => {
  const doc = makeDoc('<a href="https://example.com" data-track="1">link</a>');

  removeDataAttributes.run(doc);

  const a = doc.querySelector('a')!;

  assert.equal(a.hasAttribute('data-track'), false);
  assert.equal(a.getAttribute('href'), 'https://example.com');
});

test('does nothing when there are no data- attributes', () => {
  const doc = makeDoc('<p id="main" class="text">content</p>');

  removeDataAttributes.run(doc);

  const p = doc.querySelector('p')!;

  assert.equal(p.getAttribute('id'), 'main');
  assert.equal(p.getAttribute('class'), 'text');
});

function makeDoc(bodyHTML: string): HTMLDocument {
  const doc = document.implementation.createHTMLDocument('');
  doc.body.innerHTML = bodyHTML;
  return doc as HTMLDocument;
}
