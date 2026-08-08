# Part 2: Configuration Model

## Part 2: Configuration Model

### 2.1 Ontology

- Type-marker property key. Default `is`.
- Per-category lists of concept links, grouped: **Narrative**, **Companion**,
  **Player**, **Plot**, **System**.
- Shipped defaults:
  - Narrative — Realm, Series, Book, Header, Scene
  - Companion — Prose (default suffix `__prose`)
  - Player — Character, Object, Lore, Location, Other
  - Plot — Plot, Thread, Theme, Arc
  - System — Outtake, POV, Settings

### 2.2 Hierarchy

- Ordered list of Narrative levels. Default `Realm → Series → Book → Header → Scene`.
- Count of levels, from the top, that are **Folder Levels**. The remainder are Leaf
  Levels. Settings enforce that this is a contiguous prefix: top-most is always Folder,
  bottom-most always Leaf.

### 2.3 Other Settings

**Indexing** — `sort_index` property name (must match Notebook Navigator's configured
property); `folder_index` property name.

**Companions** — suffix separator (default `__`); per-type suffixes; **companion type
order**. No companion type is mandatory; `__prose` ships as a default, nothing more.
Both the `is` value and the suffix are user-changeable, for i18n among other reasons.

> ⚠️ **Companion type order is semantically load-bearing.** It governs both compilation
> order (Part 8) and positional value resolution (§16.4). Reordering it changes which
> POV governs a companion that carries no declaration of its own. The settings UI must
> say so.

**Generated Companions** — the set of generated types. Default: one, `manuscript`,
suffix `__manuscript`.

**Context Vocabulary** — per Realm. Each entry: normalised context, display label, Icon
Registry key, and `role: opens | closes | none` (§9.6).

**Reserved Keys** — never interpreted as an Entity Property subject (§9.0). Configurable,
so an author whose character is genuinely named "Tags" can reclaim it.

**Alias Manager** — Source Note `is` values, selectable **only from already-configured
`is` values**, defaulting to all Player and Plot concepts. Master on/off toggle, **off by
default**. Owning device id. Conflict/report log location. Plain-text evidence toggle for
the Mention Index. There is no per-run tuning.

**Advisory thresholds** — POV segments per note before the Rashomon report fires
(default 3). Compile word count before confirmation.

**Icon Registry** — per-Realm overrides of shipped semantic-key bindings (§16.7).

**System** — `_narradin` folder path. Default `_narradin` at vault root, **visible**.
Hide it via Notebook Navigator's folder exclusion; it must remain a real,
Obsidian-indexed folder (§2.4).

### 2.4 Concept Renames (Settings Migration)

Concept `is` values are wikilinks _specifically_ so renaming a concept can be delegated
to Obsidian. Changing `[[A Story Realm]]` to `[[Universe]]`:

1. Resolve `A Story Realm`. If no note exists anywhere, create
   `_narradin/A Story Realm.md`.
2. Call Obsidian's rename API: `A Story Realm.md` → `Universe.md`.
3. Obsidian's native link updater cascades into every `is` property vault-wide,
   including path-qualified forms.

Consequences to honour:

- Because the target lives in `_narradin`, a pre-existing user note named `Universe`
  causes no collision — Obsidian disambiguates by path.
- Therefore **all `is` reading resolves links through the metadata cache**, tolerating
  path prefixes (`[[_narradin/A Story Realm]]`) and aliases. Never string-match the raw
  value.
- `_narradin` must be a normal indexed folder or the whole mechanism fails.

### 2.5 Configuration Change Impact

Any change to ontology or hierarchy can have sweeping consequences. Before committing,
Narradin presents a modal quantifying the blast radius: _"123 notes will be
reinterpreted. 345 notes will no longer be visible to Narradin. Continue?"_

Narradin never deletes notes as a result. Prior settings are snapshotted to
`_narradin/settings-history/` so a reversal doesn't depend on the author's memory.

---
