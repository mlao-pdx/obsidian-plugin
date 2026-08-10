# Part 9: Inline Properties

## Part 9: Inline Properties

**Goal:** one shared grammar, one index, one position model, across four inline-brace
constructs. Progressions, Setups & Payoffs, cast lists, POV tracking, and outtake markers
are all _views_ over the same records — not parallel subsystems.

Four types exist, distinguished by opener:

| Modifier | Name                   | Visibility                                             | Use Case                                      |
| -------- | ---------------------- | ------------------------------------------------------ | --------------------------------------------- |
| _(none)_ | **Entity Property**    | Visible, dimmed & smaller                              | Narrative metadata (cast, arcs, progressions) |
| `~`      | **Author Note**        | Hidden (interpunct in preview)                         | Private note-to-self, not in final text       |
| `!`      | **Internal Reference** | Hidden, source-mode only                               | Outtake pointers, internal bookkeeping        |
| `#`      | **Editorial Property** | Visible (dimmed if unresolved) or hidden by resolution | Edits, comments, discussion threads           |

### 9.0 Note Properties vs Inline Properties

Two kinds of metadata, distinguished by **subject**, not by syntax.

|             | **Note Property**                               | **Inline Property**                               |
| ----------- | ----------------------------------------------- | ------------------------------------------------- |
| Subject     | the note it sits in                             | an entity (or discussion) named in the key        |
| Location    | frontmatter only                                | frontmatter **or** body                           |
| Cardinality | one per key per note                            | many per key per note                             |
| Owner       | Narradin (reserved keys) or author              | the author                                        |
| Examples    | `is`, `for`, `pov`, `sort_index`, `narradin__*` | `{Frodo+midpoint=…}`, `Frodo: realizes the truth` |

`is: [[A Scene]]` describes _this note_. `Frodo: realizes the truth` describes _Frodo_
and merely happens to live here.

**Why Note Properties are frontmatter-only.** This is an architectural constraint, not a
terminology preference. `metadataCache.on('resolved')` delivers every frontmatter block
in the vault, from Obsidian's own index, at boot. Body properties are Narradin's own
parse — debounced, driven by `vault.on('modify')`, resolved at Content Projection (§12.4). If `is` could
live in the body, Canonical Index (§12.3) would depend on Content Projection to build the tree (circular), boot
would require reading every file before any hierarchy existed, and Notebook Navigator
could not see it — the very reason `is` is worth having.

**But chaos is surfaced, not prevented.** An author writing `{~is=[[A Scene]]}` is not
blocked. Health reports: _"`is` found as a body Inline Property in 3 notes. Narradin
reads `is` only from frontmatter."_ Half-Fix, visible, accountable.

### Three Kinds of File Property Key

Every frontmatter key a note carries falls into exactly one of three kinds. This
taxonomy names a distinction that already governs behavior throughout this Part and
§2.3 — it introduces no new grammar or resolution logic, only the vocabulary for
categories that already exist.

- **Configurable keys** — plain (unprefixed) keys whose _name_ is user-definable, kept
  as an exchange layer with the author and other plugins (Notebook Navigator among
  them). `is`, `sort_index`, and `folder_index` are semantically mandatory — every note
  must resolve one under _some_ name — but the name itself is freely reconfigurable
  (§2.3/§2.4) to avoid vault-wide key clashes. The set also includes `icon`, and
  deliberately leaves room for future additions such as `color`, `background`, other
  Notebook Navigator-supported keys, and Narradin-recorded status keys.
- **Interpreted keys** — the default case: any key that is neither Configurable nor
  `◊`-prefixed is treated as an Entity Property subject, resolved against Player and
  Plot entities per §9.2's Subject Resolution order. Interpreted keys support multi-key
  (`|`-separated), multi-context (`+`-separated), and multi-value (`|` on the RHS)
  forms. In frontmatter, YAML's `:` plays the role the inline grammar's `=` plays in
  the body — a detail of Obsidian's YAML parser, not of Narradin's grammar.
- **System keys** — `◊`-prefixed, Narradin-authored and machine-owned, hidden by
  default (source mode always reveals them). See §9.2's "The Lozenge Namespace" and
  "Two Classes of System Marker" for the mechanism; this taxonomy only names the
  category.

**Reserved Keys** — never interpreted as an Entity Property subject, in either origin,
grouped by the taxonomy above:

| Category                     | Keys                                                                |
| ---------------------------- | ------------------------------------------------------------------- |
| Configurable / structural    | `is`, `for`, `compile`, `folder_index`, `sort_index`, `narradin__*` |
| Configurable / narrative     | `pov`, `settings`                                                   |
| Configurable / Obsidian core | `aliases`, `tags`, `cssclasses`, `icon`                             |
| Configurable / ecosystem     | `excalidraw*` (prefix match)                                        |

### 9.1 Grammar

```
{ modifier  key ( | key )*  =  value }
key       := subject ( + context )*
```

**Base pattern.**

```regex
/(?<!\{)\{(?<mod>[~!#]?)(?<lhs>[^{}=\n]+)=(?<rhs>[^{}=\n]*)\}(?!\})/gm
```

- `(?<!\{)` and `(?!\})` → avoid Mustache-style `{{…}}` templating.
- **Single `=` separator.** Neither LHS nor RHS may contain `=` — a second `=` anywhere
  inside the braces is what makes an expression malformed (§9.8), not a phantom field.
- No nesting (braces are excluded from both capture groups, so nesting is impossible by
  construction), single line always (`\n` is excluded too — a hidden property spanning a
  paragraph break would silently merge two blocks).
- **LHS format:** `Subject+Context1+Context2…|Subject+Context|…` (split on `|` for keys,
  then `+` for contexts).
- **RHS format:** `Value|Value|…` (split on `|` for values). `|` is legal inside a value
  at the regex level; only `=` is not.

**Post-processing, in order:**

1. If `mod` is empty, treat as an Entity Property.
2. Split `lhs` on `|` → keys.
3. For each key, split on `+` → `[subject, ...contexts]`.
4. Trim subject and each context (leading/trailing whitespace removed, internal runs
   collapsed).
5. Skip empty keys silently (a trailing `|` is a typing artefact, not an error).
6. **RHS: preserve as-written.** Split on `|` → values. Spaces immediately after `=` are
   retained (value content) — a user can write `{Frodo = setup = value}` for legibility;
   spaces around `=` and `+` are trimmed on the LHS, but spaces inside a value survive
   untouched.
7. Reject the whole property as malformed (§9.8) if any surviving key has an empty
   subject.

**Design consequences, deliberate:**

- **No balance marker.** The previous grammar required an explicit modifier plus a
  trailing character to balance it (`{+key=value+}`); that is gone (Appendix B §B.6).
  A literal trailing `+`, `~`, `!`, or `#` in a value is just value content now — there
  is nothing to strip.
- Duplicate key+context pairs **within one property** collapse to a single record.
  Differing contexts stay separate — that is precisely how one line of prose targets two
  payoffs: `{Frodo+payoff+ring|Frodo+payoff+oath=…}`.

**Parsing exclusions.** The parser ignores `{...}` inside: inline math `$…$` and block
math `$$…$$`; fenced code blocks and inline code spans; and Obsidian comments `%%…%%` and
HTML comments.

> ⚠️ **There is no CriticMarkup exclusion.** The previous grammar carved out `{++`,
> `{--`, `{~~`, `{==`, `{>>` before modifier detection ran. That exclusion is dropped
> entirely (Appendix B §B.6) — Editorial Properties are Narradin's own answer to
> track-changes, and CriticMarkup patterns are not otherwise special-cased. One
> consequence is accepted as-is, not a launch blocker: CriticMarkup's `{~~text~~}` and a
> Narradin Author Note (`~`) both open on `~`, and the two can visually collide in
> source. Authors who use both conventions in the same vault should expect it.

### 9.2 Entity Properties

**Syntax.**

```
{[modifier] Subject+Context1+Context2…=Value}
```

Examples:

```
{Frodo+setup=hobbits flee the shire}                // visible, dimmed
{~Gandalf+internal-note=TODO revisit wizard timing} // hidden note-to-self (interpunct in preview)
{!Saruman+outtake=cut this betrayal arc}            // hidden internal (nothing visible, glides over in preview)
```

**Modifiers.** This table governs the three constructs that share this grammar shape —
Entity Property (default), Author Note (`~`), and Internal Reference (`!`). Editorial
Property (`#`) has a different internal structure; see §9.5.

| Modifier | Behavior        | Preview                 | Reading Mode  | Source Mode               |
| -------- | --------------- | ----------------------- | ------------- | ------------------------- |
| _(none)_ | Default: kept   | value, dimmed & smaller | value, normal | full syntax               |
| `~`      | Note to self    | interpunct `·`          | nothing       | full syntax               |
| `!`      | Hidden/internal | nothing, glides over    | nothing       | full syntax, atomic range |

Source mode always shows full syntax for all three — **source mode is the debugger.**
`{!…}` is editable only there, by design, and must be implemented as a CodeMirror
**atomic range** so arrow-key traversal skips it rather than appearing to teleport.

Dimming applies to Live Preview only. Reading mode and compile output are clean
manuscript. Only the **value** is visible in reading mode (or interpunct for `~`, or
nothing for `!`).

### Subject Resolution

Ordered, first match wins:

1. **Player or Plot entity** — segment 0, normalised per Key Normalisation below, matched
   against basenames, aliases, and stale `narradin__fka` values within the property
   host's **Reference-Valid Scope** (§5.5) — its own resolved Realm Scope. Matching
   through the alias layer means a report does not blank out between a rename and its
   propagation.
2. **System concept** — segment 0 begins with `◊` (U+25CA LOZENGE) and the remainder
   resolves to a configured System concept. The property is a **system marker**.
3. **Unresolved** — indexed as unresolved, rendered in place normally, reported to health
   with fuzzy near-miss candidates computed at report time.

**Unresolved is never dropped.** Silence is how a typo hides for six months while an arc
quietly loses three beats.

**Reference-Valid Scope.** An Inline Property may name or target any entity within the
host note's own **Reference-Valid Scope** (§5.5) — its resolved Realm Scope (§5.2/§5.3).
Cross-Realm references are invalid: subject resolution never reaches outside the host's
Realm, matching the Membrane Rule's "inside never looks out." This is deliberately
**wider** than the Alias Manager's rewrite blast radius, which is bounded by Local Scope,
not Realm Scope (§10.6) — an Inline Property may validly target an entity the Alias
Manager would never rewrite on that note's behalf. Not a contradiction: reference
validity and rewrite reach are different operations with different, independently
justified boundaries — a deliberate Half-Fix on the rewrite side, not on this one.

#### The Lozenge Namespace

The lozenge exists to **reserve a namespace**, not to decorate one. It is deliberately
awkward to type — no keyboard carries it, and Narradin offers no suggester, command, or
palette entry for it. **Narradin writes lozenges; authors do not.**

The consequence is that the System namespace is permanently collision-free. New System
concepts may be added at any time without reserving words in the entity namespace,
introducing collision surface, or offering a setting to reclaim a shadowed name. Making
the lozenge convenient would forfeit exactly this.

Resolution order is retained for determinism, but the shadowing case it guards against —
an entity literally named `◊outtake` — cannot arise accidentally. An author who creates
one has done so deliberately and forfeits lozenge-dependent behaviour for that name.

Per Embrace the Chaos, a hand-typed lozenge is honoured: if the remainder resolves to a
System concept it behaves as a system marker; otherwise it is an ordinary unresolved
subject. The lozenge survives Key Normalisation untouched — it is not a combining mark,
an apostrophe, or a dash.

#### Two Classes of System Marker

Both are machine-written. They differ in what happens afterwards.

| Class              | Examples            | Authored by                    | Edited by author                    |
| ------------------ | ------------------- | ------------------------------ | ----------------------------------- |
| **Machine-only**   | `◊outtake`          | a command, as bookkeeping      | No — Narradin owns the relationship |
| **Author-invoked** | `◊pov`, `◊settings` | a command, as an authoring act | Yes — authorial content             |

Machine-only markers are pointers Narradin maintains; hand-editing one corrupts a
relationship Narradin owns. Author-invoked markers are the author's content in a syntax
Narradin supplies — the command exists only because `◊` cannot be typed.

### Key Normalisation

Applied to both sides of every entity match. Produces a matching key only — **never used
for presentation.**

1. Unicode NFKD
2. Strip combining marks (`\p{M}`)
3. Unicode full case-fold (`ß → ss`, `İ → i̇`)
4. Delete apostrophe variants: `'` `'` `ʼ` `` ` ``
5. Map dash/hyphen variants, `\`, and `/` to a single space
6. Collapse whitespace runs; trim

`Kulālaya/Maunavān` and `kulalaya\maunavan` both yield `kulalaya maunavan`.

- Both raw and normalised forms are stored; **raw is authoritative for display.**
- Post-normalisation collisions fall through to Naming Collisions and broadcast.
- **No edit-distance matching in v1.** Normalisation resolves representation differences,
  not misspellings. Fuzzy matching would silently bind a property to the wrong entity;
  near-misses are _suggested_ in health reports, never applied.
- **Presentation priority:** note basename → alias → surrounding prose → the literal key
  as typed.

### 9.3 Author Notes

A `~`-prefixed Inline Property: a private note-to-self, never rendered in Reading mode or
compile output.

```
{~Gandalf+internal-note=TODO revisit wizard timing}
```

Behavior follows the modifier table in §9.2: a dimmed interpunct `·` in Live Preview,
nothing in Reading mode, full syntax in source mode. Subject resolution and key
normalisation are identical to Entity Properties.

**CriticMarkup collision, accepted.** CriticMarkup's own `{~~text~~}` opens on the same
character as an Author Note's `~` modifier. Since §9.1 drops the CriticMarkup exclusion
entirely, the two are not disambiguated by the parser. Left as-is; not a launch blocker.

### 9.4 Internal References

A `!`-prefixed Inline Property: hidden bookkeeping — outtake pointers, internal
cross-references — invisible everywhere except source mode.

```
{!Saruman+outtake=cut this betrayal arc}
```

Behavior follows the modifier table in §9.2: nothing renders in Live Preview or Reading
mode; the cursor glides over it. Source mode is the only place it is editable, and it
must be implemented as a CodeMirror **atomic range** so arrow-key traversal skips it
rather than appearing to teleport.

**Mentions from Internal References are excluded from appearance evidence** — cast lists,
first-appearance ordering, presence counts — because removed or hidden content is not an
appearance. They are retained in Progressions, where the gap is exactly what the author
needs to see (§12.5).

### 9.5 Editorial Properties

A `#`-prefixed Inline Property: a self-contained, threaded edit/comment/discussion,
distinct in structure from the other three.

**Syntax.**

```
{#Speaker+ISO-Timestamp+Context1+Context2…|Speaker+ISO-Timestamp+Context…|…[|◊ACCEPTED+ISO-Timestamp|◊REJECTED+ISO-Timestamp] = BeforeValue|AfterValue}
```

Each turn in the thread is a multi-key entry. The final optional key may be `◊ACCEPTED`
or `◊REJECTED` to mark resolution.

**Examples.**

Unresolved edit:

```
{#Alice+2026-08-07T16:13:35Z+This is passive+and slow = walked slowly|ran quickly}
```

Resolved (accepted):

```
{#Alice+2026-08-07T16:13:35Z+This is passive|Bob+2026-08-07T16:14:00Z+Good catch|◊ACCEPTED+2026-08-07T16:14:30Z = walked slowly|ran quickly}
```

Multi-turn discussion with rejection:

```
{#Alice+2026-08-07T16:13:35Z+Too passive here|Bob+2026-08-07T16:13:50Z+I see it now|Alice+2026-08-07T16:14:05Z+Let's speed it up|◊REJECTED+2026-08-07T16:14:10Z = walked slowly|ran quickly}
```

**Structure.**

- **Turns:** Each `|`-separated key is one turn in a discussion thread.
  - Subject = speaker name (or `◊ACCEPTED`/`◊REJECTED` for resolution).
  - First context = ISO 8601 timestamp.
  - Remaining contexts = comment text (rendered as lines, `+` joins them).
- **Values:** `|`-separated array.
  - `[0]` = before text (original).
  - `[1]` = after text (proposed/accepted/rejected).
  - Future extensions possible for additional values.

**Rendering.**

_Unresolved:_

- Modal with full thread (all speakers, timestamps, comments).
- After text shown in prose, dimmed and boxed to indicate pending edit.
- Accept/Reject buttons, plus a Delete action.
- **Delete on an unresolved edit is not itself a resolution.** It prompts the
  user to choose ◊ACCEPTED or ◊REJECTED first. Choosing Cancel at that
  prompt aborts the deletion entirely; the edit remains unresolved and
  untouched.
- Choosing a resolution at that prompt both resolves and deletes in one
  step: the `{#...}` expression is removed from the source entirely,
  leaving behind exactly the text that resolution would have rendered
  (the after-value for ◊ACCEPTED, the before-value for ◊REJECTED) — with
  no marker, no icon, no expandable thread. This differs from a plain
  Accept/Reject (below), which keeps the collapsed thread and icon in
  source for audit history.

_After Accept:_

- Value replaced with after text, normal rendering.
- Thread collapsed but expandable.
- Dimmed checkmark (`✓`) icon.
- Full thread history preserved in source.

_After Reject:_

- Value unchanged (before text shown, normal rendering).
- Thread collapsed but expandable.
- Dimmed X (`✗`) icon.
- Full thread history preserved in source.

**Resolution markers.**

- `◊ACCEPTED+Timestamp` → edit accepted, after value applied.
- `◊REJECTED+Timestamp` → edit rejected, before value retained.
- Both are system markers (lozenge), timestamped, audit-trail preserving.

### 9.6 Context Vocabulary

Contexts are free text. An optional **per-Realm vocabulary** may register known contexts:

```yaml
- context: setup      # normalised
  label: Setup        # display
  icon: sprout        # Icon Registry key
  role: opens
- context: payoff
  label: Payoff
  icon: wheat
  role: closes
```

- `role: opens | closes | none`. Default `none`.
- Shipped defaults — **opens:** `setup`, `intrigue`, `suspense`, `hook`.
  **closes:** `payoff`, `reveal`, `twist`.
- Authors extend freely: `promise`/`fulfilment`, `wound`/`healing`, `question`/`answer`
  all work with no code.
- Unregistered contexts render plainly and are reported as near-misses — `midpoint` vs
  `mid-point` fragments an arc silently otherwise.

Validation would fight Embrace the Chaos; silence would fragment arcs. The vocabulary is
the middle path: legal either way, reported when suspicious.

### 9.7 Position

Every Inline Property carries a Position — the three fields the parser can observe
directly, at the moment it reads a specific note's body:

| Component | Meaning                                                                              |
| --------- | ------------------------------------------------------------------------------------ |
| `line`    | **1-based, matching source mode.** Frontmatter's opening `---` is line 1             |
| `offset`  | column, for multiple properties on one line                                          |
| `blockId` | present if the author wrote one on the containing block; Narradin never authors them |

**`sequenceIndex` and `companionRank` are host-level, not per-property** (Appendix B
§B.6). They are facts about the _host note or companion_ a property lives in, already
known from the Content Sequence walk (§7.5, `ContentSequenceEntry`) by the time a parser
reaches that note's body — pushing them into every inline-property record would duplicate
data that is already available one level up. A full cross-note sort key (for views such
as Progressions, and for mention ordering) is composed **at query time** by joining a
property's `(line, offset)` with its host's `(sequenceIndex, companionRank)` via `fileId`
— the two no longer travel together in one struct.

**Block IDs** are captured when the author has written one on a block containing a
property. Narradin never authors them. They feed the anchor cascade (§16.6).

### 9.8 Malformed Expressions

An Inline Property is malformed if:

- LHS or RHS contains the separator character on the wrong side (e.g., RHS contains an
  extra `=`).
- After splitting and trimming, a key has an empty subject.
- Any other structural parse failure.

**Detection is two-pass, because the strict pattern can't see its own near-misses.** The
§9.1 base pattern excludes `{`, `}`, `=`, and `\n` from both `lhs` and `rhs`, so text with
a second `=` inside the braces (e.g. `{Frodo+setup = This has = two equals}`) does not
match it at all — there is no capture to inspect, let alone flag. Catching that case
requires a **second, looser scan** that runs only over spans the strict pattern left
unclaimed, never in place of it:

```regex
/* Pass 1 — unchanged from §9.1. Every match here is a well-formed property. */
/(?<!\{)\{(?<mod>[~!#]?)(?<lhs>[^{}=\n]+)=(?<rhs>[^{}=\n]*)\}(?!\})/gm

/* Pass 2 — candidate scan. Any single-line, non-nested {...} not already
   claimed by Pass 1, still respecting the Mustache guard. */
/(?<!\{)\{(?<mod>[~!#]?)(?<body>[^{}\n]*)\}(?!\})/gm
```

A Pass 2 candidate is malformed — not ignored — when its `body` contains at least one
`=` (it was clearly attempting a `key=value` shape) or, after applying §9.1's
post-processing, a surviving key has an empty subject. A Pass 2 candidate with no `=` at
all is not an Inline Property and is left as plain text — braces alone don't imply intent.

Malformed expressions are **not silently dropped**. Instead:

1. Render with the theme's `text-error` class (red/error styling).
2. Optional hover tooltip: "Malformed inline property: [reason]".
3. The author can fix it, or delete it.

Example:

```
{Frodo+setup = This has = two equals}  // ERROR: "Value contains = character"
```

Following Count and Report, Never Judge: a typo should show red squiggles in preview, not
make the property vanish. Silence is how a typo hides for six months.

### 9.9 Records and Providers

**`PropertyProvider`** owns Inline Property records from both origins. Purely syntactic —
it performs no entity resolution, so its records stay valid when entities are renamed,
created, or deleted. It owns two record shapes: `EntityPropertyRecord`, shared by Entity
Properties, Author Notes, and Internal References (they differ only by `modifier`), and
`EditorialPropertyRecord`, for `#` threads.

```typescript
interface Position {
    line: number;       // 1-based, frontmatter '---' is line 1
    offset: number;     // column, for multiple properties on one line
    blockId?: string;   // present if the author wrote one; Narradin never authors them
}

interface EntityPropertyRecord {
    fileId: number;
    position: Position;
    origin: 'frontmatter' | 'body';
    modifier: '' | '~' | '!';   // '' = default (visible, kept)
    keys: Array<{ subject: string; contexts: string[] }>;  // raw and normalised
    value: string;
}

interface EditorialTurn {
    speaker: string;      // raw, as typed — "Alice", "◊ACCEPTED", "◊REJECTED"
    timestamp: string;    // ISO 8601, as typed, not validated for correctness
    comments: string[];   // remaining contexts, one per line
}

interface EditorialPropertyRecord {
    fileId: number;
    position: Position;
    turns: EditorialTurn[];
    resolution: 'pending' | 'accepted' | 'rejected';
    resolvedAt?: string;         // timestamp from the ◊ACCEPTED/◊REJECTED turn, if present
    values: string[];            // [0] = before, [1] = after; may extend beyond 2 in future
}
```

`fileId` on both records already implies the host note; `sequenceIndex` and
`companionRank` for that host are resolved by whatever component walks the Content
Sequence (Indexer/Canonical Index, §7.5), not stored redundantly on every property record.
Whatever component composes a full cross-note sort order (Part 16 views) must join on
`fileId` to pull those two fields in from the host record.

Keyed by Position, so ten identical `{Frodo+tension=…}` in one scene are ten records.

**Frontmatter specifics.** YAML forbids duplicate keys, so one entry per key per note. A
string array expands to one record per element, preserving array order, all sharing the
note's frontmatter Position. Non-string values are taken verbatim.

**Empty value** — `{Frodo+arrives=}` is legal. It may be a deliberate presence marker or
a placeholder; views render a _Missing Value_ badge.

**There is no `ProgressionProvider` and no `SetupPayoffProvider`.** Every view in Part 16
is a query over `PropertyProvider` joined to `MentionProvider` (§12.5).

---

## Decision Record

## B.6 Inline Property Grammar

**Chain:** I1 prose syntax → I2 first key segment → I3 system-concept addressing → I4
modifier meaning (superseded, see I5/I6 below).

```mermaid
flowchart LR
    subgraph S1["I1: What syntax for narrative metadata in prose"]
        I1{{What syntax for narrative metadata in prose}}
        P1[Dataview inline fields]
        P2[Custom brace syntax]
        I1 --> P1
        I1 --> P2
        C1(CON Pollutes global Dataview queries)
        C2(CON Cedes control of rendering)
        P1 --> C1
        P1 --> C2
        A1(PRO Full control of collapse and reveal behaviour)
        A2(PRO Braces essentially never occur in prose)
        P2 --> A1
        P2 --> A2
        D1([DECIDED custom brace syntax])
        P2 ==> D1
    end
    subgraph S2["I2: What occupies the first key segment"]
        I2{{What occupies the first key segment}}
        P2a[A field type such as setup with the entity as context]
        P2b[The subject entity with everything else as context]
        I2 --> P2a
        I2 --> P2b
        C2a(CON Requires a wikilink pointer to pair a setup with its payoff)
        C2b(CON Needs three case anchor dispatch and heading range scanning)
        C2c(CON Thread identity is a bare string with no note behind it)
        P2a --> C2a
        P2a --> C2b
        P2a --> C2c
        A2a(PRO A progression becomes the default reading not a special construct)
        A2b(PRO Setups and payoffs collapse into a view over the same records)
        A2c(PRO Pairing becomes grouping by entity)
        C2d(CON A subjectless field such as setup alone cannot be expressed)
        P2b --> A2a
        P2b --> A2b
        P2b --> A2c
        P2b --> C2d
        M2a(MITIGATION if a thread is worth tracking it is worth a Plot note)
        C2d --> M2a
        D2([DECIDED subject first])
        P2b ==> D2
    end
    D2 -.-> I3
    subgraph S3["I3: How are Narradin system concepts addressed without shadowing entity names"]
        I3{{How are Narradin system concepts addressed without shadowing entity names}}
        P3a[Reserved words such as outtake]
        P3b[Empty subject]
        P3c[Lozenge prefix]
        I3 --> P3a
        I3 --> P3b
        I3 --> P3c
        C3a(CON Reintroduces the type namespace that subject first just removed)
        C3b(CON Cannot distinguish an outtake pointer from any other hidden link)
        P3a --> C3a
        P3b --> C3b
        A3a(PRO Permanently collision free so new system concepts cost nothing)
        A3b(PRO Deliberately untypeable which is the whole point)
        P3c --> A3a
        P3c --> A3b
        D3([DECIDED lozenge prefix Narradin writes them authors do not])
        P3c ==> D3
    end
    subgraph S4["I4: What do the modifiers mean"]
        I4{{What do the modifiers mean}}
        P4a[Visibility only]
        P4b[Whether the value is manuscript or metadata]
        I4 --> P4a
        I4 --> P4b
        A4a(PRO An arc audit needs to distinguish written from planned from removed)
        P4b --> A4a
        D4([DECIDED plus is manuscript tilde is a note to self minus is invisible])
        P4b ==> D4
    end
    D4 -.-> I5
    subgraph S5["I5: Should modifiers still require a balance marker to disambiguate from values"]
        I5{{Should modifiers still require a balance marker to disambiguate from values}}
        P5a[Keep the balance marker]
        P5b[Drop the balance marker entirely]
        I5 --> P5a
        I5 --> P5b
        C5a(CON Three different parses of similar looking text)
        C5b(CON Ambiguous cases such as plus key equals value plus)
        P5a --> C5a
        P5a --> C5b
        A5a(PRO Simpler regex, nothing to strip)
        A5b(PRO A literal trailing plus or tilde in a value routes to frontmatter instead)
        P5b --> A5a
        P5b --> A5b
        D5([DECIDED no balance marker, superseding the balance marker table])
        P5b ==> D5
    end
    D4 -.-> I6
    subgraph S6["I6: What do the modifiers mean now that editorial threads exist"]
        I6{{What do the modifiers mean now that editorial threads exist}}
        P6a[Keep plus tilde minus, CriticMarkup aligned]
        P6b[Semantic modifiers: default, tilde note, bang internal, hash editorial]
        I6 --> P6a
        I6 --> P6b
        C6a(CON A flat visibility marker cannot express a turn and resolution thread)
        P6a --> C6a
        A6a(PRO Default case carries no visible marker, cleanest prose)
        A6b(PRO Bang reads as alert or hidden, universally)
        A6c(PRO Hash gives editorial threads their own opener instead of overloading tilde)
        P6b --> A6a
        P6b --> A6b
        P6b --> A6c
        D6([DECIDED default entity property, tilde author note, bang internal reference, hash editorial property])
        P6b ==> D6
    end
```

**D4 is superseded by D6.** The modifier set grew from three CriticMarkup-aligned
symbols (`+`/`~`/`-`) to four semantic ones (default/`~`/`!`/`#`), and editorial threads
gained a dedicated opener rather than overloading `~`. D5 removes the balance marker that
D4's original grammar required. Per §B.12, D4's node and text are left untouched above —
the trail is the value, not the current state.

**The single highest-leverage decision in the project.** Making segment 0 the subject
deleted an entire deferred subsystem, two planned providers, and roughly two hundred
lines of pairing logic from the prototype. It is worth understanding _why_: the old
grammar had no note behind a thread, so every relationship needed an explicit pointer.
Give the thread a note and the relationships become queries.

---

## B.13 Editorial Property Grammar

Editorial Properties (`{#...}`) are a distinct subsystem, not a grammar tweak on the
other three modifiers — hence their own numbered decision record rather than a fifth
fork of B.6.

```mermaid
flowchart LR
    subgraph S1["I1: How to encode editorial discussion threads"]
        I1{{How to encode editorial discussion threads, comments, and decisions}}
        P1[External log or table, YAML or separate file]
        P2[Self-contained expression, all data in hash braces]
        P3[CriticMarkup-style markup, double minus old double plus new]
        I1 --> P1
        I1 --> P2
        I1 --> P3
        C1(CON Scattered across note and external structures)
        C2(CON Requires a link table to correlate with prose)
        P1 --> C1
        P1 --> C2
        A1(PRO Vault is truth, entire discussion lives in the note)
        A2(PRO Self-contained, no references, no table)
        A3(PRO Regex-recoverable if Narradin is ever abandoned)
        A4(PRO Whitespace preserved in before slash after values)
        P2 --> A1
        P2 --> A2
        P2 --> A3
        P2 --> A4
        C3(CON Cannot span blocks)
        C4(CON Does not track discussion resolution state on its own)
        P3 --> C3
        P3 --> C4
        M1(MITIGATION for P3, add resolution markers)
        P3 --> M1
        D1([DECIDED self-contained multi-key threads with timestamps and lozenge resolution markers])
        P2 ==> D1
    end
```

**Reasoning:** The vault is the source of truth. By embedding the entire discussion (all
speakers, timestamps, comments, before/after values, resolution status) in a single
braced expression, Narradin ensures the note is intelligible in any context (raw
Markdown, external editor, after Narradin is abandoned). The trade-off is density in
source, but Narradin's UI handles all the rendering work.

---
