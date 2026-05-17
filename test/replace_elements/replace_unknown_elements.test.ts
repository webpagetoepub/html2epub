import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import '../setup';
import replaceUnknownElements from '../../src/replace_elements/replace_unknown_elements';

test('replaces a custom element with <div>', () => {
  const doc = makeDoc('<my-widget>content</my-widget>');

  replaceUnknownElements.run(doc);

  assert.equal(doc.querySelectorAll('my-widget').length, 0);
  assert.equal(doc.querySelector('div')!.textContent, 'content');
});

test('preserves children when replacing an unknown element', () => {
  const doc = makeDoc('<custom-card><p>text</p><strong>bold</strong></custom-card>');

  replaceUnknownElements.run(doc);

  assert.equal(doc.querySelectorAll('custom-card').length, 0);
  assert.ok(doc.querySelector('div p'), '<p> should be inside <div>');
  assert.ok(doc.querySelector('div strong'), '<strong> should be inside <div>');
});

test('does not replace known HTML5 block elements', () => {
  const doc = makeDoc('<p>para</p><div>div</div><section>section</section>');

  replaceUnknownElements.run(doc);

  assert.equal(doc.querySelectorAll('p').length, 1);
  assert.equal(doc.querySelectorAll('div').length, 1);
  assert.equal(doc.querySelectorAll('section').length, 1);
});

test('does not replace known HTML5 inline elements', () => {
  const doc = makeDoc('<p><strong>s</strong><em>e</em><a href="#">a</a><span>sp</span></p>');

  replaceUnknownElements.run(doc);

  assert.equal(doc.querySelectorAll('strong').length, 1);
  assert.equal(doc.querySelectorAll('em').length, 1);
  assert.equal(doc.querySelectorAll('a').length, 1);
  assert.equal(doc.querySelectorAll('span').length, 1);
});

test('does not replace known HTML5 table elements', () => {
  const doc = makeDoc('<table><thead><tr><th>H</th></tr></thead><tbody><tr><td>D</td></tr></tbody></table>');

  replaceUnknownElements.run(doc);

  assert.equal(doc.querySelectorAll('table').length, 1);
  assert.equal(doc.querySelectorAll('thead').length, 1);
  assert.equal(doc.querySelectorAll('tbody').length, 1);
  assert.equal(doc.querySelectorAll('tr').length, 2);
  assert.equal(doc.querySelectorAll('th').length, 1);
  assert.equal(doc.querySelectorAll('td').length, 1);
});

test('replaces multiple unknown elements', () => {
  const doc = makeDoc('<foo>a</foo><bar>b</bar>');

  replaceUnknownElements.run(doc);

  assert.equal(doc.querySelectorAll('foo').length, 0);
  assert.equal(doc.querySelectorAll('bar').length, 0);
  assert.equal(doc.querySelectorAll('div').length, 2);
});

function makeDoc(bodyHTML: string): HTMLDocument {
  const doc = document.implementation.createHTMLDocument('');
  doc.body.innerHTML = bodyHTML;
  return doc as HTMLDocument;
}
