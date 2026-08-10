# Tooling references

Curated external doc links actually consulted while scoping the adapter
layer, plus the deferred list. Not an index of everything used in this
project — see `AGENTS.md` and per-skill files (`.kilo/skill/*/SKILL.md`) for
day-to-day patterns. This file exists so a future session doesn't re-fetch or
re-decide scope from scratch.

## Consulted (in scope)

| URL                                                                                                                                                                           | Why it matters here                                                                                                                                                                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `https://docs.obsidian.md/Plugins/Vault`                                                                                                                                      | `vault.modify`/`process`/`delete`/`trash` — backs `VaultWritePort`'s adapter (`src/ports/vault-write-port.ts`).                                                                                                                                                                                                             |
| `https://docs.obsidian.md/Reference/TypeScript+API/FileManager/processFrontMatter`                                                                                            | The mandatory frontmatter-write path (project constraint `frontmatter_write_api_only`); no separate "guide" page exists beyond this API reference entry.                                                                                                                                                                    |
| `https://docs.obsidian.md/Plugins/Events`                                                                                                                                     | `registerEvent`/`metadataCache.on`/`vault.on` — backs `MetadataPort` (`src/ports/metadata-port.ts`) and `VaultWritePort` event wiring.                                                                                                                                                                                      |
| `https://docs.obsidian.md/plugins/guides/load-time`                                                                                                                           | `onLayoutReady`, the `vault.on('create')` cold-start pitfall, production-build guidance — ties to AGENTS.md's "keep onload light" rule.                                                                                                                                                                                     |
| `https://docs.obsidian.md/plugins/guides/lifecycle-management`                                                                                                                | `Component` hierarchy, `register*` helpers, resource cleanup — backs "register listeners safely" in `obsidian-plugin-patterns/SKILL.md`.                                                                                                                                                                                    |
| `https://dexie.org/llms.txt`                                                                                                                                                  | Primary Dexie index/summary; schema declaration, transactions, TypeScript typing conventions used in `dexie-persistence-adapter/SKILL.md`.                                                                                                                                                                                  |
| `https://dexie.org/docs/Dexie/Dexie.version()`                                                                                                                                | Schema versioning/migration (`upgrade()`) detail beyond the `llms.txt` summary.                                                                                                                                                                                                                                             |
| `https://dexie.org/docs/Dexie/Dexie.transaction()`                                                                                                                            | Atomic multi-table transaction scope/pitfalls (auto-commit, zone loss) for Appendix B §B.7/B.14 D1's "resolve then commit atomically" requirement.                                                                                                                                                                          |
| `https://unpkg.com/dexie@4.4.4/dist/dexie.d.ts`                                                                                                                               | Type reference (link only, not embedded) — matches `package.json`'s pinned `dexie@^4.4.4`.                                                                                                                                                                                                                                  |
| Notebook Navigator `README.md`, `FAQ.md`, `docs/storage-architecture.md`, `docs/metadata-pipeline.md`, `docs/api-reference.md` (github.com/johansan/notebook-navigator, main) | Cross-check for the `sort_index` compatibility contract in `docs/spec/07-hierarchy-and-narrative-order.md` — see **Open finding** below; do not re-derive the contract itself from these, the spec is the source of truth.                                                                                                  |
| `https://docs.obsidian.md/plugins/releasing/plugin-guidelines`                                                                                                                | Actual review-comment checklist (why, not just what) — backs "Plugin review guidelines" in `obsidian-plugin-patterns/SKILL.md`.                                                                                                                                                                                             |
| `https://docs.obsidian.md/plugins/guides/secret-storage`                                                                                                                      | `SecretStorage`/`SecretComponent` — backs "Store secrets" in `obsidian-plugin-patterns/SKILL.md`; corrects the placeholder `apiKey: string` pattern in the file-structure example.                                                                                                                                          |
| `https://docs.obsidian.md/Plugins/User+interface/Settings`                                                                                                                    | Full declarative `getSettingDefinitions()` API (Obsidian 1.13+, matches this project's `minAppVersion`) — backs "Settings tab" in `obsidian-plugin-patterns/SKILL.md`. Supersedes the old imperative `display()` pattern.                                                                                                   |
| `https://docs.obsidian.md/plugins/guides/migrate-declarative-settings`                                                                                                        | Migration path from imperative `display()`; used alongside `Settings.md` above.                                                                                                                                                                                                                                             |
| `https://unpkg.com/obsidian@latest/obsidian.d.ts` (`ConfirmationModal`, `ConfirmationButton`, `ButtonComponent.setDestructive`)                                               | Obsidian 1.13.0's new destructive-action confirmation pattern (supersedes `setWarning()`) — backs "Confirming destructive actions" in `obsidian-plugin-patterns/SKILL.md`. Not yet documented on docs.obsidian.md's own Modals guide as of this check; sourced from the type declarations and the 1.13.0 changelog instead. |
| `https://obsidian.md/changelog/` (1.13.0 desktop entry)                                                                                                                       | Confirmed `ConfirmationModal` and the revamped Settings panel/API both shipped in 1.13.0 — the version this project already pins as `minAppVersion`.                                                                                                                                                                        |

**Explicitly not consulted, by decision:** `Plugins/Getting+started/Mobile+development` and any mobile-platform guidance. Narradin is desktop-only (`manifest.json` `isDesktopOnly: true`) and mobile is out of scope for the foreseeable future — the Git-backed feature set alone rules it out. Do not fetch or add mobile-development docs unless that project decision changes.

## Open finding — possible spec drift (not resolved)

Notebook Navigator's own current documentation (as of its most recent
revision, checked 2026-08-10) does not mention a `sort_index` frontmatter
property anywhere: `docs/storage-architecture.md` and `docs/metadata-pipeline.md`
describe manual/custom sort as a per-folder **sort-mode override**
(`folderSortOverrides`) stored in NN's own settings/local-storage, not a
frontmatter key written to individual notes. `docs/spec/02-configuration-model.md`
§2.3, `docs/spec/04-structural-boundaries.md` §4.3, and
`docs/spec/07-hierarchy-and-narrative-order.md` §7.3 all describe NN writing
`sort_index` to file frontmatter during drag-and-drop (interpolating,
renumbering into the ~1000 range, treating `0` as null).

This is flagged, not fixed: it may describe an older NN version's behavior,
or a feature that still exists but isn't documented in these particular
pages. **Confirm against a live Notebook Navigator install before treating
`07-hierarchy-and-narrative-order.md`'s exact `sort_index` mechanics as
current** — resolving this either way is a spec decision, out of scope for
this docs-collection pass.

## Deferred — do not fetch yet

| Item                                                      | Trigger to revisit                                                                                                      |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| d3.js                                                     | Never — confirmed false positive (IBIS decision-record `D3([...])` node IDs, not the library). Not tracked for revisit. |
| Linter (community plugin)                                 | When a spec section defines an integration contract for it (none exists in `docs/spec/` today).                         |
| Note Toolbar                                              | Same — no spec mention yet.                                                                                             |
| Style Settings                                            | Same — no spec mention yet.                                                                                             |
| OmniSearch                                                | Same — no spec mention yet.                                                                                             |
| Lucide icon-picker UI                                     | When `docs/spec/14-deferred.md`'s "Icon Registry picker UI" item moves out of deferred.                                 |
| Obsidian Views / Editor-extension / pop-out-window guides | When `docs/spec/16-views.md` moves views out of deferred.                                                               |

No skill/doc work is planned for Vitest, fast-check, ESLint, Prettier, Husky,
or esbuild — already fully configured (`vitest.config.ts`,
`vitest.properties.config.ts`, `eslint.config.mts`,
`scripts/promote-fast-check.mjs`, `docs/dev/fast-check-log.md`). Revisit only
if a concrete testing-pattern gap surfaces once real test files exist.
