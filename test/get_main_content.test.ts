import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import './setup';
import getMainContent from '../src/get_main_content';

test('returns <main> when present', () => {
  const doc = makeDoc('<main><p>content</p></main>');

  const result = getMainContent.run(doc);

  assert.equal(result.tagName.toLowerCase(), 'main');
});

test('returns [role="main"] when no <main> element', () => {
  const doc = makeDoc('<div role="main"><p>content</p></div>');

  const result = getMainContent.run(doc);

  assert.equal(result.getAttribute('role'), 'main');
});

test('returns <article> when no <main> or [role="main"]', () => {
  const doc = makeDoc('<article><p>content</p></article>');

  const result = getMainContent.run(doc);

  assert.equal(result.tagName.toLowerCase(), 'article');
});

test('returns <body> as fallback when no semantic content element', () => {
  const doc = makeDoc('<div><p>content</p></div>');

  const result = getMainContent.run(doc);

  assert.equal(result.tagName.toLowerCase(), 'body');
});

test('returns single <article> inside <main> when exactly one exists', () => {
  const doc = makeDoc('<main><article><p>content</p></article></main>');

  const result = getMainContent.run(doc);

  assert.equal(result.tagName.toLowerCase(), 'article');
});

test('returns <main> when multiple <article> elements are inside it', () => {
  const doc = makeDoc('<main><article>one</article><article>two</article></main>');

  const result = getMainContent.run(doc);

  assert.equal(result.tagName.toLowerCase(), 'main');
});

test('prefers <main> over <article> at sibling level', () => {
  const doc = makeDoc('<article>aside</article><main><p>main content</p></main>');

  const result = getMainContent.run(doc);

  assert.equal(result.tagName.toLowerCase(), 'main');
});

function makeDoc(bodyHTML: string): HTMLDocument {
  const doc = document.implementation.createHTMLDocument('');
  doc.body.innerHTML = bodyHTML;
  return doc as HTMLDocument;
}
