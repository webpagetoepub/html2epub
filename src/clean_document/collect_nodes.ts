// Collects every node under `root` matching `whatToShow` into an array up front,
// so callers can mutate the DOM (remove/replace nodes) while iterating without
// invalidating a live NodeIterator mid-traversal.
//
// Usage:
//   const comments = collectNodes<Comment>(doc.documentElement, NodeFilter.SHOW_COMMENT);
export function collectNodes<T extends Node>(
  root: Node,
  whatToShow: number,
): T[] {
  const ownerDocument = root.ownerDocument;
  if (!ownerDocument) {
    throw new Error(
      `Cannot collect nodes: root "${root.nodeName}" has no ownerDocument.`,
    );
  }

  const iterator = ownerDocument.createNodeIterator(root, whatToShow);
  const nodes: T[] = [];

  let node = iterator.nextNode();
  while (node !== null) {
    nodes.push(node as T);
    node = iterator.nextNode();
  }

  return nodes;
}
