import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import '../../test/setup';
import removeElements from '../../src/clean_document/remove_elements';

test('removes <script> elements', () => {
  const doc = makeDoc('<p>text</p><script>alert(1)</script>');

  removeElements.run(doc);

  assert.equal(doc.querySelectorAll('script').length, 0);
  assert.equal(doc.querySelectorAll('p').length, 1);
});

test('removes <style> elements', () => {
  const doc = makeDoc('<style>body { color: red }</style><p>text</p>');

  removeElements.run(doc);

  assert.equal(doc.querySelectorAll('style').length, 0);
});

test('removes <iframe> elements', () => {
  const doc = makeDoc('<iframe src="https://example.com"></iframe>');

  removeElements.run(doc);

  assert.equal(doc.querySelectorAll('iframe').length, 0);
});

test('removes form elements', () => {
  const doc = makeDoc('<form><input type="text"><button>Submit</button><select><option>A</option></select></form>');

  removeElements.run(doc);

  assert.equal(doc.querySelectorAll('input').length, 0);
  assert.equal(doc.querySelectorAll('button').length, 0);
  assert.equal(doc.querySelectorAll('select').length, 0);
});

test('removes <nav> elements', () => {
  const doc = makeDoc('<nav><a href="#">Home</a></nav><p>content</p>');

  removeElements.run(doc);

  assert.equal(doc.querySelectorAll('nav').length, 0);
  assert.equal(doc.querySelectorAll('p').length, 1);
});

test('removes <svg> elements', () => {
  const doc = makeDoc('<svg><circle/></svg><p>text</p>');

  removeElements.run(doc);

  assert.equal(doc.querySelectorAll('svg').length, 0);
});

test('removes <meta> and <link> elements', () => {
  const doc = makeDoc('<p>text</p>');
  const meta = doc.createElement('meta');
  meta.setAttribute('charset', 'utf-8');
  doc.head.appendChild(meta);
  const link = doc.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  doc.head.appendChild(link);

  removeElements.run(doc);

  assert.equal(doc.querySelectorAll('meta').length, 0);
  assert.equal(doc.querySelectorAll('link').length, 0);
});

test('preserves content elements like <p>, <h1>, <a>, <img>', () => {
  const doc = makeDoc('<h1>Title</h1><p>Para</p><a href="#">link</a><img src="img.jpg">');

  removeElements.run(doc);

  assert.equal(doc.querySelectorAll('h1').length, 1);
  assert.equal(doc.querySelectorAll('p').length, 1);
  assert.equal(doc.querySelectorAll('a').length, 1);
  assert.equal(doc.querySelectorAll('img').length, 1);
});

test('removes multiple instances of the same removable element', () => {
  const doc = makeDoc('<script>a()</script><script>b()</script>');

  removeElements.run(doc);

  assert.equal(doc.querySelectorAll('script').length, 0);
});

function makeDoc(bodyHTML: string): HTMLDocument {
  const doc = document.implementation.createHTMLDocument('');
  doc.body.innerHTML = bodyHTML;
  return doc as HTMLDocument;
}
