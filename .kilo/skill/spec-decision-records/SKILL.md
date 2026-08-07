---
name: spec-decision-records
description: How Narradin's IBIS decision-record diagrams (`## B.N` sections in docs/spec/*.md) are structured, numbered, and kept legible. Load when writing or reviewing a Decision Record section, proposing to add/revisit/overturn a design decision in docs/spec/, or checking whether a proposed change touches a load-bearing chain (§B.10).
---

# Spec decision records (IBIS diagrams)

## Legend

Authoritative source: `docs/spec/appendix-b-notation-and-cross-cutting.md` ("Reading
the graphs"). Update both if the legend ever changes.

| Shape           | IBIS role                                                         |
| --------------- | ----------------------------------------------------------------- |
| `{{ hexagon }}` | **Issue** — a question that had to be answered                    |
| `[ rectangle ]` | **Position** — a candidate answer                                 |
| `( rounded )`   | **Argument** — PRO or CON, attached to a position                 |
| `([ stadium ])` | **Decision** — the position taken. Reached by a thick `==>` arrow |

A dotted arrow (`-.->`) means _this decision forced that issue to be reopened_.

## Where records live

Decision records stay **embedded** in their topic file, inside a `## Decision Record`
section, as one or more `## B.N <Title>` subsections (e.g. `04-structural-boundaries.md`
has `## Decision Record` → `## B.1 Boundary Identity`). Each `B.N` is cross-linked from
that Part's entry in `docs/spec/README.md`'s Contents list.

**Never extract a decision record to a separate file, regardless of size.** This is an
intentional, confirmed design choice — legibility problems are handled by the
conventions below (subgraphs, orientation, chain summaries), not by moving content out
of its topic file.

## Creating a new decision record

1. Check the numbering registry at the top of
   `docs/spec/appendix-b-notation-and-cross-cutting.md` for the next available `B.N`.
2. Add `## B.N <Title>` at the end of the topic file's existing `## Decision Record`
   section (create that section, right after the file's prose, if this is the file's
   first record).
3. Write one `flowchart TD` (or `LR` if 3+ issues from the start — see orientation rule
   below) Mermaid block following the legend and ID convention below.
4. Add the chain-summary line if the diagram has 2+ Issue nodes.
5. Update the Part's entry in `docs/spec/README.md`'s Contents list to mention the new
   `B.N <Title>`.
6. Update the numbering registry table in Appendix B (new row + bump "Next available
   number").
7. If the decision is load-bearing (later decisions would break if this one were
   reversed), add or extend its chain in §B.10.
8. Cross-check: does any `CON` node correspond to a rejected alternative that belongs in
   Appendix A? Add a row there if it's missing (§B.12's cross-check rule).

## Revising an existing decision

Per §B.12: **do not edit existing nodes or edges** beyond the one permitted exception
below.

1. Add a new `subgraph` for the new Issue, continuing the Issue-scoped ID prefix (see
   below).
2. Draw a dotted arrow (`-.->`) from the old Decision node to the new Issue node.
3. **Permitted exception:** relabel the superseded Decision node in place —
   `D1([SUPERSEDED — see D6 — DECIDED ...])`. This is the only in-place edit §B.12
   allows; every other change is additive. None of the current diagrams demonstrate this
   yet, since all existing chains are forward-consequence chains, not reversals — treat
   this rule as documented but not yet exercised.
4. Re-check §B.10 — is the decision being revised part of a load-bearing chain? If so,
   flag the downstream decisions that may need re-justification before proceeding.
5. Update Appendix A if a previously-accepted position is now rejected.

## Legibility rules

Apply all of these to new and revised diagrams. `10-the-alias-manager.md`'s **B.4
(Where the Alias Ledger Lives)** is the canonical worked example — the longest chain (5
issues), retrofitted first.

1. **Chain summary line.** Immediately above any diagram with 2+ Issue nodes, add one
   plain-prose line naming the chain in order:
   `**Chain:** I1 blast radius → I2 watermark scope → I3 ledger location → I4 index role → I5 multi-device.`
   Skip this for single-issue diagrams — it adds no value there.

2. **Per-Issue `subgraph` grouping.** Wrap each Issue's cluster (its Issue node, its
   Positions, Arguments, and Decision) in a titled Mermaid `subgraph`:

   ```
   subgraph S1["I1: How wide is an alias rename allowed to reach"]
       I1{{...}}
       P1[...]
       ...
   end
   ```

   Subgraph IDs (`S1`, `S2`, ...) must be unique across the whole diagram, not just
   within one issue's cluster. Dotted "forced reopening" arrows cross subgraph
   boundaries freely in Mermaid — draw them **outside** the subgraph blocks, after the
   subgraph they originate from.

3. **Orientation.** Diagrams with 3+ issues use `flowchart LR` so the chain reads
   left-to-right like a timeline instead of growing indefinitely tall. Diagrams with 1–2
   issues keep `flowchart TD` (matches the single/double-issue examples).

4. **ID convention.** The first Issue keeps plain global IDs (`I1`, `P1`, `P2`, `C1`,
   `A1`, `D1`, `M1`, ...). Every subsequent Issue's cluster uses that issue's number as a
   prefix with a lettered suffix instead of continuing the global counter: `I2`, `P2a`,
   `P2b`, `C2a`, `A2a`, `M2a`. Decision nodes use just the issue number (`D2`) unless an
   issue has more than one Decision, in which case letter them too (`D2a`, `D2b`). This
   keeps each subgraph's contents self-describing without cross-referencing a flat
   `P1..P11` counter.

5. **Superseded-decision marking.** When a past Decision is genuinely overturned — not
   just "forced a new issue," which is the normal forward-consequence case — relabel the
   old stadium node in place: `D1([SUPERSEDED — see D6 — DECIDED ...])`. This is the one
   edit §B.12 explicitly permits alongside adding the new Issue node. No current diagram
   demonstrates this pattern; apply it only when a decision is truly reversed, not
   extended.

## Checklist

Before committing a new or revised decision record, confirm:

- [ ] Numbering checked against the Appendix B registry
- [ ] Legend shapes correct (hexagon/rectangle/rounded/stadium)
- [ ] Chain summary line present if 2+ issues
- [ ] Subgraphs present if 2+ issues, with unique IDs
- [ ] Orientation correct for issue count (`TD` for 1–2, `LR` for 3+)
- [ ] `docs/spec/README.md` Contents entry updated
- [ ] Appendix B numbering registry updated
- [ ] §B.10 (load-bearing chains) checked and updated if relevant
- [ ] Appendix A cross-checked for any newly-argued rejection
