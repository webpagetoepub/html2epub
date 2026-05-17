import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import '../../test/setup';
import removeWhitespaces from '../../src/clean_document/remove_whitespaces';

test('collapses multiple spaces into one', () => {
  const doc = makeDoc('<p>too  many   spaces</p>');

  removeWhitespaces.run(doc);

  assert.equal(doc.querySelector('p')!.textContent, 'too many spaces');
});

test('replaces tabs with spaces', () => {
  const doc = makeDoc('<p>word\tword</p>');

  removeWhitespaces.run(doc);

  assert.equal(doc.querySelector('p')!.textContent, 'word word');
});

test('removes carriage returns', () => {
  const doc = makeDoc('<p>line\rend</p>');

  removeWhitespaces.run(doc);

  assert.equal(doc.querySelector('p')!.textContent!.includes('\r'), false);
});

test('collapses multiple newlines into a single newline', () => {
  const doc = makeDoc('<p>line\n\n\nextra</p>');

  removeWhitespaces.run(doc);

  const text = doc.querySelector('p')!.textContent!;

  assert.match(text, /line\nextra/);
});

test('removes trailing spaces before a newline', () => {
  const doc = makeDoc('<p>line   \nend</p>');

  removeWhitespaces.run(doc);

  const text = doc.querySelector('p')!.textContent!;

  assert.equal(text.includes('   \n'), false);
});

test('does not modify whitespace inside a <pre> element', () => {
  const original = 'line1\n    indented\n  two';
  const doc = makeDoc(`<pre>${original}</pre>`);

  removeWhitespaces.run(doc);

  assert.equal(doc.querySelector('pre')!.textContent, original);
});

test('does not modify whitespace inside a <code> element', () => {
  const original = 'a   b\t\tc';
  const doc = makeDoc(`<code>${original}</code>`);

  removeWhitespaces.run(doc);

  assert.equal(doc.querySelector('code')!.textContent, original);
});

function makeDoc(bodyHTML: string): HTMLDocument {
  const doc = document.implementation.createHTMLDocument('');
  doc.body.innerHTML = bodyHTML;
  return doc as HTMLDocument;
}
