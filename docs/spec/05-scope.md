# Part 5: Scope

## Part 5: Scope

Scope is **asymmetric**. Two distinct operations, deliberately not mirror images.

### 5.1 Containment — outward-looking, downward

A Folder Note's scope is its **entire subtree**, including legally nested boundaries of
any level, Realms included. Nothing truncates a downward walk except an Island.

### 5.2 Inheritance — inward-looking, upward

Resolving the scope of a Player, Plot, or Companion walks **up** from its folder:

- stop at the first structural boundary — that boundary's scope is the note's scope;
- the walk **halts unconditionally at the first Realm**. It never sees a parent Realm and
  never sees a sibling;
- if no Realm is reached, the note has **no scope and is invisible to Narradin**. It is
  not global.

Organisational folders (`Characters/`, `Primary/`) carry no Folder Note and are
transparent to this walk.

**Players and Plot can never scope to a narrative leaf.** Their scope is always a
folder-level boundary. Companions can and do bind to leaves, because they bind through
`for`, not through position.

```mermaid
flowchart BT
    A[Vimes note] --> B[Primary folder]
    B --> C[Characters folder]
    C --> D[Book D folder]
    D -.-> E[Book D folder note]
    E -.-> F[Scope resolved to Book D]
    F -.-> G[Ceiling at containing Realm]
```

This makes the file explorer a functional tool: dragging a character note from
`Book 1/Characters/` to `Series/Characters/` promotes them from book-scoped to
series-scoped instantly.

### 5.3 The Membrane Rule

> The outside world looks in. The inside world does not look out. Nothing crosses into an
> Island, ever.

A _legally_ nested Realm is not a sandbox — its contents are readable and reportable from
the outer Realm. An _Island_ is fully sealed in both directions.

Writes need no separate rule: because alias propagation is bounded by the Source Note's
own scope (§10.6), an outer-Realm entity can never write into a nested Realm — its
ceiling is its own Realm.

### 5.4 Scope Is Mutable

A note's resolved scope changes when the note moves **or** when a boundary appears or
disappears above it. Both cases must be treated as scope changes; the second re-parents
many notes at once without any of them moving. This has direct consequences for pending
alias work (§10.7).

---

## Decision Record

## B.2 Scope, Islands, and the Membrane

```mermaid
flowchart TD
    I1{{Does a parent scope contain a nested boundary of equal or higher level}}
    P1[Yes containment is the full subtree]
    P2[No truncate at the first same or higher boundary]
    I1 --> P1
    I1 --> P2
    A1(PRO Matches the earlier ruling that a parent Realm encompasses a nested Realm)
    C1(CON Contradicts that same ruling)
    P1 --> A1
    P2 --> C1
    D1([DECIDED containment is the full subtree])
    P1 ==> D1
    D1 -.-> I2
    I2{{Does upward scope inheritance mirror containment}}
    P3[Yes symmetric]
    P4[No halt at the first Realm]
    I2 --> P3
    I2 --> P4
    C2(CON A player in a nested Realm would see the outer Realm)
    C3(CON Cross contamination in a multi pen name vault)
    P3 --> C2
    P3 --> C3
    A2(PRO Outside looks in inside never looks out)
    P4 --> A2
    D2([DECIDED scope is asymmetric])
    P4 ==> D2
    I3{{What happens when hierarchy order is violated}}
    P5[Reattach logically to the nearest legal ancestor]
    P6[Sever from outer traversal as an Island]
    P7[Ignore the violation]
    I3 --> P5
    I3 --> P6
    I3 --> P7
    C4(CON Requires inventing a sort position the subtree does not physically have)
    C5(CON Destroys the premise that the file tree is the manuscript)
    P5 --> C4
    P5 --> C5
    A3(PRO Notes stay tracked and internally functional)
    A4(PRO Reported never silently dropped)
    P6 --> A3
    P6 --> A4
    C6(CON Silent structural corruption of narrative order)
    P7 --> C6
    D3([DECIDED Islands severed outward functional inward always reported])
    P6 ==> D3
```

**Why logical reattachment lost.** It sounds helpful and is quietly fatal. Narrative
order is _derived_ from physical traversal — that is what makes dragging a Book folder
reorder a manuscript. A reattached subtree has no physical position among its new
siblings, so any position assigned to it is invented, and the file tree stops predicting
the manuscript.

---
