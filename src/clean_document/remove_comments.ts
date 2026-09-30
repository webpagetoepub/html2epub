import { Step } from "../step";
import { collectNodes } from "./collect_nodes";

const DESCRIPTION = "Removing all HTML comments";

function removeAllComments(htmlDoc: HTMLDocument) {
  const comments = collectNodes<Comment>(
    htmlDoc.documentElement,
    NodeFilter.SHOW_COMMENT,
  );

  for (const comment of comments) {
    comment.remove();
  }
}

export default new Step(DESCRIPTION, removeAllComments);
