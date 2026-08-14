# Companion

Companions are a different kind of notes in [Narradin](./narradin.md#narradin). They are support notes for the three main entity types [Narrative](./narrative.md), [Player](./player.md), and [Plot](./plot.md). Their content tends to be things like scene beats, research, a settings map, planning, and so on.

## Companion MoC

The [Narradin](./narradin.md#narradin) settings allow configuration of zero or more [MoCs](./narradin.md#map-of-content-moc) to designate a note as a companion entity by setting the [entity file property](./narradin.md#entity-file-property) as a link to one of these MoCs.

The companion MoCs the user defines have no inherent order and as such are rendered on the settings in [natural order](./narradin.md#natural-order).

If the user wants multiple names for a single companion MoC, then they should add aliases to the companion MoC note. They can then describe how the name and alias(es) differ semantically in the body text of the note. ([Vault is truth](./principles.md#vault-is-truth))

All companion MoCs must have a non-empty suffix defined. The suffix may not contain any underscores and must consist of valid file name characters.

Using companions within Narradin is optional.

An example companion MoC mapping:

| Name          | Alias 1              | Suffix    |
| ------------- | -------------------- | --------- |
| a beat sheet  |                      | beat      |
| some research | some world building  | research  |
| a backstory   |                      | backstory |
| an review     | a developmental edit | review    |

## Companion suffix

Companion notes do not exist on their own. They are always tied to a [Narrative](./narrative.md), [Player](./player.md), or [Plot](./plot.md) note. As such a companion note has the same base name as its [anchor note](./narradin.md#anchor-note) followed by a double underscore (`__`) and its suffix as defined in the settings. E.g. `scene__beat.md` for a beat sheet.

## Companion contract

Every Companion note is bound to its [anchor note](./narradin.md#anchor-note) by a `for` property — a link to the anchor note. This link, not the filename, is the authoritative binding; the filename convention ([Companion suffix](#companion-suffix)) is a creation convenience and a visual grouping aid only.

## Rename sync

Renaming an anchor note causes Obsidian to natively update the `for` link in every one of its Companions. Narradin observes that change and renames each Companion file to restore the filename convention. A rename that would collide with an existing file is aborted, with a notice — the `for` link stays correct regardless.

## Ordering

A Companion attached to a [Narrative](./narrative.md) note has no independent position of its own: it is processed in the [Narrative Order](./narrative.md#narrative-order) of its anchor note, and among the other Companions of that same anchor in configured companion type order.

A Companion attached directly to a [Player](./player.md) or [Plot](./plot.md) note has no Narrative Order position at all — its anchor note has none either, since Player and Plot notes have no position of their own in the narrative spine. Companions of this kind are still discoverable and compilable; they simply never appear as part of any reading sequence.

## Non-Markdown companions

Files that cannot carry frontmatter (e.g. images, canvases, PDFs) are recognised as Companions by their filename instead of by the entity file property and `for`:

- The segment after the separator is matched against the configured companion suffixes to determine its type — `Scene 1__map.png` is a `map` companion.
- The segment before the separator is resolved as the anchor note, first against notes in the same folder, then via Obsidian's normal link resolution.
- An anchor that can't be resolved this way is logged, never guessed.

## Generated Companions

A Generated Companion is Compiler output — it still carries `for`, still participates in rename sync, and still follows the `__` filename convention. Whether a file is a Generated Companion is decided entirely by its [entity file property](./narradin.md#entity-file-property) value being a configured Generated Companion concept; nothing else marks it. A Generated Companion is excluded from indexing, from compiling as input, and from receiving Alias Manager rewrites, and it may be silently overwritten by a later compile of the same type.

## Companion type changes

Changing a Companion's [entity file property](./narradin.md#entity-file-property) to a different Companion concept renames the file to the new type's suffix, the same way a host rename does ([Rename sync](#rename-sync)). If the new value is instead a tracked entity concept (a [Player](./player.md) or [Plot](./plot.md) concept the Alias Manager tracks), Narradin narrows the double underscore to a single one, removes `for`, and the file becomes a newly created entity note in its own right rather than a Companion. If the new value is any other, non-Companion concept, no rename occurs — the `__` fragment becomes a harmless remnant and `for` is ignored.
