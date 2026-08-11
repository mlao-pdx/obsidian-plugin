# TSDoc conventions

This project uses [TSDoc](https://tsdoc.org/) as its doc-comment dialect.
Grammar is enforced by `eslint-plugin-tsdoc`'s `tsdoc/syntax` rule
(`eslint.config.mts`) — a malformed doc comment fails `npm run lint`. The
one-`@remarks`-per-symbol rule below is enforced by a local custom rule,
`local/tsdoc-single-remarks` (`eslint-rules/tsdoc-single-remarks.ts`), for
the reason explained in section a.

## a. Tag usage

- `@see` — one or more spec references, in the existing prose format this
  codebase already uses: `docs/spec/12-architecture.md §12.2`. Point at
  Appendix B (`§B.18` etc.) when the "why" is a spec-level decision rather
  than a local implementation detail.
- `@remarks` — **exactly one per symbol, always.** This is a project
  convention that `tsdoc/syntax` cannot enforce on its own: it validates
  TSDoc grammar, but a duplicate `@remarks` tag is not a grammar violation.
  In practice, `@microsoft/tsdoc`'s parser silently keeps only the _last_
  `@remarks` block it finds and discards the rest without any error — so a
  second `@remarks` tag is a silent data-loss bug, not a grammar failure.
  That gap is closed by a local custom rule,
  `eslint-rules/tsdoc-single-remarks.ts` (registered as
  `local/tsdoc-single-remarks`), which counts `@remarks` occurrences per
  doc comment directly and fails the build on more than one. When a
  reason changes, **do not add a second `@remarks` tag** — edit the
  existing one to prepend a new dated entry (see format below).

Only add `@remarks` when the comment actually states a "why." Purely
descriptive comments (what the symbol is/does, with no stated rationale)
don't need one — don't invent a reason that wasn't there.

## b. `@remarks` history format — reverse-chronological, newest first

Within the single `@remarks` block, each reason is one dated, tagged
paragraph. When a reason is superseded, keep it — prefixed `SUPERSEDED` —
below the new entry, oldest at the bottom. This mirrors Appendix B.12's
"add a new node, mark the old one superseded, never edit in place" rule,
adapted to fit inside one TSDoc tag instead of a new node in a diagram.

Reason-tag vocabulary (parenthetical, lowercase, first word of the entry):
`(bugfix)`, `(perf)`, `(cm6-quirk)`, `(obsidian-idiom)`, `(spec-change)`,
`(design)` as a fallback for anything not covered by the others. Date format
`YYYY-MM-DD`.

Worked example:

```ts
/**
 * Reads the current Local Scope owner for an entity.
 *
 * @see docs/spec/12-architecture.md §12.3
 * @remarks
 * (perf, 2026-09-01) Switched from a `Map<string, ScopeMapRow>` keyed by
 * path to the `entityId`-keyed lookup the port signature now uses, after
 * confirming path-keyed lookups required a full table scan on every
 * rename event.
 *
 * SUPERSEDED (design, 2026-08-12): Originally kept a path-keyed cache here
 * because paths were the only identifier Layer 2 had available at the
 * time this was written. No longer applies once `PersistencePort`'s
 * `id`-based API (§12.3) was implemented.
 */
```

- A `(spec-change)` entry should name the Appendix B record it traces to
  (e.g. "per B.18, no suppression check is performed here at all") rather
  than re-explain the decision — the spec is the source of truth for _why
  the design is what it is_; the code comment is for _why this line is
  what it is_.
- Do not add a `SUPERSEDED` entry for the very first reason a symbol was
  written for — only once a second reason replaces it.

## c. Flagging a known inconsistency (not a normal `@remarks` entry)

When a doc comment or shape is discovered to contradict the current spec
(e.g. describing a design that Appendix B has since retired) and fixing it
is out of scope for the change at hand, mark it explicitly with a
`(spec-change)` entry prefixed `FLAGGED` instead of silently normalizing the
prose as if the old design were still current:

```ts
/**
 * @remarks
 * (spec-change, 2026-08-10) FLAGGED: this interface still describes a
 * design Decision Record B.18 retired in full. Needs a follow-up pass to
 * reconcile the shape with the current model (§12.1) — not fixed here.
 */
```

`FLAGGED` entries get resolved (not just superseded) once the follow-up work
lands — replace the entry with a normal one describing the corrected shape.
