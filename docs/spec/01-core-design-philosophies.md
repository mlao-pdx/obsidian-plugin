# Part 1: Core Design Philosophies

## Part 1: Core Design Philosophies

Deviations must be documented at the point of deviation.

- **Embrace the Chaos.** Make sense of the chaos; do not prevent the chaos the author
  desires. Structural oddities are permitted so long as they never silently destroy or
  corrupt work.
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
- **Realm Blast Radius.** Every _action_ is bounded by a single Realm. _Documented
  deviation:_ concept renames (§2.4) are vault-wide by necessity, being configuration
  migrations delegated wholesale to Obsidian's link cascade.
- **The Membrane Is One-Way, Always.** The outside looks in; the inside never looks out.
  And nothing ever crosses _into_ an Island from outside — reads or writes, reports or
  rewrites, without exception. This invariant is load-bearing for reasoning about the
  whole system.
- **Order Constrains; Completeness Does Not.** Hierarchy levels must appear in
  configured order. Only Realm is unskippable.
- **Structure Errors Sever, They Do Not Delete.** A structural violation removes a
  subtree from compilation and outer reporting. It never removes notes from Narradin's
  awareness, and it is always reported.
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
  lets loop suppression be a best-effort optimisation rather than a correctness
  mechanism — with one exception (§12.1).

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
