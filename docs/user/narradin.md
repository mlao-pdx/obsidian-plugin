This documentation describes the behaviors expected from the plugin in a declarative form. Start with [Narradin](#narradin) and work your way through all defined terms, ideally following the links.

Terms like vault, folder, note, tag, alias, are all used as Obsidian uses them unless defined explicitly.

# Anchor note

A [Narrative](./narrative.md), [Player](./player.md), or [Plot](./plot.md) note that has one or more [Companion](./companion.md) notes.

# Element insertion

An Insert Element command creates a new note for a chosen concept in the current location. If the author has set up a template for that concept, Narradin uses it; otherwise it generates a minimal, bare-bones template via [Templater](./third-party-plugins.md#templater) for the author to grow. Every note created this way carries the correct [entity file property](#entity-file-property) value and an icon property, so folders stay visually legible at a glance. [Companion](./companion.md) notes are offered when creating an entity note, never forced — no companion type is mandatory.

# Entity file property

The entity file property of a note is the property whose value links to a valid Narradin [Map of content (MoC)](#map-of-content-moc). The file property's name is configured in Narradin's settings, with a default value of `is`.

# Folder note

A note is a folder note if its base name (fully qualified file name less path less extension) matches the configured folder note name pattern. The folder note name pattern is set in the Narradin settings.

It takes the form of any literal text that is a valid base name for a file, where every occurrence of `{{folder}}` is replaced by the note's parent folder's base name. E.g. for a pattern `_{{folder}}_index` the note `test/_test_index.md` would be a folder note, but `test/test.md` would not.

The default folder note name pattern is `{{folder}}`, i.e. a note with the same name as the folder.

The user is responsible to keep this Narradin configuration in sync with the folder note configuration of [NN](./third-party-plugins.md#notebook-navigator-nn) to ensure proper integration between the two plugins.

## Naming synchronisation

This synchronisation only applies when the folder note name pattern contains a `{{folder}}` placeholder — the default. Under a placeholder-free pattern (e.g. a fixed name), a folder note's name never depends on its folder's name at all, and there is nothing to keep in sync.

Under a `{{folder}}`-containing pattern, Narradin keeps a folder note's name and its folder's name in sync automatically, triggered by note and folder renames:

| Trigger                                                                                           | Behaviour                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Folder note renamed, names previously matched                                                     | Rename the folder to match.                                                                                                                                     |
| Folder renamed                                                                                    | Rename the folder note to match.                                                                                                                                |
| A note becomes a [narrative note](./narrative.md#narrative-note), name already matches its folder | No action needed.                                                                                                                                               |
| A note becomes a narrative note, name does not match its folder                                   | Narradin asks whether to rename the folder to match the note, rename the note to match the folder, or leave both as they are.                                   |
| Either rename would collide                                                                       | Narradin aborts the rename and reports that the folder could not be kept in sync; Narradin continues to work, but results involving that folder might look odd. |
| The folder note is in the vault root                                                              | Narradin never renames the vault's root folder; the rename is silently skipped.                                                                                 |

Because a folder only qualifies as a [Scope Anchor](#scope-anchor) when its folder note's name matches — not merely by carrying a valid [entity file property](#entity-file-property) value — a drifted name under a `{{folder}}`-containing pattern is not cosmetic. It costs the folder its Scope Anchor status outright, truncating [scope](#scope) inheritance for every note beneath it that relied on it.

## Order advisories

Narradin lets the user capture an expected ordering of narrative levels, purely for reference. When Narradin encounters folder notes in an order that doesn't match this expectation, it surfaces a quiet, informational alert — it never discards a candidate, never excludes a subtree from traversal, compilation, mentions, or reports, and never blocks any operation. Ordering mismatches are observations, not enforcement ([Judge, but don't sentence](./principles.md#judge-but-dont-sentence)).

## Self-containment

A folder governed by a folder note must be movable anywhere in the vault without breaking. Narradin never persists a note's absolute path as its identity, and never requires a file outside that folder for the folder to function.

# Map of content (MoC)

Map of contents are a generic term in the Obsidian world. [Narradin](#narradin) classifies its notes with a link to an MoC as the value of its [entity file property](#entity-file-property).

# Narradin

Narradin is an Obsidian plugin that helps manage long-form writing like a Zettelkasten by indexing all notes, and their contents, within the [Narradin scope](#narradin-scope), so that it can perform its operations.

## Narradin scope

Narradin scope are all notes that have a valid [Entity file property](#entity-file-property) value. There are several entity types that together form the Narradin scope.

| Entity type                               | Description                                                            |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| [Narrative](./narrative.md#narrative-moc) | These notes are the building blocks of your stories, your narrative.   |
| [Player](./player.md#player-moc)          | These notes are the components that propel your stories.               |
| [Plot](./plot.md#plot-moc)                | These notes are the threads that weave throughout your stories.        |
| [Companion](./companion.md#companion-moc) | These notes are supplements tied to a Narrative, Player, or Plot note. |
| [System](./system.md#system-moc)          | These notes store information that must survive if Narradin goes away. |

## Narradin index

Narradin keeps an index of every note within its [Narradin scope](#narradin-scope). This index only ever reflects vault content Narradin has actually observed through a real Obsidian vault event — a note or folder being created, modified, deleted, or renamed. It never infers, backfills, or invents an index entry: if Narradin has started a change but not yet received the vault's own confirmation that the change happened, the index does not yet reflect it. ([Vault is truth](./principles.md#vault-is-truth))

# Natural Order

## Purpose and Scope

This specification defines a **strict weak order** for Unicode text strings that matches Apple HFS+ file system collation, except that embedded decimal digit sequences are compared by integer value. Input strings are Unicode, normalized before comparison. **Only ASCII decimal digits** (`U+0030`–`U+0039`) are treated as numeric. The sort is **stable**: strings equal under all passes retain their original relative order.

## Tokenization

Each string is split into a maximal alternating sequence of **text tokens** (any characters containing no ASCII digit) and **numeric tokens** (maximal runs of ASCII digits), beginning with whichever type the string starts with.

| Input         | Tokens                              |
| ------------- | ----------------------------------- |
| `"file10abc"` | `"file"`, `10`, `"abc"`             |
| `"v1.2.10"`   | `"v"`, `1`, `"."`, `2`, `"."`, `10` |
| `"007"`       | `7` (one numeric token)             |
| `"42songs"`   | `42`, `"songs"`                     |

## Comparison

Tokens are compared left to right. The comparison proceeds through the following passes in strict priority order, advancing only when the current pass yields equality.

| Priority | Condition                    | Rule                                                                                                                                   |
| -------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1        | Token type mismatch          | Numeric token sorts before text token                                                                                                  |
| 2        | Both tokens numeric          | Compare by integer value; on tie, fewer leading zeros sorts first                                                                      |
| 3        | Both tokens text (primary)   | Locale-sensitive, case-insensitive, diacritic-insensitive (`kCFCompareLocalized \| kCFCompareCaseInsensitive \| kCFCompareNonliteral`) |
| 4        | Both tokens text (secondary) | Same as above but case- and diacritic-sensitive — distinguishes characters equal under pass 3                                          |
| 5        | All token pairs equal        | Fewer tokens sorts first                                                                                                               |
| 6        | All else equal               | Preserve original order (stability)                                                                                                    |

## Edge Cases

- **Leading zeros:** `"007"` and `"7"` share integer value 7; `"7"` sorts first (fewer leading zeros).
- **Version strings:** `"v1.2.9"` < `"v1.2.10"` because numeric token 9 < 10.
- **Empty string:** Treated as a single empty text token; sorts before any non-empty string.
- **Case/diacritic ties:** `"file"` vs `"File"`, and `"resume"` vs `"résumé"`, are equal at pass 3 and resolved at pass 4 per locale collation rules.

## Out of Scope

Characters that are not ASCII decimal digits — including non-ASCII digit forms (e.g., ٣ U+0663), negative signs, and decimal points — are not interpreted as numeric. Their Unicode code point values determine tokenization only: specifically, whether a character belongs to a text token or a numeric token. Once tokenized, all text token content is ordered by locale-sensitive collation weights (passes 3 and 4), not by raw code point order. Bidirectional text reordering is not applied; logical character order is used throughout.

# Scope

A scope in [Narradin](#narradin) is a subset of notes that reside within the vault.

## Scope Anchor

A folder is a Scope Anchor when it directly contains a [Folder note](#folder-note) that is also a [narrative note](./narrative.md#narrative-note). Both conditions are required: carrying a valid [entity file property](#entity-file-property) value alone is not enough — the note's base name must also match the configured folder note name pattern (see [Folder note](#folder-note)). A folder with no such note — a transparent intermediate folder — is never a Scope Anchor; Narradin passes straight through it when resolving scope.

A Scope Anchor represents its folder to the folder's parent for the purposes of scope resolution.

## Containment and inheritance

A Scope Anchor's scope is its entire subtree — every note and subfolder beneath it, including any nested Scope Anchor, at any depth. Nothing beneath a Scope Anchor is excluded from its scope by nesting alone.

A [Player](./player.md) or [Plot](./plot.md) note's scope is resolved by walking up from its folder to the nearest enclosing Scope Anchor; any folder without a qualifying folder note is transparent to this walk and is passed straight through. The walk halts unconditionally once it reaches a Scope Anchor at the root level (index 0) of the [narrative MoC](./narrative.md#narrative-moc) ordering — it never continues past a root-level Scope Anchor to see whatever contains it, or a sibling. A note whose walk never reaches a root-level Scope Anchor has no scope and is invisible to Narradin (see [Orphan](#orphan), below).

A note's scope changes whenever the note moves, or whenever a Scope Anchor appears or disappears above it — even without the note itself moving.

## Membrane Rule

A Scope Anchor nested inside another root-level Scope Anchor — one root-level narrative note nested inside another — is included in the outer one's scope, for reporting and compiling alike, at any nesting depth. Nesting a root-level Scope Anchor inside another is unconditionally legal and never excludes it from the outer one's scope. But an operation anchored inside the nested Scope Anchor can never see or reach past it, out to whatever contains it: the outer world looks in, the inner world never looks out.

## Orphan

A note whose upward walk never reaches a root-level Scope Anchor has no scope, and is invisible to Narradin. This is distinct from Narradin ignoring a note outright: an orphaned note is still classified by its [entity file property](#entity-file-property), it simply resolves to no scope.

## Narrative Traversal Scope

For a given Scope Anchor: every [narrative note](./narrative.md#narrative-note) within that anchor's scope, except any that are themselves [Orphan](#orphan). This is the set Narradin walks when it needs "everything narrative under here" — for example, when computing the reading order of everything beneath a given anchor.
