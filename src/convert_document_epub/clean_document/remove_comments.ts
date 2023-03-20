export default function removeAllComments(htmlDoc: HTMLDocument) {
  function filterNode() {
    return NodeFilter.FILTER_ACCEPT;
  }

  const comments = [];
  const iterator = htmlDoc.createNodeIterator(
    htmlDoc.documentElement,
    NodeFilter.SHOW_COMMENT,
    filterNode
  );
  let node: Comment;

  while (node = iterator.nextNode() as Comment) {
    comments.push(node);
  }

  for (const comment of comments) {
    comment.remove();
  }
}
