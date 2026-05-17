import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import '../../test/setup';
import removeBrokenAnchorLinks from '../../src/fix_links/remove_broken_anchor_links';

test('replaces an anchor link whose target does not exist with a <span>', () => {
  const content = makeContent('<a href="#missing">link</a>');

  removeBrokenAnchorLinks.run([content]);

  assert.equal(content.querySelectorAll('a').length, 0);
  assert.equal(content.querySelectorAll('span').length, 1);
  assert.equal(content.querySelector('span')!.textContent, 'link');
});

test('keeps an anchor link whose target exists in the same content element', () => {
  const content = makeContent('<div id="section">target</div><a href="#section">link</a>');

  removeBrokenAnchorLinks.run([content]);

  const a = content.querySelector('a');

  assert.ok(a, '<a> should be preserved');
  assert.equal(a.getAttribute('href'), '#section');
});

test('keeps an anchor link whose target exists via a[name]', () => {
  const content = makeContent('<a name="top">top</a><a href="#top">go top</a>');

  removeBrokenAnchorLinks.run([content]);

  const links = content.querySelectorAll('a[href]');

  assert.equal(links.length, 1);
  assert.equal(links[0].getAttribute('href'), '#top');
});

test('rewrites a cross-chapter anchor link with the target page filename', () => {
  const contents = [
    makeContent('<a href="#intro">go to intro</a>'),
    makeContent('<div id="intro">intro content</div>'),
  ];

  removeBrokenAnchorLinks.run(contents);

  const a = contents[0].querySelector('a');

  assert.ok(a, '<a> should be preserved');
  assert.equal(a.getAttribute('href'), 'page-1.html#intro');
});

test('preserves child content of a replaced broken anchor link', () => {
  const content = makeContent('<a href="#gone"><strong>bold text</strong></a>');

  removeBrokenAnchorLinks.run([content]);

  assert.equal(content.querySelectorAll('a').length, 0);
  assert.ok(content.querySelector('strong'), '<strong> should be preserved inside <span>');
  assert.equal(content.querySelector('strong')!.textContent, 'bold text');
});

test('does not affect non-anchor (external) links', () => {
  const content = makeContent('<a href="https://example.com">external</a>');

  removeBrokenAnchorLinks.run([content]);

  const a = content.querySelector('a');

  assert.ok(a);
  assert.equal(a.getAttribute('href'), 'https://example.com');
});

function makeContent(html: string): Element {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div;
}
