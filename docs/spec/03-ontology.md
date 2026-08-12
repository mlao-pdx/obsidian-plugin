# Part 3: Ontology

## Part 3: Ontology

Every note is classified by its `is` value into exactly one category:

1. **Narrative** — the structural spine. No fixed folder/leaf classification by
   category: role is **positional**, determined per-instance by whether a note is
   placed as a matching folder note (§4.1) for its folder. Realm is the sole mandatory
   anchor (§2.1, §2.2); every other Narrative concept — Series/Book/Act/Chapter-style
   concepts, Heading, Scene, and any custom concept alike — may act as a folder-level
   boundary or as a leaf note, depending purely on placement, not on which concept it
   is. `[OPEN Q-18]` whether Scene/Heading eligibility should ever be restricted is left
   open (§15).
2. **Companion** — attached content; a subsection of a host Narrative note.
3. **Player** — world entities. Scope-inheriting. May be an Entity Property subject.
4. **Plot** — structural threads. Scope-inheriting, mechanically identical to Players.
   May be an Entity Property subject.
5. **System** — Narradin's own concepts (Outtake). Addressed only through
   the lozenge namespace (§9.2).

A note with no `is`, or an unrecognised `is`, does not exist for Narradin. Authors may
scatter arbitrary notes anywhere without consequence.

**Classification is not scope membership.** This list assigns each note a permanent
ontology category; it says nothing about where that note's boundaries fall or whether it
currently governs a folder. A note's Narrative classification never changes just because
it isn't currently placed as a folder note — see the full named scope taxonomy at §5.5.

---
