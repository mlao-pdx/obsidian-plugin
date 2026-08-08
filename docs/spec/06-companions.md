# Part 6: Companions

## Part 6: Companions

**Goal:** separate the working document — beat sheet, action items, dashboards,
setup/payoff reports — from the prose, so the chaos of planning never lands in the
manuscript.

A Narrative note (`Scene 12.md`) is a _dashboard_. The prose lives in
`Scene 12__prose.md`. Others might be `__beats`, `__research`, `__goals`,
`__blocking.excalidraw`.

### 6.1 Contract

- **`is`** — a Companion concept (`is: [[Prose]]`). Mandatory; without it the file is
  invisible.
- **`for`** — a wikilink to the host Narrative note (`for: [[Scene 12]]`). Mandatory.
  The authoritative binding.
- **Filename** — `HostBasename__Suffix.md`. A creation convenience and visual grouping
  aid, **not** the binding.

### 6.2 Rename Sync

Renaming a host causes Obsidian to natively rewrite `for` in every Companion. Narradin
observes that, reads the updated `for`, and renames the Companion file to restore the
convention. Collisions abort with a notice. `for` remains correct regardless.

### 6.3 Ordering

Companions are processed **in the narrative order of their host**, and among themselves
in **configured companion type order**. They have no independent position. See §7.5.

### 6.4 Non-Markdown Companions

Files that cannot carry frontmatter (`.png`, `.canvas`, `.pdf`) fall back to the filename
convention:

- **Type** — the segment after the separator, matched against configured suffixes.
  `Scene 1__map.png` → type `map`.
- **Host** — the segment before, resolved first against notes in the same folder, then
  via Obsidian's standard link resolution.
- Ambiguous or unresolvable hosts are logged, never guessed.

`Scene 1__blocking.excalidraw.md` _is_ markdown and uses the normal `is` + `for`
contract.

### 6.5 Generated Companions

Compiler output is a Companion — it inherits `for` linkage, rename sync, and `__`
grouping.

**`is` is the sole authority.** A file is a Generated Companion if and only if its `is`
is a configured Generated type. Every consequence follows from that one property:
exclusion from Entity Property indexing, from the Mention Index, from the alias target
set, from use as compile input, and eligibility for silent overwrite.

**`narradin__generated` is provenance, not a gate.** It records the source note's Local
Scope, compile timestamp, and requested types. It is written on every compile, read by
reports and by a future recompile command, and is authoritative for nothing. Treating it
as a precondition would create a second source of truth alongside `is`.

Without these exclusions, every `{...}` property in a compiled manuscript is counted
twice and a later alias rename silently mutates the export while its sources drift.

### 6.6 Companion Type Changes

Rename sync fires on a Companion's **type change**, not only on host rename.

When a Companion's `is` changes to a different Companion concept, Narradin renames the
file to the new type's suffix — `Book A__manuscript.md` → `Book A__feedback.md` — via
`fileManager.renameFile`, so Obsidian updates every link natively.

- The rename registers its `old → new` pair in the pending-write set (§12.1). Renames are
  the one loop-forming path and are never exempt.
- Collisions abort with a notice, per Graceful Degradation. `for` remains correct.
- If the type changes **away from** a Generated type, `narradin__generated` is stripped:
  the stamp is no longer true, and the namespace is Narradin's to keep honest.
- If the new `is` is a **tracked entity concept** (a Player or Plot `is`
  configured as a Source Note, §10.1): Narradin makes the minimal change
  `HostBasename__Suffix.md` → `HostBasename_Suffix.md` — double underscore
  to single. Nothing else about the filename changes; Narradin does not
  infer or assume an intended standalone name. The `for` property is
  removed. The file is now a newly-created Source Note (§10.2 "Newly
  promoted Source Notes" — no prior `fka` history, current basename and
  aliases become the anchor). This also has the side effect of making the
  file visible if the author's file explorer hides `__*.md`.
- If the new `is` is any other non-Companion concept (not a tracked entity,
  not a Companion concept), no rename occurs. The `__` suffix becomes a
  meaningless but harmless filename fragment and `for` is ignored.

This is also the supported route for repurposing generated output (§8.3): reclassify, and
the next compile proceeds with no prompt.

---
