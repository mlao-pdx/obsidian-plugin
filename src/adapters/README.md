# `src/adapters/`

Adapter implementations of the interfaces declared in `src/ports/`. This is
where `obsidian` (and, later, `dexie`) runtime imports are allowed — the
`no-restricted-imports` override in `eslint.config.mts` only targets
`src/core/**` and `src/ports/**` (see `src/core/README.md`#enforcement,
`src/ports/README.md`).

See `docs/dev/tsdoc-conventions.md` for the doc-comment format (`@see`/
`@remarks`) used throughout this directory.

## Current adapters

| Adapter                 | Implements   | Wraps                                                                                     |
| ----------------------- | ------------ | ----------------------------------------------------------------------------------------- |
| `ObsidianLoggerAdapter` | `LoggerPort` | `Vault.adapter` (`DataAdapter`), under a `_<manifest.id>/logs/` folder derived at runtime |

`logger-format.ts` holds the pure formatting/level-filtering helpers the
adapter uses, split out with zero `obsidian` import so they're unit-testable
without mocking the Obsidian API.

See `src/ports/README.md` for the design rationale.
