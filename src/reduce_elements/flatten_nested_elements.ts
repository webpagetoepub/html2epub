import { Step } from "../step";

const DESCRIPTION = "Flattening redundantly-nested same-tag elements";

// Only structural wrappers are collapsed. A redundant chain like
// `<div><div><div>Hello</div></div></div>` carries no semantic value, so it is
// flattened down to a single `<div>Hello</div>`.
const FLATTENABLE_TAGS = ["div", "span"];

// Matches each inner element that is the sole element child of a same-tag
// parent, e.g. "div > div:only-child, span > span:only-child".
const NESTED_SELECTOR = FLATTENABLE_TAGS.map(
  (tag) => `${tag} > ${tag}:only-child`,
).join(", ");

function flattenNestedElements(htmlDoc: HTMLDocument) {
  const nested = Array.from(
    htmlDoc.querySelectorAll<HTMLElement>(NESTED_SELECTOR),
  );

  for (const element of nested) {
    if (canFlatten(element)) {
      // Unwrap the inner element into its current parent. Doing this for every
      // matched inner element collapses a multi-level chain regardless of
      // document order, because each one dissolves into whatever parent it has
      // after earlier unwraps.
      element.replaceWith(...Array.from(element.childNodes));
    }
  }
}

function canFlatten(element: HTMLElement) {
  const parent = element.parentElement;
  if (!parent || parent.tagName !== element.tagName) {
    return false;
  }

  // `:only-child` ignores text-node siblings, so `<div>text<div>x</div></div>`
  // still matches. Keep such wrappers: they hold meaningful content of their own.
  return !hasNonWhitespaceText(parent, element);
}

function hasNonWhitespaceText(parent: HTMLElement, child: HTMLElement) {
  for (const node of Array.from(parent.childNodes)) {
    if (node === child) {
      continue;
    }

    if (node.nodeType === Node.TEXT_NODE && node.nodeValue!.trim() !== "") {
      return true;
    }
  }

  return false;
}

export default new Step(DESCRIPTION, flattenNestedElements);
