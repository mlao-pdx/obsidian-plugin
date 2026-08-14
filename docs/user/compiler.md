# Compiler

The Compiler walks the [Narrative Order](./narrative.md#narrative-order) within a scope and writes designated content out as plain text.

## Trigger

A compile command runs from a note carrying a `compile` property — an array of concept links naming which entity types to emit (a Companion concept for a manuscript, or a Player/Plot concept for a cast list). That note's own resolved [scope](./narradin.md#scope) anchors both the [Compile Scope](#compile-scope) and the eligibility test used for [Player and Plot compilation](#player-and-plot-compilation). Running the command from a Book folder note compiles that Book; running it from a Series folder note compiles the Series. A Compile Scope can legitimately reach into a nested [Scope Anchor](./narradin.md#scope-anchor) whenever the anchor's own subtree contains one — nesting never excludes anything from it.

Before compiling, Narradin shows a confirmation naming the resolved scope and an estimated word count; if that scope reaches into one or more nested root-level anchors, each one and its rough size are named too. This is informational, never a gate.

## Compile Scope

For a given compile and the entity type currently being processed from its `compile` array: every entity in the anchor note's [Narrative Traversal Scope](./narradin.md#narrative-traversal-scope) — and their Companions — whose entity file property matches that type. This covers both narrative-category compile targets (a Scene concept) and Companion-category compile targets (a Prose concept) uniformly, and it also covers a [Player](./player.md) or [Plot](./plot.md) note's own directly attached Companion (see [Player and Plot compilation](#player-and-plot-compilation), below), not only Companions of narrative notes.

## Output

Compile output is always a [Generated Companion](./companion.md#generated-companions): hard, plain text, never an embed, never a codeblock, never inserted at the cursor. It's written in the background, with a notice and a click-to-open action once it's done.

Within one host, the host itself is emitted first if it matches, then its Companions in `compile`-array order; across hosts, Narrative Order governs. Companions that can't carry frontmatter are transcluded — there is no alternative for them. Every compile is logged, naming its target, resolved scope, and types.

Every Companion the Compiler creates is automatically stamped with [`do_not_rename`](./inline-properties.md#donotrename) at creation — generated content is derivative and rebuilds itself on the next compile, so freezing it against Alias Manager rewrites by default is safe. This must not be confused with a new, empty Companion the author creates themselves to fill in by hand — that path never receives this auto-stamp, only content the Compiler itself writes does. Every Generated Companion is also stamped with a companion System Key flagging it as excluded from indexing, purely as a discoverability aid — the entity file property remains the sole authority for Generated Companion status; the stamp changes no exclusion logic.

Compiling into a target that already declares itself a Generated Companion of the same type overwrites it silently — its prior contents are irrelevant. Compiling into a Companion of a different type never collides, because that Companion was already renamed to its own type's suffix. Compiling into anything else — a non-Companion note, or a note with no entity file property at all — aborts with a notice naming the file, rather than destroying a note that never declared itself generated.

## Player and Plot compilation

[Player](./player.md) and [Plot](./plot.md) notes have a resolved scope but no position in the [Narrative Order](./narrative.md#narrative-order), so they are never emitted inline. A Player/Plot compile is attached by the author in one of two ways, both producing the same [Compile Scope](#compile-scope):

- the `compile` property sits on a Companion of a folder-level narrative note (the cast-list case) — that narrative note's scope anchors the operation; or
- the `compile` property sits directly on a Companion attached to the Player or Plot note itself.

Either way, membership in the result is two-axis — resolved scope alone describes where an entity _may_ range, not where it actually appears:

1. **Eligibility.** The entity's own resolved scope must be an ancestor of, equal to, or a descendant of the compiling note's own resolved scope. A sibling Book's bit players are excluded.
2. **Inclusion.** At least one resolved mention of the entity within the compiling note's [Narrative Traversal Scope](./narradin.md#narrative-traversal-scope).

An entity that's eligible but never actually included is still worth surfacing: by default, a compiled cast list ends with a trailing section listing every eligible-but-absent entity — the single most useful signal that an entity was created and never used.

## Codeblock evaluation during compile

Codeblocks that render a live view (cast lists, progressions, and the like) are evaluated during compilation, so a cast list placed on a Book Companion simply appears in the compiled manuscript as plain text. A codeblock whose own resolved scope contains its own host is detected and reported rather than evaluated — Narradin never recurses into itself. Compile output is always plain text, so any icon such a view would normally show degrades to its registered label.
