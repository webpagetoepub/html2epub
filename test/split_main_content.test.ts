import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import './setup';
import splitMainContent from '../src/split_main_content';

test('returns a single chapter using metadata title when no h2 headings', () => {
  const main = makeElement('<p>Some content without any headings at all.</p>');
  const metadata = { title: 'My Article' };

  const result = splitMainContent.run(main, metadata);

  assert.equal(result.length, 1);
  assert.equal(result[0].title, 'My Article');
});

test('splits content into chapters at h2 boundaries', () => {
  const main = makeElement(
    '<h2>Chapter One</h2><p>Content one.</p>' +
    '<h2>Chapter Two</h2><p>Content two.</p>'
  );
  const metadata = { title: 'Book' };

  const result = splitMainContent.run(main, metadata);

  assert.equal(result.length, 2);
  assert.equal(result[0].title, 'Chapter One');
  assert.equal(result[1].title, 'Chapter Two');
});

test('chapter elements contain content after the heading', () => {
  const main = makeElement(
    '<h2>Intro</h2><p>Paragraph text here.</p>' +
    '<h2>Body</h2><p>Body text here.</p>'
  );
  const metadata = { title: 'Doc' };

  const result = splitMainContent.run(main, metadata);

  assert.ok(result[0].element.querySelector('p')!.textContent!.includes('Paragraph text'));
  assert.ok(result[1].element.querySelector('p')!.textContent!.includes('Body text'));
});

test('uses h2 and h3 when there is only one h2', () => {
  const main = makeElement(
    '<h2>Main Chapter</h2><p>Content.</p>' +
    '<h3>Sub Section</h3><p>Sub content.</p>'
  );
  const metadata = { title: 'Doc' };

  const result = splitMainContent.run(main, metadata);

  assert.equal(result.length, 2);
  assert.equal(result[0].title, 'Main Chapter');
  assert.equal(result[1].title, 'Sub Section');
});

test('includes remaining content before first heading when it is at least 80 characters', () => {
  const longText = 'A'.repeat(80);
  const main = makeElement(
    `<p>${longText}</p>` +
    '<h2>Chapter</h2><p>Chapter content.</p>'
  );
  const metadata = { title: 'Article' };

  const result = splitMainContent.run(main, metadata);

  const titles = result.map(r => r.title);
  assert.ok(titles.includes('Article'), 'should include a chapter with metadata title');
});

test('omits remaining content before first heading when it is shorter than 80 characters', () => {
  const main = makeElement(
    '<p>Short intro.</p>' +
    '<h2>Chapter One</h2><p>Chapter content.</p>' +
    '<h2>Chapter Two</h2><p>More content.</p>'
  );
  const metadata = { title: 'Article' };

  const result = splitMainContent.run(main, metadata);

  const titles = result.map(r => r.title);
  assert.ok(!titles.includes('Article'), 'short intro should be dropped');
});

function makeElement(bodyHTML: string): Element {
  const doc = document.implementation.createHTMLDocument('');
  doc.body.innerHTML = bodyHTML;
  return doc.body;
}
