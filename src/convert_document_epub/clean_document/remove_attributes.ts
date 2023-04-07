import step from '../../step';

const DESCRIPTION = 'Removing unused element attributes';

const STYLE_ATTRIBUTES_TO_REMOVE = ['style', 'class', 'id'];

const WINDOW_EVENT_ATTRIBUTES_TO_REMOVE = [
  'onafterprint', 'onbeforeprint', 'onbeforeunload', 'onerror', 'onhashchange',
  'onload', 'onmessage', 'onoffline', 'ononline', 'onpagehide', 'onpageshow',
  'onpopstate', 'onresize', 'onstorage', 'onunload',
];
const FORM_EVENTS_ATTRIBUTES_TO_REMOVE = [
  'onblur', 'onchange', 'oncontextmenu', 'onfocus', 'oninput', 'oninvalid',
  'onreset', 'onsearch', 'onselect', 'onsubmit',
];
const KEYBOARD_EVENTS_ATTRIBUTES_TO_REMOVE = [
  'onkeydown', 'onkeypress', 'onkeyup',
];
const MOUSE_EVENTS_ATTRIBUTES_TO_REMOVE = [
  'onclick', 'ondblclick', 'onmousedown', 'onmousemove', 'onmouseout',
  'onmouseover', 'onmouseup', 'onmousewheel', 'onwheel',
];
const DRAG_EVENTS_ATTRIBUTES_TO_REMOVE = [
  'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover',
  'ondragstart', 'ondrop', 'onscroll',
];
const CLIPBOARD_EVENTS_ATTRIBUTE_TO_REMOVE = ['oncopy', 'oncut', 'onpaste'];
const MISC_EVENTS_TO_REMOVE = ['ontoggle'];
const EVENTS_ATTRIBUTES_TO_REMOVE = [].concat(
  WINDOW_EVENT_ATTRIBUTES_TO_REMOVE,
  FORM_EVENTS_ATTRIBUTES_TO_REMOVE,
  KEYBOARD_EVENTS_ATTRIBUTES_TO_REMOVE,
  MOUSE_EVENTS_ATTRIBUTES_TO_REMOVE,
  DRAG_EVENTS_ATTRIBUTES_TO_REMOVE,
  CLIPBOARD_EVENTS_ATTRIBUTE_TO_REMOVE,
  MISC_EVENTS_TO_REMOVE,
);

const INTERATIVE_ATTRIBUTES_TO_REMOVE = [
  'contextmenu', 'draggable', 'tabindex', 'for',
];

const ATTRIBUTES_TO_REMOVE = [].concat(
  STYLE_ATTRIBUTES_TO_REMOVE,
  EVENTS_ATTRIBUTES_TO_REMOVE,
  INTERATIVE_ATTRIBUTES_TO_REMOVE,
);


function removeAttributes(htmlDoc: HTMLDocument) {
  for (const attribute of ATTRIBUTES_TO_REMOVE) {
    const elements = htmlDoc.querySelectorAll(`[${attribute}]`);

    for (const element of Array.from(elements)) {
      element.removeAttribute(attribute);
    }
  }
}

export default step(DESCRIPTION, removeAttributes);
