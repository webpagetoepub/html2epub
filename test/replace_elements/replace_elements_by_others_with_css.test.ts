import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import '../setup';
import replaceElementsByOthersWithCSS from '../../src/replace_elements/replace_elements_by_others_with_css';

test('replaces <mark> with <span> with background-color style', () => {
  const doc = makeDoc('<p><mark>highlighted</mark></p>');

  replaceElementsByOthersWithCSS.run(doc);

  const span = doc.querySelector('span');

  assert.equal(doc.querySelectorAll('mark').length, 0);
  assert.ok(span, '<span> should exist');
  assert.equal(span.textContent, 'highlighted');
});

test('replaces <u> with <span> with text-decoration style', () => {
  const doc = makeDoc('<p><u>underlined</u></p>');

  replaceElementsByOthersWithCSS.run(doc);

  const span = doc.querySelector('span');

  assert.equal(doc.querySelectorAll('u').length, 0);
  assert.ok(span, '<span> should exist');
  assert.equal(span.textContent, 'underlined');
});

test('replaces <center> with <div> with text-align style', () => {
  const doc = makeDoc('<center>centered</center>');

  replaceElementsByOthersWithCSS.run(doc);

  const div = doc.querySelector('div');

  assert.equal(doc.querySelectorAll('center').length, 0);
  assert.ok(div, '<div> should exist');
  assert.equal(div.textContent, 'centered');
});

test('preserves child elements when replacing', () => {
  const doc = makeDoc('<mark><strong>bold highlight</strong></mark>');

  replaceElementsByOthersWithCSS.run(doc);

  const strong = doc.querySelector('strong');

  assert.equal(doc.querySelectorAll('mark').length, 0);
  assert.ok(strong, 'nested <strong> should be preserved');
  assert.equal(strong.textContent, 'bold highlight');
});

test('replaces multiple instances of the same element', () => {
  const doc = makeDoc('<mark>a</mark><mark>b</mark><mark>c</mark>');

  replaceElementsByOthersWithCSS.run(doc);

  assert.equal(doc.querySelectorAll('mark').length, 0);
  assert.equal(doc.querySelectorAll('span').length, 3);
});

test('does not affect unrelated elements', () => {
  const doc = makeDoc('<p>text</p><em>emphasis</em>');

  replaceElementsByOthersWithCSS.run(doc);

  assert.equal(doc.querySelectorAll('p').length, 1);
  assert.equal(doc.querySelectorAll('em').length, 1);
});

function makeDoc(bodyHTML: string): HTMLDocument {
  const doc = document.implementation.createHTMLDocument('');
  doc.body.innerHTML = bodyHTML;
  return doc as unknown as HTMLDocument;
}
