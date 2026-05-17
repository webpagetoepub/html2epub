import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import '../../test/setup';
import removeComments from '../../src/clean_document/remove_comments';

test('removes a comment inside an element', () => {
  const doc = makeDoc('<p>text<!-- a comment -->more</p>');

  removeComments.run(doc);

  const comments = collectComments(doc);

  assert.equal(comments.length, 0);
  assert.equal(doc.querySelector('p')!.textContent, 'textmore');
});

test('removes multiple comments throughout the document', () => {
  const doc = makeDoc('<!-- first --><p><!-- second -->text<!-- third --></p>');

  removeComments.run(doc);

  const comments = collectComments(doc);

  assert.equal(comments.length, 0);
  assert.equal(doc.querySelector('p')!.textContent, 'text');
});

test('preserves element nodes when removing comments', () => {
  const doc = makeDoc('<!-- drop --><p>keep</p>');

  removeComments.run(doc);

  assert.equal(doc.querySelectorAll('p').length, 1);
  assert.equal(doc.querySelector('p')!.textContent, 'keep');
});

test('does nothing when there are no comments', () => {
  const doc = makeDoc('<p>no comments here</p>');

  removeComments.run(doc);

  assert.equal(doc.querySelector('p')!.textContent, 'no comments here');
});

function makeDoc(bodyHTML: string): HTMLDocument {
  const doc = document.implementation.createHTMLDocument('');
  doc.body.innerHTML = bodyHTML;
  return doc as HTMLDocument;
}

function collectComments(doc: HTMLDocument): Comment[] {
  const comments: Comment[] = [];
  const iterator = doc.createNodeIterator(doc.documentElement, NodeFilter.SHOW_COMMENT);
  let node: Comment;
  while ((node = iterator.nextNode() as Comment) !== null) {
    comments.push(node);
  }
  return comments;
}
