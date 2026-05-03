import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import './setup';
import loadImagesStepFactory from '../src/load_images';

const PAGE_URL = 'https://example.com/page';

test('returns loaded image metadata', async () => {
  const main = makeElement('<img src="https://example.com/photo.jpg">');
  const step = loadImagesStepFactory(async () => new Blob([], { type: 'image/png' }));

  const result = await step.run(main, PAGE_URL);

  assert.equal(result.length, 1);
  assert.ok(result[0].id, 'loaded image should have an id');
  assert.ok(result[0].blob instanceof Blob);
});

test('falls back to no-image placeholder when load throws', async () => {
  const main = makeElement('<img src="https://example.com/broken.jpg">');
  const step = loadImagesStepFactory(async () => { throw new Error('network error'); });

  const result = await step.run(main, PAGE_URL);

  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'no-image');
});

test('falls back to no-image when response has non-image content type', async () => {
  const main = makeElement('<img src="https://example.com/file.html">');
  const step = loadImagesStepFactory(async () => new Blob([], { type: 'text/html' }));

  const result = await step.run(main, PAGE_URL);

  assert.equal(result[0].id, 'no-image');
});

test('skips img elements with data: URLs', async () => {
  const dataUrl = 'data:image/png;base64,abc123';
  const main = makeElement(`<img src="${dataUrl}">`);
  let callCount = 0;
  const step = loadImagesStepFactory(async () => { callCount++; return new Blob([], { type: 'image/png' }); });

  await step.run(main, PAGE_URL);

  assert.equal(callCount, 0, 'data: URLs should not trigger loadImageFrom');
});

test('resolves relative image URLs to absolute before loading', async () => {
  const main = makeElement('<img src="images/photo.jpg">');
  const receivedUrls: string[] = [];
  const step = loadImagesStepFactory(async (url) => { receivedUrls.push(url); return new Blob([], { type: 'image/png' }); });

  await step.run(main, PAGE_URL);

  assert.equal(receivedUrls[0], 'https://example.com/images/photo.jpg');
});

test('deduplicates images with the same URL', async () => {
  const main = makeElement(
    '<img src="https://example.com/photo.jpg">' +
    '<img src="https://example.com/photo.jpg">'
  );
  let callCount = 0;
  const step = loadImagesStepFactory(async () => { callCount++; return new Blob([], { type: 'image/png' }); });

  const result = await step.run(main, PAGE_URL);

  assert.equal(callCount, 1, 'duplicate URLs should only be fetched once');
  assert.equal(result.length, 1);
});

function makeElement(bodyHTML: string): Element {
  const doc = document.implementation.createHTMLDocument('');
  doc.body.innerHTML = bodyHTML;
  return doc.body;
}
