import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import '../setup';
import replaceSimpleElementsTag from '../../src/replace_elements/replace_simple_elements_tag';

test('replaces <article> with <div>', () => {
  const doc = makeDoc('<article>content</article>');

  replaceSimpleElementsTag.run(doc);

  assert.equal(doc.querySelectorAll('article').length, 0);
  assert.equal(doc.querySelector('div')!.textContent, 'content');
});

test('replaces <section> with <div>', () => {
  const doc = makeDoc('<section>text</section>');

  replaceSimpleElementsTag.run(doc);

  assert.equal(doc.querySelectorAll('section').length, 0);
  assert.equal(doc.querySelector('div')!.textContent, 'text');
});

test('replaces <dir> with <ul>', () => {
  const doc = makeDoc('<dir><li>item</li></dir>');

  replaceSimpleElementsTag.run(doc);

  assert.equal(doc.querySelectorAll('dir').length, 0);
  assert.equal(doc.querySelectorAll('ul').length, 1);
  assert.equal(doc.querySelector('ul li')!.textContent, 'item');
});

test('replaces <bdi> with <span>', () => {
  const doc = makeDoc('<p><bdi>text</bdi></p>');

  replaceSimpleElementsTag.run(doc);

  assert.equal(doc.querySelectorAll('bdi').length, 0);
  assert.equal(doc.querySelector('span')!.textContent, 'text');
});

test('replaces <figcaption> with <p>', () => {
  const doc = makeDoc('<figcaption>caption</figcaption>');

  replaceSimpleElementsTag.run(doc);

  assert.equal(doc.querySelectorAll('figcaption').length, 0);
  assert.equal(doc.querySelector('p')!.textContent, 'caption');
});

test('replaces <s> with <del>', () => {
  const doc = makeDoc('<p><s>old</s></p>');

  replaceSimpleElementsTag.run(doc);

  assert.equal(doc.querySelectorAll('s').length, 0);
  assert.equal(doc.querySelector('del')!.textContent, 'old');
});

test('preserves children when replacing an element', () => {
  const doc = makeDoc('<article><p>para</p><strong>bold</strong></article>');

  replaceSimpleElementsTag.run(doc);

  assert.equal(doc.querySelectorAll('article').length, 0);
  assert.ok(doc.querySelector('div p'), '<p> should be inside <div>');
  assert.ok(doc.querySelector('div strong'), '<strong> should be inside <div>');
});

test('preserves attributes when replacing an element', () => {
  const doc = makeDoc('<article id="main" lang="en">text</article>');

  replaceSimpleElementsTag.run(doc);

  const div = doc.querySelector('div');

  assert.ok(div);
  assert.equal(div.getAttribute('id'), 'main');
  assert.equal(div.getAttribute('lang'), 'en');
});

test('does not affect elements not in the replacement map', () => {
  const doc = makeDoc('<p>paragraph</p><em>emphasis</em>');

  replaceSimpleElementsTag.run(doc);

  assert.equal(doc.querySelectorAll('p').length, 1);
  assert.equal(doc.querySelectorAll('em').length, 1);
});

function makeDoc(bodyHTML: string): HTMLDocument {
  const doc = document.implementation.createHTMLDocument('');
  doc.body.innerHTML = bodyHTML;
  return doc as HTMLDocument;
}
