import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import '../../test/setup';
import removeEmptySvg, { isEmptySvg } from '../../src/clean_document/remove_empty_svg';

test('removes an empty <svg> element', () => {
  const doc = makeDoc('<svg></svg>');

  removeEmptySvg.run(doc);

  assert.equal(doc.querySelectorAll('svg').length, 0);
});

test('preserves a <svg> element that has children', () => {
  const doc = makeDoc('<svg><circle cx="5" cy="5" r="5"/></svg>');

  removeEmptySvg.run(doc);

  assert.equal(doc.querySelectorAll('svg').length, 1);
});

test('removes multiple empty <svg> elements', () => {
  const doc = makeDoc('<svg></svg><p>text</p><svg></svg>');

  removeEmptySvg.run(doc);

  assert.equal(doc.querySelectorAll('svg').length, 0);
  assert.equal(doc.querySelectorAll('p').length, 1);
});

test('isEmptySvg returns true for an SVGElement with no children', () => {
  const doc = makeDoc('<svg></svg>');
  const svg = doc.querySelector('svg') as SVGElement;

  const result = isEmptySvg(svg);

  assert.equal(result, true);
});

test('isEmptySvg returns false for an SVGElement with children', () => {
  const doc = makeDoc('<svg><rect width="10" height="10"/></svg>');
  const svg = doc.querySelector('svg') as SVGElement;

  const result = isEmptySvg(svg);

  assert.equal(result, false);
});

function makeDoc(bodyHTML: string): HTMLDocument {
  const doc = document.implementation.createHTMLDocument('');
  doc.body.innerHTML = bodyHTML;
  return doc as HTMLDocument;
}
