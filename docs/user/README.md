# docs/user

A declarative, cross-linked companion to [docs/spec](../spec/README.md) — not a
replacement for it. `docs/spec` remains the engineering-authoritative source
(Architecture, Decision Records, Appendices, `@see` citations, ESLint boundary rules).
This document set exists for legibility: every term and rule here is stated once,
currently, and unambiguously, so it's easy to check "does this reflect what needs to be
built" without wading through superseded terminology or historical argumentation.

Where this document's stated behavior differs from `docs/spec`'s literal text, or where
two `docs/spec` Parts disagree with each other, the difference is logged in
[~deviations.md](./~deviations.md) rather than silently resolved.

Start at [narradin.md](./narradin.md) and follow the links.

## Files

| File                                               | Covers                                                                                                                                                                                                 |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [narradin.md](./narradin.md)                       | The plugin itself: Narradin scope, the Narradin index, Map of content notes, Folder notes and Scope Anchors, containment/inheritance, the Membrane Rule, Natural Order, Element insertion. Start here. |
| [narrative.md](./narrative.md)                     | The Narrative entity type: narrative MoCs, the narrative backbone and its traversal, Narrative Order.                                                                                                  |
| [player.md](./player.md)                           | The Player entity type and Player scope.                                                                                                                                                               |
| [plot.md](./plot.md)                               | The Plot entity type and Plot scope.                                                                                                                                                                   |
| [companion.md](./companion.md)                     | Companion notes: the MoC/suffix contract, rename sync, ordering, non-Markdown and Generated Companions.                                                                                                |
| [system.md](./system.md)                           | The System entity type and System scope.                                                                                                                                                               |
| [inline-properties.md](./inline-properties.md)     | Entity Properties, Author Notes, and Internal References (including `◊revision` revision threads); subject resolution, key normalisation, the lozenge namespace, `do_not_rename`, Position.            |
| [compiler.md](./compiler.md)                       | Compiling: trigger, Compile Scope, output, Player/Plot compilation, codeblock evaluation during compile.                                                                                               |
| [alias-manager.md](./alias-manager.md)             | The Alias Manager: tracked notes, sources of change, the application engine, scope migration, multi-device behaviour, `do_not_rename`.                                                                 |
| [surfaces.md](./surfaces.md)                       | Commands, codeblocks, and the `_narradin` system folder.                                                                                                                                               |
| [views.md](./views.md)                             | Progressions, Setups & Payoffs, cast lists, POV/setting, outtake markers, the anchor cascade, the icon registry, report chrome.                                                                        |
| [version-control.md](./version-control.md)         | Git-backed version control: tags, the scope picker, tag grammar, format-divergence Companions, restore semantics.                                                                                      |
| [principles.md](./principles.md)                   | Core operating principles.                                                                                                                                                                             |
| [third-party-plugins.md](./third-party-plugins.md) | Third-party plugins Narradin leans on, and ones considered and dismissed.                                                                                                                              |
| [~deviations.md](./~deviations.md)                 | Every place this document set's stated behavior differs from `docs/spec`'s literal text, or where `docs/spec` disagrees with itself. The primary "did this work" signal for this document set.         |
