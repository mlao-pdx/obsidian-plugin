# Narrative

Narrative is the text that conveys the story to the reader/listener.

## Narrative MoC

The [Narradin](./narradin.md#narradin) settings allow configuration of one or more [MoCs](./narradin.md#map-of-content-moc) to designate a note as a narrative entity by setting the [entity file property](./narradin.md#entity-file-property) as a link to one of these MoCs.

The narrative MoCs the user defines are ordered, and the user can change that order. The first narrative MoC is deemed the root level for Narradin, using zero-based indexing which identifies a narrative MoC's level.

If the user wants multiple names for a single level, then they should add aliases to the MoC note. They can then describe how the name and alias(es) differ semantically in the body text of the note. ([Vault is truth](./principles.md#vault-is-truth))

There must always be at least one narrative MoC configured.

An example narrative MoC mapping:

| Index         | Name                | Alias      | Default |
| ------------- | ------------------- | ---------- | ------- |
| 0 (mandatory) | a story realm       | a world    | a realm |
| 1             | a series            | a season   |         |
| 2             | a book              | an episode |         |
| 3             | an act / a chapter  |            |         |
| 4             | a heading / a scene |            |         |

## Narrative note

A narrative note is a note that has the [entity file property](./narradin.md#entity-file-property) set to link to a [narrative MoC](#narrative-moc). These notes are the building blocks that tell your stories, your narrative.

## Narrative scope

A narrative [scope](./narradin.md#scope) are all the notes and subfolders that reside with the folder, identified by a [narrative note](#narrative-note) that is its [folder note](./narradin.md#folder-note).

## Narrative backbone

Together with the [entity file property](./narradin.md#entity-file-property), the narrative hierarchy is Narradin's backbone: the physical folder tree of narrative notes is what Narradin reads as narrative structure.

The hierarchy has no fixed chain of levels. Any [narrative MoC](#narrative-moc) may act as a folder-level [Scope Anchor](./narradin.md#scope-anchor) by being placed as a matching [folder note](./narradin.md#folder-note) — level-ness is positional, decided per-instance by placement, not a fixed property of the MoC. Only the root level (index 0) is mandatory; every other level, at whatever depth, in whatever combination, is entirely author-arranged. A vault may skip every intermediate level (e.g. a story realm directly containing a scene), or use a deep custom chain never described by the shipped defaults.

A narrative note that is not the governing folder note for its folder is always a leaf, whatever concept it carries and wherever it sits — a note's [entity file property](./narradin.md#entity-file-property) value never by itself creates a boundary; only matching name and placement together do ([Scope Anchor](./narradin.md#scope-anchor)).

## Narrative traversal

Within a folder, Narradin yields content in a fixed order:

1. The folder note first, if there is one — never sorted among its own children.
2. Every leaf note next, ordered by the configured `sort_index` property (missing defaults to `1`); ties resolve in [natural order](./narradin.md#natural-order) on the full file name.
3. Every subfolder last, ordered by the configured `folder_index` property (missing sorts last); ties resolve the same way.

All leaf notes in a folder are yielded before any subfolder is recursed into — there is no interleaving. A subfolder with no matching folder note (a transparent intermediate folder) is still ordered and recursed into exactly like any other subfolder; it just contributes no content of its own.

## Narrative Order

The Narrative Order of a [Narrative Traversal Scope](./narradin.md#narrative-traversal-scope) is its [narrative traversal](#narrative-traversal) sequence with each note immediately followed by its [Companion](./companion.md) notes, in configured companion type order. This is the single reader-facing reading sequence Narradin computes — used for compiling, every report and view, and resolving positional values like POV.

Narrative Order is distinct from [Natural Order](./narradin.md#natural-order): Natural Order is the string tie-break primitive used when two notes share the same index value; Narrative Order is the resulting narrative reading sequence built from folder structure, indices, and Companions together. Narrative Order is never described as chronological — it reflects the order notes and Companions appear in the narrative, not when events in the story happen.
