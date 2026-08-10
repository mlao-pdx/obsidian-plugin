# Part 3: Ontology

## Part 3: Ontology

Every note is classified by its `is` value into exactly one category:

1. **Narrative** — the structural spine. Five fixed folder anchors (Realm, Series, Book,
   Act, Chapter), two fixed leaf types (Heading, Scene), and any number of
   user-defined custom leaf types (§2.1). Folder anchors are always Folder Levels;
   Heading, Scene, and every custom leaf type are always Leaf Levels — there is no
   configuration surface that changes which is which.
2. **Companion** — attached content; a subsection of a host Narrative note.
3. **Player** — world entities. Scope-inheriting. May be an Entity Property subject.
4. **Plot** — structural threads. Scope-inheriting, mechanically identical to Players.
   May be an Entity Property subject.
5. **System** — Narradin's own concepts (Outtake). Addressed only through
   the lozenge namespace (§9.2).

A note with no `is`, or an unrecognised `is`, does not exist for Narradin. Authors may
scatter arbitrary notes anywhere without consequence.

**Classification is not scope membership.** This list assigns each note a permanent
ontology category; it says nothing about where that note's boundaries fall. A note keeps
its Narrative classification even when a hierarchy break removes it from Narrative Scope
— that is precisely what an Island (§4.5) is: still Narrative by `is`, no longer inside
Narrative Scope. See the full named scope taxonomy at §5.5.

---
