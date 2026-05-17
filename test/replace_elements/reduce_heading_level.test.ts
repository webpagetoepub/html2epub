import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import '../setup';
import reduceHeadingLevel from '../../src/replace_elements/reduce_heading_level';

test('reduces h1 to h2 when h1 is present', () => {
  const doc = makeDoc('<h1>Title</h1>');

  reduceHeadingLevel.run(doc);

  assert.equal(doc.querySelectorAll('h1').length, 0);
  assert.equal(doc.querySelectorAll('h2').length, 1);
  assert.equal(doc.querySelector('h2')!.textContent, 'Title');
});

test('reduces all heading levels when h1 is present', () => {
  const doc = makeDoc('<h1>one</h1><h2>two</h2><h3>three</h3><h4>four</h4><h5>five</h5>');

  reduceHeadingLevel.run(doc);

  assert.equal(doc.querySelectorAll('h1').length, 0);
  assert.equal(doc.querySelectorAll('h2').length, 1);
  assert.equal(doc.querySelectorAll('h3').length, 1);
  assert.equal(doc.querySelectorAll('h4').length, 1);
  assert.equal(doc.querySelectorAll('h5').length, 1);
  assert.equal(doc.querySelectorAll('h6').length, 1);
});

test('converts h6 to a <p> with role="heading" and aria-level="7"', () => {
  const doc = makeDoc('<h1>title</h1><h6>deep</h6>');

  reduceHeadingLevel.run(doc);

  const p = doc.querySelector('p[role="heading"]');

  assert.ok(p, '<p role="heading"> should exist');
  assert.equal(p.getAttribute('aria-level'), '7');
  assert.equal(p.textContent, 'deep');
});

test('does nothing when there is no h1', () => {
  const doc = makeDoc('<h2>Section</h2><h3>Sub</h3>');

  reduceHeadingLevel.run(doc);

  assert.equal(doc.querySelectorAll('h2').length, 1);
  assert.equal(doc.querySelectorAll('h3').length, 1);
  assert.equal(doc.querySelectorAll('h1').length, 0);
});

test('preserves children when reducing heading level', () => {
  const doc = makeDoc('<h1><strong>bold title</strong></h1>');

  reduceHeadingLevel.run(doc);

  assert.equal(doc.querySelectorAll('h1').length, 0);
  assert.ok(doc.querySelector('h2 strong'), '<strong> should be inside <h2>');
  assert.equal(doc.querySelector('h2 strong')!.textContent, 'bold title');
});

function makeDoc(bodyHTML: string): HTMLDocument {
  const doc = document.implementation.createHTMLDocument('');
  doc.body.innerHTML = bodyHTML;
  return doc as HTMLDocument;
}
