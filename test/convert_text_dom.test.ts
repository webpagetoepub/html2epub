import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import './setup';
import convertTextToDOM from '../src/convert_text_dom';

test('returns an HTMLDocument from an HTML string', () => {
  const result = convertTextToDOM.run('<html><body><p>hello</p></body></html>');

  assert.ok(result instanceof document.constructor, 'should be a Document');
  assert.equal(result.querySelector('p')!.textContent, 'hello');
});

test('parses the document title', () => {
  const result = convertTextToDOM.run('<html><head><title>My Title</title></head></html>');

  assert.equal(result.title, 'My Title');
});

test('parses nested elements correctly', () => {
  const result = convertTextToDOM.run('<body><article><h1>Hi</h1><p>Para</p></article></body>');

  assert.equal(result.querySelector('article h1')!.textContent, 'Hi');
  assert.equal(result.querySelector('article p')!.textContent, 'Para');
});
