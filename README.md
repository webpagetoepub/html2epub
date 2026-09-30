# html2epub

A browser-targeted TypeScript library that converts an HTML page into an EPUB `Blob`.

## About

`html2epub` is the conversion engine of the [webpagetoepub](https://github.com/webpagetoepub)
project. It is **not published to npm** — it is an internal dependency developed for and
consumed by two projects:

- [webpagetoepub/webextension](https://github.com/webpagetoepub/webextension) — the browser
  extension, which feeds the library the page and images already loaded **in memory**.
- [webpagetoepub/webpagetoepub.github.io](https://github.com/webpagetoepub/webpagetoepub.github.io) —
  the website, which retrieves the page and images **over the network**.

Both consume this repository directly as a source-only git dependency. It also relies on a
project-owned fork of [jEpub](https://github.com/webpagetoepub/jEpub), likewise pinned as a git
dependency, to assemble the final EPUB container.

## Environment

The library ships **raw TypeScript source** and has **no build step of its own** — `package.json`
points `main`/`module` straight at `src/index.ts`. Consumers are expected to bundle it with their
own toolchain (for example Webpack, where `url-loader` inlines the `img/no-image.png` placeholder
at bundle time).

It targets **browser environments** and relies on browser globals such as `DOMParser`,
`XMLSerializer`, `Blob`, and `document`. The test suite runs under Node.js, providing these globals
through JSDOM shims (see `test/setup.ts`).

## Usage

The public entry point is a single function:

```ts
convertDocumentToEPub(
  url: string,
  htmlContent: Promise<string>,
  loadImageFrom: (url: string) => Promise<Blob>,
  callbackStepCompleted: () => void,
  callbackLength: (length: number) => void,
  logger: Logger,
): Promise<{ title: string; epub: Blob }>
```

| Parameter              | Description                                                                       |
| ---------------------- | --------------------------------------------------------------------------------- |
| `url`                  | The source page URL, used to resolve relative links and image sources.            |
| `htmlContent`          | A promise resolving to the raw HTML of the page.                                  |
| `loadImageFrom`        | Callback that resolves an image URL to its `Blob`.                                 |
| `callbackStepCompleted`| Invoked once per completed pipeline step (progress reporting).                     |
| `callbackLength`       | Invoked once, up front, with the total number of steps.                           |
| `logger`               | A `{ log, error }` interface the caller supplies for progress and error output.   |

It resolves to `{ title, epub }`, where `title` is the extracted document title and `epub` is the
generated EPUB as a `Blob`.

### The I/O contract

The library performs **no network I/O of its own**. The caller supplies both the HTML string and
the image loader, which is what lets the same code serve two very different consumers: the website
retrieves the page and images **over the network**, while the browser extension provides them from
the page already loaded **in memory**.

### Example

```ts
import convertDocumentToEPub from "html2epub";

const url = "https://example.com/article";

const { title, epub } = await convertDocumentToEPub(
  url,
  fetch(url).then((response) => response.text()),
  async (imageUrl) => (await fetch(imageUrl)).blob(),
  () => console.log("step completed"),
  (length) => console.log(`${length} steps to run`),
  { log: console.log, error: console.error },
);

console.log(`Generated "${title}" (${epub.size} bytes)`);
```

## Architecture

`convertDocumentToEPub` (`src/index.ts`) runs a linear pipeline:

1. Parse the HTML string into a DOM.
2. Extract metadata — title, author, date, publisher, description, tags.
3. Clean the DOM — remove comments, hidden elements, empty elements, stray attributes, etc.
4. Replace elements — reduce heading levels, replace simple tags, replace unknown elements.
5. Identify the main content element — `<main>`, `[role="main"]`, `<article>`, or `<body>`.
6. Load images via the caller-supplied callback; failures fall back to a placeholder PNG.
7. Split the content into chapters at heading boundaries.
8. Fix links — resolve relative URLs, mark external links, drop broken anchors.
9. Serialize the chapters to XHTML.
10. Assemble the EPUB via jEpub.

Every stage is wrapped in a `Step`, and a `Process` (`src/step.ts`) orchestrates them: each step
declares its prerequisites and receives their outputs, while the injected `Logger` records progress
and reports failures.

## Development

Common commands:

```bash
npm run test             # Run all tests
npm run lint         # ESLint on src/ and config files
npm run typecheck    # tsc --noEmit type check
npm run format       # Prettier write
```

Tests use Node's built-in test runner via `tsx`, with `test/setup.ts` required beforehand to install
the JSDOM globals and the placeholder-image handler. To run a single test file directly:

```bash
npx tsx --require ./test/setup.ts --test ./test/convert_document_to_epub.test.ts
```

## License

MIT — see [LICENSE](LICENSE).
