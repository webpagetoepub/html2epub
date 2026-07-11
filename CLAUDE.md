# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test                  # Run all tests
npm run lint              # ESLint on src/ and config files
npm run typecheck         # tsc --noEmit type check
npm run format            # Prettier write on src/, test/, and *.mjs
npm run format:check      # Prettier check without writing
npm run check:unused-files # knip — report unused files (production)
```

To run a single test file directly:
```bash
npx tsx --require ./test/setup.ts --test ./test/convert_document_to_epub.test.ts
```

## Architecture

This is a browser-targeted TypeScript library that converts an HTML string into an EPUB `Blob`. It is bundled via Webpack for browser use and can also be imported as a Node.js dependency.

### Pipeline Overview

`convertDocumentToEPub` in `src/index.ts` orchestrates a linear pipeline:

1. Parse HTML string → DOM (`convert_text_dom.ts`)
2. Extract metadata — title, author, date, publisher, description, tags (`get_metadata.ts`)
3. Clean the DOM — sequential sub-steps in `src/clean_document/`
4. Replace elements — sub-pipeline in `src/replace_elements/`: reduce heading levels (h1→h2 … h6→p), replace simple element tags, replace unknown elements
5. Identify main content element — `<main>`, `[role="main"]`, `<article>`, or `<body>` (`get_main_content.ts`)
6. Load images via caller-supplied callback; failures fall back to a placeholder PNG (`load_images.ts`)
7. Split content into chapters at h2/h3 boundaries (80-char minimum per chapter) (`split_main_content.ts`)
8. Fix links — resolve relative URLs, add `target="_blank"` to external links, remove broken anchors (`src/fix_links/`)
9. Serialize chapters to XHTML strings (`src/index.ts`)
10. Assemble EPUB via jEpub (`create_epub.ts`)

### Step/Process Framework (`src/step.ts`)

All pipeline stages are wrapped in `Step` objects. A `Process` manages an ordered list of steps that declare their prerequisites by referencing prior `Step` objects; the runner resolves those to result indices and feeds each step its dependencies' outputs. The injected `Logger` records each step's name before it runs and emits `[ERROR] Error on "<step>"` before rethrowing on failure. `SubProcessStep` lets a step expand into a nested `Process` (its `getStepCount` contributes to the total reported by `callbackLength`).

### Public API (`src/index.ts`)

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

`callbackStepCompleted` is invoked once per completed step; `callbackLength` receives the total step count up front. `Logger` (`src/logger.ts`) is a `{ log, error }` interface the caller supplies for progress/error output.

The caller is responsible for fetching the HTML and providing an image loader — the library itself does no network I/O.

### Build vs. Test environment

- **Webpack build**: targets browsers; `url-loader` inlines `img/no-image.png` as a base64 data URL at build time.
- **Tests (Node.js)**: `test/setup.ts` is `--require`d before tests run. It registers a `Module._extensions['.png']` handler to serve the placeholder PNG as a base64 data URL (since `tsx` converts ESM imports to CJS `require()` calls) and sets up JSDOM globals (`DOMParser`, `XMLSerializer`, `document`, `NodeFilter`, `Node`, etc.) that the source code expects from a browser environment.

## Code style

- Functions: 4-20 lines. Split if longer.
- Files: under 500 lines. Split by responsibility.
- One thing per function, one responsibility per module (SRP).
- Names: specific and unique. Avoid `data`, `handler`, `Manager`.
  Prefer names that return <5 grep hits in the codebase.
- Types: explicit. No `any`, no `Dict`, no untyped functions.
- No code duplication. Extract shared logic into a function/module.
- Early returns over nested ifs. Max 2 levels of indentation.
- Exception messages must include the offending value and expected shape.

## Comments

- Keep your own comments. Don't strip them on refactor — they carry
  intent and provenance.
- Write WHY, not WHAT. Skip `// increment counter` above `i++`.
- Docstrings on public functions: intent + one usage example.
- Reference issue numbers / commit SHAs when a line exists because
  of a specific bug or upstream constraint.

## Tests

- Tests run with a single command: `npm test`.
- Every new function gets a test. Bug fixes get a regression test.
- Mock external I/O (API, DB, filesystem) with named fake classes,
  not inline stubs.
- Tests must be F.I.R.S.T: fast, independent, repeatable,
  self-validating, timely.

## Formatting

- Use the language default formatter `prettier`. Don't discuss style beyond that.
