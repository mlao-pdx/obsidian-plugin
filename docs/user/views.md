# Views

Every view is a query over [inline properties](./inline-properties.md) and mentions of an entity, ordered by [Position](./inline-properties.md#position), bounded by [scope](./narradin.md#scope). None of them is a separate subsystem — they're all different questions asked of the same underlying records.

## Progressions

The unfiltered, narrative-order view of one entity's [Entity Properties](./inline-properties.md#entity-property).

- **Subject.** The codeblock's explicit target, or else the hosting note's own entity, or else — if the host is a Companion — its anchor note.
- **Reach.** Rows are drawn only from within the hosting note's [Narrative Traversal Scope](./narradin.md#narrative-traversal-scope), and only if the subject's own resolved scope is an ancestor of, equal to, or a descendant of the hosting note's scope. A block on a Book folder note targeting a Series-scoped character shows that Book's rows, not the whole Series'.
- **Ordering.** Sorted by Position — narrative order, never chronological ([Narrative Order](./narrative.md#narrative-order) is never described as when events happen in the story).

Rows show all three inline-property modifiers, distinguished by icon and filterable in the view: the default modifier is written prose, an [Author Note](./inline-properties.md#author-note) is planned but exists only as a note, and an [Internal Reference](./inline-properties.md#internal-reference) marks internal or removed content. A report showing only written rows would tell an author their arc is complete when half of it is still notes.

Where two entities share a name, a row that could belong to either carries a visible duplicate warning rather than silently picking one.

## Setups & Payoffs

The same records as Progressions, paired by role instead of listed individually. A thread is a subject entity — there is no separate pointer or thread identity, the entity itself is what a setup and its payoff share.

Two records pair when they share the same subject entity, one carries an opening context and the other a closing context, and their **Discriminators** — every non-role context on each side — agree: empty matches anything (a wildcard), and where both sides carry discriminators, they must intersect. A record naming a role context and a non-role context can be dual-role, opening one thread and closing another. A Discriminator is a context used to tell threads on the same entity apart — never a tag.

Matches are grouped by strength (size of the discriminator overlap); the strongest pairing renders as the pair, weaker candidates collapse to a count. Within a report, pairs are grouped as contained (both ends inside the hosting note's Narrative Traversal Scope), incoming (closes here, opens outside), or outgoing (opens here, closes outside).

A pairing can also be flagged, never blocked: **time travel** when the payoff's Position precedes the setup's; a **red herring** when a setup never finds a payoff anywhere within the same root-level [Scope Anchor](./narradin.md#scope-anchor); **deus ex machina** the reverse. A setup and its payoff may legally sit in two different root-level Scope Anchors nested one inside the other ([Membrane Rule](./narradin.md#membrane-rule)) — an outer setup may pair with a payoff nested within it, or the reverse, but never the other direction, since scope inheritance never looks outward. A pairing that crosses root-level Scope Anchors this way is flagged as worth a second look, not treated as an error.

## Cast lists

Every distinct entity mentioned within the hosting note's Narrative Traversal Scope, filtered by the same eligibility test [Compile Scope](./compiler.md#player-and-plot-compilation) uses: the entity's own resolved scope must be an ancestor of, equal to, or a descendant of the hosting note's scope, and it must actually be mentioned, not merely eligible. An eligible entity that's never actually mentioned still appears, in a trailing appendix — the clearest signal that an entity was created and never used.

## POV and setting

POV and setting are positional: each declaration holds until the next one. A frontmatter declaration on a note is simply the value in force from the very first line.

An inline positional override — written with the same hidden `~` syntax as an [Author Note](./inline-properties.md#author-note), but resolved as a Reserved Key override before it is ever treated as one — takes effect from its own Position onward. `setting` stays a list even inline — not for sequencing, which positional overrides already handle, but for genuine simultaneity, like a scene showing two places at once.

Both resolve across an [Anchor note](./narradin.md#anchor-note)'s whole group — the anchor note together with all its Companions — not per file, by walking the group in [Narrative Order](./narrative.md#narrative-order): the anchor note first, then its Companions in configured type order. A declaration only reaches forward through that order, never backward. This is why an author who declares `pov` once, in a dashboard note's frontmatter, gets that POV throughout its prose Companion — resolving per file instead would leave the one place POV actually matters with no POV at all. A group with no declaration anywhere simply has no POV; it is never inherited from anywhere else.

Multiple POV segments within one note are counted and reported, never judged — Narradin cannot tell head-hopping (a craft weakness worth flagging) from deliberate omniscient narration from a scene that should really be two, and doesn't try to ([Judge, but don't sentence](./principles.md#judge-but-dont-sentence)). A configurable threshold (default 3) surfaces only the extremes, framed as a question — _"this scene has four POV segments: is that one scene, or several?"_ — and can be dismissed per note. A scene with more than one POV segment correctly appears under every one of those characters in a POV-based report, marked as a shared segment rather than a duplicate.

## Outtake markers

Cutting prose to an outtake collection leaves behind a hidden pointer, written exclusively by Narradin — never composed or hand-edited by the author. It's a System Key marker, invisible and cursor-skipped, that captures the POV and setting in force at the moment of the cut; restoring it later compares those captured values against the current ones and warns if the scene has moved on since. The collection note it points to must sit within the same root-level [Scope Anchor](./narradin.md#scope-anchor). A small gutter icon on any block containing markers offers restore and inspection — it is never an insertion surface.

## Anchor cascade

Every row in every view links to the actual occurrence, not merely to the note: the specific block if the author wrote one, else the nearest preceding heading, else the note itself. Links always show the full path with a display alias rather than a bare name, since two entities sharing a display name is expected, not an error.

## Icon registry

A central registry maps each concept — every hierarchy level, every entity category, every context, every status indicator, every piece of report chrome — to one icon, recording who owns that binding. An unrecognised concept falls back to a generic placeholder icon, never a blank slot; icons ship with sensible defaults and are fully overridable. This registry is distinct from the per-note icon property ([Element insertion](./narradin.md#element-insertion)), which is a per-note cache of the binding this registry defines per concept.

## Report chrome

Every view shares the same frame: a header with its registered icon, title, and a collapse toggle; an empty state that names what was searched for and came up empty; and an error state that names the specific cause rather than failing silently. Collapse state is remembered per note, so a rename never resets it.
