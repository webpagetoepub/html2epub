import * as Module from 'module';
import { JSDOM } from 'jsdom';

const PLACEHOLDER_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';


/* eslint-disable @typescript-eslint/no-explicit-any */
(Module as any)._extensions['.png'] = function (module) {
  module.exports = PLACEHOLDER_PNG;
};

const dom = new JSDOM('', { url: 'https://example.com' });
const domGlobals = [
  'DOMParser', 'XMLSerializer', 'XMLDocument', 'document', 'NodeFilter', 'Node',
  'Element', 'HTMLElement', 'Text', 'Comment', 'DocumentFragment',
  'MutationObserver', 'NodeIterator', 'TreeWalker', 'Range',
];
for (const name of domGlobals) {
  if (dom.window[name] !== undefined) {
    globalThis[name] = dom.window[name];
  }
}
