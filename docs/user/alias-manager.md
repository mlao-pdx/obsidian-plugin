# Alias Manager

The Alias Manager closes a gap Obsidian's native rename leaves open: renaming a note updates wikilink destinations everywhere, but never touches display text or plain prose mentions of that name. The Alias Manager rewrites both, for a configured set of entities, without ever leaving the vault worse off than a partial manual find-and-replace ([Never Worse Than Manual](./principles.md#never-worse-than-manual)).

It requires git version control (once written) to be enabled — that's the feature's back-out mechanism. Every pass is bracketed by an automatic commit before and after.

## Tracked notes

Tracked notes are notes whose basename and aliases the Alias Manager tracks and propagates. Which entity file property values are tracked is configured by the author, selectable only from already-configured [Player](./player.md) and [Plot](./plot.md) concepts, defaulting to all of them.

A target — a note a rewrite may touch — is not separately configured: it's any note within a tracked note's own resolved [scope](./narradin.md#scope), excluding [Generated Companions](./companion.md#generated-companions) and Narradin's own system folder.

## Sources of change

A rename or alias change can come from several places, and the Alias Manager treats them consistently:

- **The alias editor.** Lists every current alias in its own field; clearing a field retires that alias, changing it renames it, leaving it alone does nothing. The basename itself is never shown there — to change it, rename the file natively.
- **A native file rename.** Renaming the note itself is treated exactly like renaming its (implicit) primary alias.
- **A manual frontmatter edit.** The Alias Manager never owns the `aliases` property and never overwrites a hand edit; it diffs what changed and treats an added value as a new alias, a removed value as a retirement, and an unchanged value as a no-op. A manual edit can never register as a rename — only the editor and a native file rename can link an old name to a new one.

Retiring an alias never scrubs it from prose. It only rewrites wikilink display text back to the note's own name; plain prose mentions of the retired name are left exactly as written — removing an alias never meant "delete this name from my manuscript."

## The application engine

A background process that works through each tracked note's pending renames against its targets.

**Blast radius.** Bounded by the tracked note's own resolved [scope](./narradin.md#scope) — the same mechanism, and the same scope, as [Compile Scope](./compiler.md#compile-scope). A Series-level character's rename rewrites across that Series; a Chapter-scoped bit player's rename rewrites only that Chapter. This is deliberately narrower than the entity's [Reference-Valid Scope](./inline-properties.md#reference-valid-scope), which reaches the whole root-level anchor — mentions outside the tracked note's own resolved scope are missed, a deliberate, accepted trade-off ([Never Worse Than Manual](./principles.md#never-worse-than-manual)).

**Replacement rules.** Case-sensitive, always — a rename after proofreading is proofreading's own reward, not the Alias Manager's problem. Every kind of text is searched: tables, quotes, code blocks, headings — nothing is fenced out, because entity names genuinely live everywhere. The one sacred exception is the destination half of a wikilink; the display half, and all plain prose, is fair game. Inline property keys are rewritten too — a rename correctly updates a subject inside an [Entity Property](./inline-properties.md#entity-property), and inside a revision-thread turn, since both lean on the same word-boundary logic.

**Substring protection.** A shorter alias contained inside a longer, already-registered one is protected from being rewritten mid-word — renaming `Vimes` never touches `Captain Vimes` if `Captain Vimes` is itself a registered alias, though an unregistered compound name is not protected this way. There is no minimum-length guard: a two-letter alias is tracked and rewritten like any other, because the same lookup also powers mentions, and skipping short aliases there would have silently erased a character's presence entirely, not just their renames.

**Reporting, not gating.** An ambiguous match is left untouched and logged, never guessed. Every pass writes a replacement report — alias, replacement, occurrence count, affected notes — so nothing happens invisibly ([Judge, but don't sentence](./principles.md#judge-but-dont-sentence)).

## Scope migration

A tracked note's resolved [scope](./narradin.md#scope) can change — the note moves, or a [Scope Anchor](./narradin.md#scope-anchor) appears or disappears above it — while a rename is still pending. When that happens, the Alias Manager re-checks for collisions against the note's current scope before running the pending work, and runs that pending work against the scope it had when the rename was requested, to preserve the author's original intent. Anything that now collides is skipped and reported rather than applied.

## Multi-device

The Alias Manager's own working index is device-local and rebuildable from the vault at any time — losing it costs a rebuild, never data. Because two devices actively tracking renames at once is a reconciliation problem the Alias Manager does not attempt to solve, only one device is ever the active owner at a time; the others show a warning naming the current owner, with an easy way to claim ownership when switching machines. Ownership is cheap to claim precisely because there's no ledger to hand off, only a cache.

## `do_not_rename` exemption

A target carrying [`do_not_rename`](./inline-properties.md#donotrename) is skipped before any replacement is computed for it. This is treated as a successful, ordinary outcome, not a failure to report — the author already chose to freeze that note. The rename still propagates normally everywhere else within the tracked note's resolved scope; only that one frozen target's own text is left as it was. Removing `do_not_rename` later doesn't retroactively replay anything that happened while it was set — the note simply becomes eligible for future renames going forward.
