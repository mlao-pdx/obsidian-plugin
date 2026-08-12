# Narradin: Core Functional Specification

**Target:** Obsidian, novel-writing workflow
**Status:** Core engine and Entity Property model complete. Nine open items remain, all
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
- [Part 2: Configuration Model](02-configuration-model.md) — Ontology, the fully generic arbitrary-depth narrative hierarchy, the folder-note filename template setting, the universal MoC-note requirement, uniform concept renames (Realm included), icon changes, and how the configuration surfaces propagate. Includes Decision Record B.17 Narrative Hierarchy Structure (reopened — generic hierarchy, Realm loses its rename-exemption).
- [Part 3: Ontology](03-ontology.md) — The `is`-value categories every note is classified into; folder/leaf role is positional, not fixed by category.
- [Part 4: Structural Boundaries](04-structural-boundaries.md) — Boundary definition (name-matched folder note required), resolution, naming, unconditional nesting, order advisories (formerly Islands), and self-containment rules, over the fully generic hierarchy. Includes Decision Record B.1 Boundary Identity (reopened — name match required; configurable filename template).
- [Part 5: Scope](05-scope.md) — Containment, inheritance, the unconditional Membrane Rule, scope mutability, and the named Scope Taxonomy (§5.5). Includes Decision Record B.2 Scope, Islands, and the Membrane (reopened — Islands retired, Realm-in-Realm nesting never severs, no bifurcation between reporting and Compile).
- [Part 6: Companions](06-companions.md) — Companion file contract, rename sync, ordering, and non-Markdown/generated companions.
- [Part 7: Hierarchy and Narrative Order](07-hierarchy-and-narrative-order.md) — The Narrative Backbone, traversal, directory ordering (leaves before subfolders), acceptance fixtures, and content sequence, now over the fully generic hierarchy. Includes Decision Record B.3 Narrative Ordering.
- [Part 8: The Compiler](08-the-compiler.md) — Core compiler behaviour, rendering fidelity, output targets, nested-Realm-crossing Compile Scope, `do_not_rename` auto-stamping on Generated Companions, and codeblock evaluation during compile. Includes Decision Record B.8 Compiler Output.
- [Part 9: Inline Properties](09-entity-properties.md) — Entity Properties, Author Notes, Internal References, and Editorial Properties: grammar, modifiers, subject resolution, key normalisation, context vocabulary, `◊status`, `do_not_rename`, and Position. Includes Decision Records B.6 Inline Property Grammar, B.13 Editorial Property Grammar, and B.19 Reclassifying `pov` and `setting` Out of the Lozenge Namespace.
- [Part 10: The Alias Manager](10-the-alias-manager.md) — Note sets, `narradin__fka`, sources of change, the application engine (blast radius parity with Compile Scope), scope migration, multi-device behaviour, and the `do_not_rename` target exemption. Includes Decision Record B.4 Where the Alias Ledger Lives, B.5 Alias Replacement Safety, and new B.24 Alias Manager / Compile Scope Parity and `do_not_rename`.
- [Part 11: Element Insertion](11-element-insertion.md) — Making valid notes trivial to create under Absolute Opt-In.
- [Part 12: Architecture](12-architecture.md) — The layered event-driven pipeline (Event Catcher through Consumers/Workers), idempotent reactive handlers, the Vault-Is-Truth index-write sequencing rule, on-demand Realm-ancestry resolution (no per-row `realmId`), the `StatusOverlayProvider`/`◊status` mechanism, and pacing. Includes Decision Record B.7 Architecture (reopened — on-demand bounded ancestor walk replaces `realmId`-equality), B.14 RealmId Synchronization (fully superseded), B.18 Self-Write Suppression Retirement, and new B.25 The Status Overlay Mechanism.
- [Part 13: Surfaces](13-surfaces.md) — Commands (including Compile's nested-Realm visibility and the new status-stack command), codeblocks, and `_narradin` contents exposed to the user.
- [Part 14: Deferred](14-deferred.md) — Deliberately parked features (e.g. outtake lifecycle), with reasoning preserved.
- [Part 15: Open Questions](15-open-questions.md) — Outstanding questions and what they block, including Scene/Heading boundary eligibility, `do_not_rename` auto-stamping scope, and status-modal guidance-text storage. Includes Decision Record B.11 Open Issues.
- [Part 16: Views](16-views.md) — Progressions, Setups & Payoffs (now with asymmetric cross-Realm pairing), cast lists, POV, outtake markers, anchor cascade, icon registry (`StatusOverlayProvider` as sole writer into status indicators), and report chrome. Includes Decision Record B.9 POV as a Positional Value.
- [Part 17: Version Control (Git)](17-version-control.md) — Vault-wide local
  versioning, the Alias Manager's back-out mechanism, the release/progress tagging
  model, the semver-based version tag grammar with a variable-length scope segment, and Companions for format
  divergence. Includes Decision Records B.20 Git Feature Shape, B.21 Restore
  Semantics, B.22 Author Tagging Model, and B.23 Version Tag Grammar.
- [Appendix A: Design Decisions Considered and Rejected](appendix-a-rejected-decisions.md) — Flat table of rejected designs and why, recorded so they aren't relitigated.
- [Appendix B: Notation and Cross-Cutting Decisions](appendix-b-notation-and-cross-cutting.md) — The IBIS graph legend ("Reading the graphs"), B.10 Load-Bearing Chains (decisions spanning multiple Parts, including the updated boundary-identity and Realm/Orphan chains), B.12 Maintaining This Appendix, and B.16 Developer Logging and Metrics.
