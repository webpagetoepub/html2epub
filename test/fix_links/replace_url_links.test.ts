import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import '../../test/setup';
import replaceUrlLinks from '../../src/fix_links/replace_url_links';

const ORIGIN_URL = 'https://example.com/article/page.html';

test('converts a relative link to an absolute URL', () => {
  const content = makeContent('<a href="other.html">link</a>');

  replaceUrlLinks.run([content], ORIGIN_URL);

  assert.equal(
    content.querySelector('a')!.getAttribute('href'),
    'https://example.com/article/other.html',
  );
});

test('converts a root-relative link to an absolute URL', () => {
  const content = makeContent('<a href="/about">about</a>');

  replaceUrlLinks.run([content], ORIGIN_URL);

  assert.equal(
    content.querySelector('a')!.getAttribute('href'),
    'https://example.com/about',
  );
});

test('leaves an already-absolute URL unchanged', () => {
  const content = makeContent('<a href="https://other.com/page">link</a>');

  replaceUrlLinks.run([content], ORIGIN_URL);

  assert.equal(
    content.querySelector('a')!.getAttribute('href'),
    'https://other.com/page',
  );
});

test('converts a same-page anchor link to just the fragment', () => {
  const content = makeContent(`<a href="${ORIGIN_URL}#section">jump</a>`);

  replaceUrlLinks.run([content], ORIGIN_URL);

  assert.equal(content.querySelector('a')!.getAttribute('href'), '#section');
});

test('keeps the full URL when the anchor points to a different page', () => {
  const content = makeContent('<a href="https://other.com/page#section">link</a>');

  replaceUrlLinks.run([content], ORIGIN_URL);

  assert.equal(
    content.querySelector('a')!.getAttribute('href'),
    'https://other.com/page#section',
  );
});

test('processes links across multiple content elements', () => {
  const contents = [
    makeContent('<a href="a.html">a</a>'),
    makeContent('<a href="b.html">b</a>'),
  ];

  replaceUrlLinks.run(contents, ORIGIN_URL);

  assert.equal(
    contents[0].querySelector('a')!.getAttribute('href'),
    'https://example.com/article/a.html',
  );
  assert.equal(
    contents[1].querySelector('a')!.getAttribute('href'),
    'https://example.com/article/b.html',
  );
});

function makeContent(html: string): Element {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div;
}
