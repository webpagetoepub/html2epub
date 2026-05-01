import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import '../../test/setup';
import setExternalLinksBlank from '../../src/fix_links/set_external_links_blank';

test('adds target="_blank" to an https link', () => {
  const content = makeContent('<a href="https://example.com">link</a>');

  setExternalLinksBlank.run([content]);

  assert.equal(content.querySelector('a')!.getAttribute('target'), '_blank');
});

test('adds target="_blank" to an http link', () => {
  const content = makeContent('<a href="http://example.com">link</a>');

  setExternalLinksBlank.run([content]);

  assert.equal(content.querySelector('a')!.getAttribute('target'), '_blank');
});

test('does not add target="_blank" to an anchor link', () => {
  const content = makeContent('<a href="#section">jump</a>');

  setExternalLinksBlank.run([content]);

  assert.equal(content.querySelector('a')!.hasAttribute('target'), false);
});

test('processes links across multiple content elements', () => {
  const contents = [
    makeContent('<a href="https://first.com">first</a>'),
    makeContent('<a href="https://second.com">second</a>'),
  ];

  setExternalLinksBlank.run(contents);

  assert.equal(contents[0].querySelector('a')!.getAttribute('target'), '_blank');
  assert.equal(contents[1].querySelector('a')!.getAttribute('target'), '_blank');
});

function makeContent(html: string): Element {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div;
}
