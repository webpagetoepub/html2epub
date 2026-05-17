import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import './setup';
import getMetadata from '../src/get_metadata';

test('returns title from <title> tag', () => {
  const doc = makeDoc('', 'Page Title');

  const result = getMetadata.run(doc, 'https://example.com');

  assert.equal(result.title, 'Page Title');
});

test('returns hostname as title when document has no title', () => {
  const doc = makeDoc('', '');

  const result = getMetadata.run(doc, 'https://example.com/path');

  assert.equal(result.title, 'example.com');
});

test('returns the URL itself as title when URL is invalid and document has no title', () => {
  const doc = makeDoc('', '');

  const result = getMetadata.run(doc, 'not-a-url');

  assert.equal(result.title, 'not-a-url');
});

test('returns date from meta[itemprop="datePublished"]', () => {
  const doc = makeDoc('<meta itemprop="datePublished" content="2024-01-15">');

  const result = getMetadata.run(doc, 'https://example.com');

  assert.equal(result.date.toISOString().startsWith('2024-01-15'), true);
});

test('returns date from time[itemprop="startDate"][datetime]', () => {
  const doc = makeDoc('<time itemprop="startDate" datetime="2023-06-01">June 1</time>');

  const result = getMetadata.run(doc, 'https://example.com');

  assert.equal(result.date.toISOString().startsWith('2023-06-01'), true);
});

test('returns date from meta[name="article:published_time"]', () => {
  const doc = makeDoc('<meta name="article:published_time" content="2022-03-10T10:00:00Z">');

  const result = getMetadata.run(doc, 'https://example.com');

  assert.equal(result.date.toISOString().startsWith('2022-03-10'), true);
});

test('returns author from meta[name="author"]', () => {
  const doc = makeDoc('<meta name="author" content="Jane Doe">');

  const result = getMetadata.run(doc, 'https://example.com');

  assert.equal(result.author, 'Jane Doe');
});

test('returns author from [itemprop="author"] meta[itemprop="name"]', () => {
  const doc = makeDoc('<div itemprop="author"><meta itemprop="name" content="John Smith"></div>');

  const result = getMetadata.run(doc, 'https://example.com');

  assert.equal(result.author, 'John Smith');
});

test('returns author text from [itemprop="author"] element', () => {
  const doc = makeDoc('<span itemprop="author">Alice</span>');

  const result = getMetadata.run(doc, 'https://example.com');

  assert.equal(result.author, 'Alice');
});

test('returns empty string when no author information', () => {
  const doc = makeDoc('');

  const result = getMetadata.run(doc, 'https://example.com');

  assert.equal(result.author, '');
});

test('returns publisher from [itemprop="publisher"] meta[itemprop="name"]', () => {
  const doc = makeDoc('<div itemprop="publisher"><meta itemprop="name" content="The Times"></div>');

  const result = getMetadata.run(doc, 'https://example.com');

  assert.equal(result.publisher, 'The Times');
});

test('returns publisher from meta[name="og:site_name"]', () => {
  const doc = makeDoc('<meta name="og:site_name" content="My Site">');

  const result = getMetadata.run(doc, 'https://example.com');

  assert.equal(result.publisher, 'My Site');
});

test('returns URL as publisher when no publisher metadata', () => {
  const doc = makeDoc('');

  const result = getMetadata.run(doc, 'https://example.com');

  assert.equal(result.publisher, 'https://example.com');
});

test('returns description from meta[name="description"]', () => {
  const doc = makeDoc('<meta name="description" content="An article about things">');

  const result = getMetadata.run(doc, 'https://example.com');

  assert.equal(result.description, 'An article about things');
});

test('returns empty string when no description', () => {
  const doc = makeDoc('');

  const result = getMetadata.run(doc, 'https://example.com');

  assert.equal(result.description, '');
});

test('returns tags from meta[name="keywords"]', () => {
  const doc = makeDoc('<meta name="keywords" content="news, tech, ai">');

  const result = getMetadata.run(doc, 'https://example.com');

  assert.deepEqual(result.tags, ['news', 'tech', 'ai']);
});

test('returns empty tags array when no keywords', () => {
  const doc = makeDoc('');

  const result = getMetadata.run(doc, 'https://example.com');

  assert.deepEqual(result.tags, []);
});

test('sets uuid to the provided URL', () => {
  const doc = makeDoc('');

  const result = getMetadata.run(doc, 'https://example.com/article');

  assert.equal(result.uuid, 'https://example.com/article');
});

function makeDoc(headHTML: string, title = ''): HTMLDocument {
  const doc = document.implementation.createHTMLDocument(title);
  doc.head.innerHTML += headHTML;
  return doc as HTMLDocument;
}
