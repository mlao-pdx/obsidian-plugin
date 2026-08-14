# Inline properties

Inline properties are the one shared grammar behind cast lists, POV tracking, progressions, and setups & payoffs — these are all views over the same underlying records, not separate subsystems.

An inline property takes the shape `{modifier key=value}`, where `key` is one or more `subject+context+context…` segments (`|`-separated for more than one key in the same property), written either in a note's frontmatter or its body. Three modifiers exist:

| Modifier | Name                   | Visibility                           |
| -------- | ---------------------- | ------------------------------------ |
| _(none)_ | **Entity Property**    | Visible, dimmed and smaller          |
| `~`      | **Author Note**        | Hidden (a small dot in preview)      |
| `!`      | **Internal Reference** | Hidden everywhere except source mode |

Every inline property, regardless of modifier, that doesn't parse cleanly — a stray second `=` inside the braces, or a key with no subject — is never silently dropped. Narradin marks it visibly as an error in the editor so the author notices, instead of a typo silently hiding an entity property for months ([Read forgivingly, write critically](./principles.md#read-forgivingly-write-critically)).

## Note property vs. inline property

A note property's subject is the note it sits in (`is`, `for`); it lives in frontmatter only, one value per key. An inline property's subject is an entity (or a discussion) named inside its own key, wherever it's written; a note may carry many inline properties under the same key. `is: [[A Scene]]` describes the note itself; `Frodo: realizes the truth` describes Frodo and merely happens to live in that note.

## Three kinds of file property key

Every frontmatter key a note carries is exactly one of three kinds:

- **Configurable key** — a plain key whose _name_ the author can reconfigure in settings, kept as an exchange layer with the author and other plugins. `is`, `sort_index`, and `folder_index` are semantically mandatory (every note must resolve one, under some name); others, like `pov`, `setting`, and `do_not_rename`, are optional. Never resolved as an entity subject.
- **Interpreted key** — the default case: any key that is neither Configurable nor `◊`-prefixed is resolved as an [entity property](#entity-property) subject.
- **System Key** — a `◊`-prefixed key, always written by Narradin, never by the author, hidden by default (source mode always reveals it). See [The lozenge namespace](#the-lozenge-namespace).

## Entity Property

The default (unprefixed) inline property. Narrative metadata about an entity — cast, arcs, progressions:

```
{Frodo+setup=hobbits flee the shire}
```

Visible in reading mode, dimmed and smaller in Live Preview. Compile output shows only the value.

## Author Note

A `~`-prefixed inline property: a private note-to-self, never rendered in reading mode or in compiled output.

```
{~Gandalf+internal-note=revisit wizard timing}
```

Shown as a small dot in Live Preview, nothing in reading mode, full syntax in source mode.

## Internal Reference

A `!`-prefixed inline property: hidden bookkeeping — invisible everywhere except source mode, which is the only place it can be edited.

```
{!Saruman+outtake=cut this betrayal arc}
```

Mentions carried only by an Internal Reference are excluded from appearance evidence (cast lists, first-appearance ordering, presence counts) — removed or hidden content is not an appearance. They still show up in progressions, where the gap is exactly what the author needs to see.

### `◊revision` — revision threads

A revision thread is an Internal Reference whose first key is the System Key `◊revision`, marking it as a self-contained edit/comment discussion rather than generic bookkeeping. Each turn in the thread is its own key (`◊revision+Speaker+Timestamp+Comment`); the final turn may instead be `◊accepted` or `◊rejected` to mark resolution. The property's value holds the before and after text.

Recognising the `◊revision` key changes how Narradin renders the Internal Reference: an unresolved revision thread shows the proposed text dimmed and boxed with Accept/Reject controls, instead of being fully hidden. Once accepted, the value becomes the after text with a small collapsed-but-expandable history; once rejected, the before text is kept, with the same collapsed history. Deleting an unresolved thread first asks the author to accept or reject it — a resolution and a deletion happen together, leaving behind exactly the text that resolution would have rendered, with no marker or history left.

## Subject resolution

Reading the subject of an entity property, author note, or internal reference, in order, first match wins:

1. A configured Reserved Key (like `pov` or `setting`) — handled by that key's own resolution, never treated as an entity subject.
2. A [Player](./player.md) or [Plot](./plot.md) entity — matched against basenames and aliases within the host note's [Reference-Valid Scope](#reference-valid-scope).
3. A System Key — the remainder after the `◊` resolves to a configured System concept.
4. Unresolved — still indexed and rendered normally, still reported (with fuzzy near-miss suggestions), never dropped silently.

### Reference-Valid Scope

An inline property may name or target any entity within its host note's Reference-Valid Scope: the scope of the nearest root-level [Scope Anchor](./narradin.md#scope-anchor) containing the host — its full [Membrane Rule](./narradin.md#membrane-rule) reach, not just the host's own narrower resolved [scope](./narradin.md#scope). A reference naming an entity outside that reach is invalid, matching the Membrane Rule's "inside never looks out."

This is deliberately wider than how far an Alias Manager rewrite reaches, which stays bounded by the host's own narrower resolved scope. An inline property may validly target an entity the Alias Manager would never rewrite on that note's behalf — not a contradiction, just two operations with independently justified boundaries.

## Key normalisation

Before matching a key's subject against an entity's basename or aliases, Narradin normalises both sides: case and accent differences collapse, apostrophe and dash variants collapse to a common form, and whitespace runs collapse. Normalisation only resolves representation differences, never spelling — there is no fuzzy/near-miss auto-matching, only a suggestion in health reports. Presentation always uses the raw, as-typed form; normalisation is for matching only, never for display.

## The lozenge namespace

The lozenge (`◊`) exists to reserve a namespace, not to decorate one — it is deliberately awkward to type, and Narradin never offers a suggester, command, or palette entry for it. Narradin writes lozenges; authors do not. This keeps the System namespace permanently collision-free: a new System Key can be introduced at any time with no risk of shadowing an entity name.

A System Key can appear either as a frontmatter property key or as the resolved subject of an inline property — same namespace, same rules, just two positions it can appear in.

`◊status` is a list-valued System Key: any number of owning subsystems may append their own token to the end, and each may only remove tokens it owns itself, from wherever they sit in the list — never another subsystem's token. The last entry governs what's displayed; this is about recency, not severity, deliberately avoiding a subjective ranking of which alert "wins" ([Judge, but don't sentence](./principles.md#judge-but-dont-sentence)).

## `do_not_rename`

`do_not_rename` is a Configurable key, not a System Key — a timestamp the author sets (optionally auto-populated by a command, or by the [Compiler](./compiler.md), once written) that excludes the note carrying it from ever receiving an Alias Manager rewrite. It does not stop the underlying entity from being renamed elsewhere; it only freezes this one note's own text against rewrites, with a timestamp so the author has a handle on when that freeze happened.

## Position

Every inline property carries a Position — where in its host note's body (or frontmatter) it was written: which line, which column (for more than one property on the same line), and the block ID if the author happened to add one to that block. Narradin never writes a block ID itself.

A full cross-note ordering — for views like Progressions, or for ordering mentions across notes — is built by combining an inline property's own Position with its host note's own place in the [Narrative Order](./narrative.md#narrative-order). The two are computed separately and joined only when a view actually needs the combined ordering.
