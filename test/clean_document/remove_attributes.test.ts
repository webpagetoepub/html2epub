import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import '../../test/setup';
import removeAttributes from '../../src/clean_document/remove_attributes';

test('removes the style attribute', () => {
  const doc = makeDoc('<p style="color: red">text</p>');

  removeAttributes.run(doc);

  assert.equal(doc.querySelector('p')!.hasAttribute('style'), false);
});

test('removes the class attribute', () => {
  const doc = makeDoc('<p class="foo bar">text</p>');

  removeAttributes.run(doc);

  assert.equal(doc.querySelector('p')!.hasAttribute('class'), false);
});

test('removes mouse event handler attributes', () => {
  const doc = makeDoc('<button onclick="doSomething()" onmouseover="hover()">click</button>');

  removeAttributes.run(doc);

  const button = doc.querySelector('button')!;

  assert.equal(button.hasAttribute('onclick'), false);
  assert.equal(button.hasAttribute('onmouseover'), false);
});

test('removes keyboard event handler attributes', () => {
  const doc = makeDoc('<input onkeydown="fn()" onkeyup="fn()">');

  removeAttributes.run(doc);

  const input = doc.querySelector('input')!;

  assert.equal(input.hasAttribute('onkeydown'), false);
  assert.equal(input.hasAttribute('onkeyup'), false);
});

test('removes the srcset attribute', () => {
  const doc = makeDoc('<img src="img.jpg" srcset="img-2x.jpg 2x">');

  removeAttributes.run(doc);

  assert.equal(doc.querySelector('img')!.hasAttribute('srcset'), false);
});

test('removes the tabindex attribute', () => {
  const doc = makeDoc('<div tabindex="0">focus me</div>');

  removeAttributes.run(doc);

  assert.equal(doc.querySelector('div')!.hasAttribute('tabindex'), false);
});

test('preserves href on anchor elements', () => {
  const doc = makeDoc('<a href="https://example.com" class="link">link</a>');

  removeAttributes.run(doc);

  const a = doc.querySelector('a')!;

  assert.equal(a.getAttribute('href'), 'https://example.com');
  assert.equal(a.hasAttribute('class'), false);
});

test('preserves src and alt on image elements', () => {
  const doc = makeDoc('<img src="photo.jpg" alt="A photo" class="img">');

  removeAttributes.run(doc);

  const img = doc.querySelector('img')!;

  assert.equal(img.getAttribute('src'), 'photo.jpg');
  assert.equal(img.getAttribute('alt'), 'A photo');
  assert.equal(img.hasAttribute('class'), false);
});

function makeDoc(bodyHTML: string): HTMLDocument {
  const doc = document.implementation.createHTMLDocument('');
  doc.body.innerHTML = bodyHTML;
  return doc as HTMLDocument;
}
