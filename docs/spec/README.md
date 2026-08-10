# Narradin: Core Functional Specification

**Target:** Obsidian, novel-writing workflow
**Status:** Core engine and Entity Property model complete. Five open items remain, all
scoped inside features not yet designed. Nothing outstanding blocks ingest, indexing,
traversal, scope resolution, the alias engine, or the property grammar.

---

## About `docs/spec/`

This directory is the functional specification for the Narradin plugin, split from the
original single-file `spec.md` into one file per top-level Part (plus the Glossary and
the two Appendices) so it can be referenced precisely — e.g. from lint rules, PR
descriptions, or commit messages.

Appendix B decision graphs are merged into their corresponding topic file; see
`appendix-b-notation-and-cross-cutting.md` for the legend and the cross-cutting
decisions (B.10, B.12) that don't map 1:1 to a single Part.

This spec is the source of truth to check against when writing/reviewing ESLint
architecture-boundary rules (e.g. `core_purity_rule` from `12-architecture.md` / Part 12).

## Contents

- [Part 0: Glossary](00-glossary.md) — Shared vocabulary for hierarchy levels, entities, scope, and the alias/property machinery.
- [Part 1: Core Design Philosophies](01-core-design-philosophies.md) — The guiding principles (e.g. Absolute Opt-In, Universal Clash Resolution) that every other Part must honor.
- [Part 2: Configuration Model](02-configuration-model.md) — Ontology, the fixed five-anchor narrative hierarchy, the universal MoC-note requirement, concept renames, icon changes, and how the remaining configuration surfaces propagate. Includes Decision Record B.17 Narrative Hierarchy Structure.
- [Part 3: Ontology](03-ontology.md) — The `is`-value categories every note is classified into.
- [Part 4: Structural Boundaries](04-structural-boundaries.md) — Boundary definition, resolution, naming, nesting, islands, and self-containment rules, over the fixed five-anchor hierarchy. Includes Decision Record B.1 Boundary Identity.
- [Part 5: Scope](05-scope.md) — Containment, inheritance, the Membrane Rule, and scope mutability, and the named Scope Taxonomy (§5.5). Includes Decision Record B.2 Scope, Islands, and the Membrane.
- [Part 6: Companions](06-companions.md) — Companion file contract, rename sync, ordering, and non-Markdown/generated companions.
- [Part 7: Hierarchy and Narrative Order](07-hierarchy-and-narrative-order.md) — The Steel Thread, traversal, directory ordering (leaves before subfolders), acceptance fixtures, and content sequence. Includes Decision Record B.3 Narrative Ordering.
- [Part 8: The Compiler](08-the-compiler.md) — Core compiler behaviour, rendering fidelity, output targets, and codeblock evaluation during compile. Includes Decision Record B.8 Compiler Output.
- [Part 9: Inline Properties](09-entity-properties.md) — Entity Properties, Author Notes, Internal References, and Editorial Properties: grammar, modifiers, subject resolution, key normalisation, context vocabulary, and Position. Includes Decision Records B.6 Inline Property Grammar, B.13 Editorial Property Grammar, and B.19 Reclassifying `pov` and `setting` Out of the Lozenge Namespace.
- [Part 10: The Alias Manager](10-the-alias-manager.md) — Note sets, `narradin__fka`, sources of change, the application engine, scope migration, and multi-device behaviour. Includes Decision Record B.4 Where the Alias Ledger Lives and B.5 Alias Replacement Safety.
- [Part 11: Element Insertion](11-element-insertion.md) — Making valid notes trivial to create under Absolute Opt-In.
- [Part 12: Architecture](12-architecture.md) — The layered event-driven pipeline (Event Catcher through Consumers/Workers), idempotent reactive handlers, the Vault-Is-Truth index-write sequencing rule, and pacing. Includes Decision Record B.7 Architecture and B.18 Self-Write Suppression Retirement.
- [Part 13: Surfaces](13-surfaces.md) — Commands, codeblocks, and `_narradin` contents exposed to the user.
- [Part 14: Deferred](14-deferred.md) — Deliberately parked features (e.g. outtake lifecycle), with reasoning preserved.
- [Part 15: Open Questions](15-open-questions.md) — Outstanding questions and what they block. Includes Decision Record B.11 Open Issues.
- [Part 16: Views](16-views.md) — Progressions, Setups & Payoffs, cast lists, POV, outtake markers, anchor cascade, icon registry, and report chrome. Includes Decision Record B.9 POV as a Positional Value.
- [Part 17: Version Control (Git)](17-version-control.md) — Vault-wide local
  versioning, the Alias Manager's back-out mechanism, the release/progress tagging
  model, the semver-based version tag grammar, and Companions for format
  divergence. Includes Decision Records B.20 Git Feature Shape, B.21 Restore
  Semantics, B.22 Author Tagging Model, and B.23 Version Tag Grammar.
- [Appendix A: Design Decisions Considered and Rejected](appendix-a-rejected-decisions.md) — Flat table of rejected designs and why, recorded so they aren't relitigated.
- [Appendix B: Notation and Cross-Cutting Decisions](appendix-b-notation-and-cross-cutting.md) — The IBIS graph legend ("Reading the graphs"), B.10 Load-Bearing Chains (decisions spanning multiple Parts), B.12 Maintaining This Appendix, and B.16 Developer Logging and Metrics.
