# Version control

Narradin can put the whole vault under local git version control — one repository for the entire vault, not one per [Scope Anchor](./narradin.md#scope-anchor) and not limited to Narradin's own files. This gives compile history, editorial snapshots, and a genuine back-out mechanism for the [Alias Manager](./alias-manager.md)'s rewrites. It is entirely optional.

## Scope and enablement

There is no branching: divergence between formats (print, ebook, audio) is handled by Companions, not branches. Narradin configures no remote and no large-file storage — this is local versioning, not a backup solution; an author who wants a remote adds one themselves, outside Narradin's UI.

The Alias Manager cannot be enabled unless version control is enabled — it is the Alias Manager's own back-out mechanism, bracketing every rename pass with an automatic commit before and after. Disabling version control while the Alias Manager is on warns that this will disable the Alias Manager too, flushing any outstanding pending renames first.

## Operational commits

Background commits that simply keep the repository current are never tagged — only the Alias Manager's own pre/post-rename commits and the author-triggered tags below receive one. This keeps the tag list meaningful, not noisy.

## Author-triggered tags

Two kinds of tag exist, both author-initiated, each requiring the author to confirm or adjust a scope first ([Scope picker](#scope-picker), below):

- **Release tags** — a hand-off to an audience. A Public release is a bigger jump than a hand-off to a closed audience (an editor, agent, publisher, or proof-reader).
- **Progress tags** — a self-declared unit of completed work (prose, world-building, a character arc, plotting, marketing, or errata), plus freeform detail.

There is no automatic tagging tied to status, and no dedicated tag for a POV or setting shift — those stay exactly what they already are, inline properties, not version events.

## Scope picker

A tree, prepopulated from the active note's own narrative path and defaulting to its own level. The author may walk it upward, dropping any number of the deepest confirmed levels, to broaden the tag's scope. Because the narrative hierarchy has no fixed depth, the picker shows only a handful of levels at a time with room to expand further — it never assumes a fixed shape or forces the author to drill down to leaf depth.

The confirmed path becomes the tag's scope: the narrowest node the author confirms covers everything the tag is about.

## Version tag grammar

A version tag is a semantic-version-style string, with a build-metadata segment carrying the confirmed scope path from the root level down to that narrowest confirmed node — however many levels that actually is; there is no fixed number of segments.

Alongside the version numbers, a tag carries: a format (manuscript, print, ebook, or audio), a language (always explicit, never omitted even when it matches a default), an optional publisher/platform code (never present for the manuscript format, since the manuscript is the canonical source, not a publisher-specific artifact), a lifecycle label (draft, development, line edit, and so on — each valid only for its assigned formats), and an iteration counter that resets whenever the format, language, or publisher segment changes.

## Companions for format divergence

An audio Companion type is seeded as a copy of the prose Companion, then diverges in the author's hands — stage directions, adapted dialogue tags, and the like. Print and ebook formats typically have no dedicated Companion at all; they use the prose Companion verbatim, with formatting handled downstream by other tools. Nothing syncs automatically between Companions of different formats — an errata fix made in one is not propagated to the others. The author can pick any two Companions of the same [anchor note](./narradin.md#anchor-note) — typically prose against audio — and see a side-by-side diff.

## Restore semantics

Restoring from a tag is never a rollback: it never rewrites history. It's a compensating transaction — the restored content becomes the new current state, and the sequence leading up to it stays exactly as it happened. Restoring commits and tags the outstanding state first, then applies the restore (a full tag, or just a chosen subset of files), then commits and tags the result. A restore covering several files at once still yields one commit and one tag for the whole request; several separate single-file requests yield several. If any file in a request fails to apply, the entire request is aborted and rolled back to its pre-restore state, with the specific blocking reason reported — a partial restore is never left in place. A diff preview of everything the restore will change is shown before any of this commits.
