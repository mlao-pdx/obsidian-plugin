# Part 1: Core Design Philosophies

## Part 1: Core Design Philosophies

Deviations must be documented at the point of deviation.

- **Embrace the Chaos Around the Narrative Backbone.** Make sense of the chaos; do not
  prevent the chaos the author desires. Structural oddities are permitted so long as
  they never silently destroy or corrupt work. The rigid part is no longer a fixed list
  of names — there is no fixed list. It is the _mechanism_: a Narrative concept placed
  as a matching folder note (§4.1) becomes a boundary, full stop. Realm alone is the
  mandatory anchor. Chaos is embraced in which concepts exist, how many levels deep, and
  everything else — intermediate folders, leaf content, and (per Decision Record B.17)
  the concepts themselves.
- **The Half-Fix Rule.** We don't break things you didn't break, but we may only
  half-fix things if you don't play along. The user has responsibilities; Narradin holds
  them accountable rather than restricting them.
- **Count and Report, Never Judge.** Where Narradin cannot distinguish a craft weakness
  from a deliberate technique — head-hopping from omniscient narration, a duplicate
  alias from a deliberate echo — it reports the observation and asks a question. It does
  not declare an error. Advisory thresholds exist to surface extremes without pestering.
- **Absolute Opt-In.** A note is invisible to Narradin unless it carries a valid
  configured `is` value. Folders are structural pass-throughs and need no marking.
- **`is` Is Truth.** Filenames, folder names, and `__` suffixes are conveniences and
  creation aids. The `is` property, resolved through Obsidian's metadata cache, is the
  only authority. `is` is deliberately the one property the author is expected to read,
  write, and reason about. No other property may become a co-equal authority.
- **The Realm Is the Universe of Discourse.** A note with a valid `is` but no Realm
  ancestor is invisible to Narradin, whatever its category. No Realm, no play. Such
  notes are _reported_, never silently dropped.
- **Realm Blast Radius.** Every _action_ is bounded by the anchoring note's own Local
  Scope, anchored at a Realm. An outer Realm's blast radius now legitimately extends
  into every Realm nested anywhere within its own subtree, at any depth (§5.3) — this is
  not a contradiction of "bounded by a single Realm," it is what that boundary always
  meant once nesting is unconditionally legal: the boundary is the anchor's own Realm,
  whatever it contains. An inner Realm's blast radius stays exactly as bounded as
  before — it never reaches back out. _Documented deviation:_ concept renames (§2.4) are
  vault-wide by necessity, being configuration migrations delegated wholesale to
  Obsidian's link cascade.
- **The Membrane Is One-Way, Always.** The outside looks in; the inside never looks out.
  This holds without exception for every nested Realm boundary, any depth — reads and
  writes, reports and rewrites alike, no bifurcation. This invariant is load-bearing for
  reasoning about the whole system.
- **Order Constrains Nothing; It Is Advisory.** There is no fixed list of anchors to be
  incomplete against, and no structural order enforcement left at all (Decision Record
  B.2, I4). A captured-but-never-enforced expected order (§2.3) drives a purely
  informational comparison, surfaced through the status-overlay mechanism (§12) — never
  consulted by boundary or scope resolution.
- **Structure Advisories Never Block.** Nothing a folder-note placement or an order
  mismatch can do ever removes a subtree from compilation, traversal, or outer
  reporting — that entire class of consequence (Islands) is retired. What survives from
  the old "Structure Errors Sever" principle is narrower and purely informational: a
  structural oddity is always reported, never silently hidden, and never gates anything.
- **The Vault Is Truth; The Index Is A Cache.** Every fact Narradin relies on is
  reconstructable from vault content. IndexedDB exists solely for query speed;
  disagreements resolve in the vault's favour, silently. A lost index costs a rebuild,
  never data.
- **Reserved Namespaces.** Narradin owns `narradin__*` in frontmatter and the `◊`
  lozenge prefix in Entity Property subjects, absolutely. Everything else — `aliases`
  explicitly included — belongs to the author, is diffed rather than rewritten, and is
  never overwritten.
- **Leverage Native Mechanics.** Prefer Obsidian's link resolver, rename cascade, and
  metadata cache over string matching. Prefer the ecosystem (Notebook Navigator,
  Templater) over rebuilding UI.
- **Graceful Degradation.** A failed automated action aborts cleanly, notifies, logs,
  and leaves the plugin functioning.
- **Naming Collisions Broadcast.** Where multiple valid entities share a basename or
  alias, data is broadcast to _all_ of them. Narradin does not guess.
- **Matching Forgives, Rewriting Does Not.** Entity matching is normalised and
  case-insensitive, because a missed match loses data. Text replacement is strict and
  case-sensitive, because a false match destroys prose. The asymmetry is intentional.
- **Never Worse Than Manual.** No automated write may leave the vault in a state worse
  than a partial manual find-and-replace would have.
- **Idempotent Ingest.** Reprocessing any file yields an identical index. This is what
  makes self-write suppression of any kind unnecessary, full stop — no exception. Every
  reactive structural handler checks current actual state before acting rather than
  reacting unconditionally to "an event happened," so a corrective action's own
  resulting event converges by finding "already correct" (§12.1, "Idempotent Reactive
  Handlers"). A second, orthogonal rule governs when a fact may be written to the
  Canonical Index — never speculatively ahead of the vault confirming it — stated as its
  own principle in §12.1 ("The Vault Is Truth" sequencing).

### 1.1 Universal Clash Resolution Protocol

When Narradin must deterministically order or choose between otherwise-tied items:

1. **Ascending natural sort on the fully qualified name** (basename plus extension),
   using `Intl.Collator` with `numeric: true`, `sensitivity: 'base'`, and the vault
   locale.
   - `numeric: true` yields natural ordering — `Chapter 2` before `Chapter 10` —
     matching Obsidian's own file explorer. Lexicographic ordering would make a compiled
     manuscript contradict the file tree the author is looking at, which the "file tree
     _is_ the manuscript" premise cannot survive.
   - Comparing the **fully qualified** name places a folder ahead of a like-named note,
     since `Book A` is a prefix of `Book A.md`.
   - Items compared always share a parent, so comparing name and comparing path are
     equivalent.
2. **Oldest `ctime`** wins. Unavailable `ctime` is null and skipped.
3. Still tied — notify the user they are King of Chaos; Narradin surrenders.

> **This is the default ordering mechanism, not an exotic tiebreak.** Notebook Navigator
> writes `sort_index` only to folders where custom sort has been enabled. Everywhere
> else no note carries one, every item defaults to `1`, and step 1 decides narrative
> order outright. This is intentional: a fresh vault compiles in natural filename order
> with zero configuration.

> **Reachability.** Two entries in one folder cannot share a fully qualified name on a
> case-insensitive filesystem, so steps 2 and 3 are unreachable in structural sorting.
> Step 2 remains live for the Alias-Init deviation below, and for case-only collisions
> on case-sensitive filesystems, where `sensitivity: 'base'` produces a genuine tie.

> **Documented deviation — Alias Init (§10.8).** Duplicate alias strings resolve by
> **oldest `ctime` wins**, inverting steps 1 and 2. Deliberate: "the note that has held
> this name longest owns it" is semantically meaningful, where alphabetical would be
> arbitrary.

_A hash tiebreaker was considered and rejected: it produces effectively random ordering,
which is worse than surrendering visibly._

### 1.2 Notification & Logging Policy

- Transient conditions surface as Obsidian notices.
- **Every** notice is also appended to a log under `_narradin/`, so a missed toast is
  recoverable.
- Blocking ambiguities requiring a human decision surface as modals, never toasts.
- Repeated identical conditions notify **once per session**, not per event.

---
