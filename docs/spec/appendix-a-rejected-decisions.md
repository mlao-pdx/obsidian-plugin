# Appendix A: Design Decisions Considered and Rejected

## Appendix A: Design Decisions Considered and Rejected

Recorded so they are not relitigated.

| Decision                                            | Rejected because                                                                                            |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Hash tiebreaker in Clash Resolution                 | Effectively random ordering — worse than surrendering visibly.                                              |
| Single `narrative_index` property                   | NN rewrites `sort_index` unpredictably on drifted folder notes; two properties keep folder ordering immune. |
| Dataview inline syntax                              | Would pollute global Dataview queries and cede control of rendering.                                        |
| `-` as context separator                            | Keys are normalised against entity names that legitimately contain hyphens.                                 |
| Nested inline properties                            | A sentence serving four purposes would become unreadable. Multi-key `\|` solves it flatly.                  |
| Field-type namespace (`setup__elara`)               | Inverts to `{Elara+setup=…}` under entity-first keys, which retires an entire subsystem.                    |
| Subject-less properties (`{setup=…}`)               | If a thread is worth tracking it is worth a Plot note. Enforces Absolute Opt-In.                            |
| Making `◊` easy to type                             | The namespace guarantee _is_ the inaccessibility.                                                           |
| Wikilink-based setup→payoff pairing                 | Unnecessary once the thread is an entity; anchor dispatch and heading-range scanning disappear with it.     |
| Fractional ordinals for companion order             | A four-part Position tuple has no precision ceiling and nothing to re-derive.                               |
| Minimum alias length guard                          | Shared with the Mention Index, so a character named `Ed` would have had no progressions at all.             |
| Building CriticMarkup / track-changes               | Commentator does it well; waiting costs nothing.                                                            |
| `narradin_id` content sentinel for loop suppression | Renames carry no content; non-markdown files have no frontmatter; `vault.modify` races `metadataCache`.     |
| Exclusive Narradin ownership of `aliases`           | Would delete hand edits made in external editors.                                                           |
| Note Properties readable from the body              | Layer 3 would depend on Layer 4 to build the tree. Circular.                                                |
| Per-Realm physical database separation              | Nested Realms put a row in two at once; Realm moves would force migrations.                                 |
| Logical reattachment of out-of-order boundaries     | Would require inventing a sort position the subtree does not physically have.                               |
| Global `ledgerWatermark`                            | Incoherent once propagation was scope-bounded.                                                              |
| Durable alias UUIDs                                 | Nothing outlives propagation; array position suffices.                                                      |
| Compile insert-at-cursor                            | Editor lock-up on large compiles, and the output would be re-ingested and rewritten.                        |
| Generated-file versioning and retention             | That is git's job.                                                                                          |
| `narradin__generated` as an overwrite precondition  | Would create a second source of truth alongside `is`.                                                       |
| Edit-distance entity matching in v1                 | Would silently bind a property to the wrong entity.                                                         |
| Judging POV shifts as errors                        | Indistinguishable from omniscient narration. Count and report instead.                                      |
