# `src/core/`

Domain logic with **zero runtime imports from `obsidian` or `dexie`**.
Everything here depends only on interfaces in `src/ports/` (via the
`@ports/*` alias), never on the Obsidian API or a specific persistence
technology directly.

## What belongs here

- **Layer 2 (Event Transformer)** — translating file events into semantic
  Narradin events (`EntityCreated`, `EntityDeleted`, `EntityRenamed`,
  `EntityUpdated`); §12.2.
- **The domain half of Layer 3** — the algorithms, not the Dexie schema:
  boundary resolution top-down from each Realm root (§4.2), Content
  Sequence traversal (§7.5), and scope-map resolution. These consume
  `PersistencePort` and `MetadataPort`; the Dexie schema itself is an
  adapter, not core.
- **Layer 4 Providers' domain logic** — the derivation/projection logic
  (e.g. Mention Index matching, §12.5), not the Obsidian-facing plumbing
  around it.
- **Workers' plan computation** — what the Alias Application Engine or
  Compiler should rewrite/compile to. The _execution_ of that plan (via
  `VaultWritePort`) is adapter-side orchestration, not core (§12.7).

## What does not belong here

- Anything that touches `metadataCache`, `vault`, or Dexie directly — that
  is adapter code, living outside `src/core`/`src/ports`.
- UI/Consumer code (CodeMirror view plugins, sidebars, modals) — those are
  Layer 5 Consumers, not domain logic.

## Enforcement

`eslint.config.mts` enforces this boundary via a `no-restricted-imports`
override on `src/core/**` and `src/ports/**`. A runtime import of `obsidian`
or `dexie` (or their subpaths) fails `npm run lint` / CI — never suppress
this rule with `eslint-disable`.

See `docs/spec/12-architecture.md` §12.9 and `src/ports/README.md` for the
full port/adapter boundary rationale.
