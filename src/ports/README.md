# `src/ports/`

Port interfaces: contracts defined by `src/core`'s needs, not by any
particular technology. Each port is a plain TypeScript interface with
**zero imports from `obsidian` or `dexie`** — that is the entire point of
this directory.

See `docs/dev/tsdoc-conventions.md` for the doc-comment format (`@see`/
`@remarks`) used on the interfaces below.

## Why

`src/core` (the domain algorithms: boundary resolution, Content Sequence
traversal, scope resolution, Entity Property parsing, Alias/Compiler plan
computation) must never import `obsidian` or `dexie` at runtime. Ports are
the seam that makes that possible: core depends on a port interface, and an
adapter — living outside `src/core`/`src/ports` — implements that interface
against the real Obsidian API or Dexie schema.

## Current ports

| Port              | Wraps                                                    | Consumed by                                                                 |
| ----------------- | -------------------------------------------------------- | --------------------------------------------------------------------------- |
| `MetadataPort`    | `metadataCache`                                          | Layer 3 boundary resolution, Note Property reads                            |
| `FileContentPort` | `vault.read` / `vault.cachedRead`                        | Layer 1/2 Entity Property parsing                                           |
| `PersistencePort` | Dexie/IndexedDB schema                                   | Layer 3 traversal/resolution algorithms (paths, hierarchy, scope, mentions) |
| `VaultWritePort`  | `vault.modify` / `rename` / `delete` + pending-write set | Workers (Alias Application Engine, Compiler) execution step                 |
| `LoggerPort`      | vault-file writes for developer diagnostics              | Any layer, once instrumented — opt-in, silent by default (§B.16)            |

See `docs/spec/12-architecture.md` §12.9 for the full rationale and which
layers depend on which port.

## Current adapters

`src/adapters/` holds implementations, living outside `src/core`/`src/ports`
per the rule below. First one: `ObsidianLoggerAdapter` implements
`LoggerPort` (§B.16).

## Rules

- **No implementations here.** Adapters are a separate concern, built when
  Layers 1–4 are actually implemented (`LoggerPort`'s adapter is the first
  exception, since diagnostics needed no Layer to precede it).
- **No `obsidian` or `dexie` imports.** These interfaces exist so
  `src/core` never has to import either. Enforced by the
  `no-restricted-imports` rule in `eslint.config.mts` — see
  `src/core/README.md`#enforcement.
- Port shapes are expected to grow as the layers they serve are built —
  treat these as living contracts, not finished APIs.
