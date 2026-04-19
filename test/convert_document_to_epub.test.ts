import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import convertDocumentToEPub from '../src/index';

const HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Test Article</title>
    <meta name="author" content="Test Author" />
  </head>
  <body>
    <main>
      <p>This is the main content of the test article. It has enough text to
      exceed the 80-character threshold used by the content splitter so it
      gets included as a chapter in the resulting EPUB file.</p>
    </main>
  </body>
</html>`;

test('converts an HTML page to an EPUB without crashing', async () => {
  const url = 'https://example.com/article';
  const loadImageFrom = async (_: string): Promise<Blob> => new Blob([], { type: 'image/png' });

  const result = await convertDocumentToEPub(
    url,
    Promise.resolve(HTML),
    loadImageFrom,
    () => {},
    () => {},
  );

  assert.ok(result, 'result should be defined');
  assert.ok(result.epub instanceof Blob, 'result.epub should be a Blob');
});
