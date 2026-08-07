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

**Chain:** I1 nested containment → I2 upward inheritance → I3 hierarchy violations.

```mermaid
flowchart LR
    subgraph S1["I1: Does a parent scope contain a nested boundary of equal or higher level"]
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
    end
    D1 -.-> I2
    subgraph S2["I2: Does upward scope inheritance mirror containment"]
        I2{{Does upward scope inheritance mirror containment}}
        P2a[Yes symmetric]
        P2b[No halt at the first Realm]
        I2 --> P2a
        I2 --> P2b
        C2a(CON A player in a nested Realm would see the outer Realm)
        C2b(CON Cross contamination in a multi pen name vault)
        P2a --> C2a
        P2a --> C2b
        A2a(PRO Outside looks in inside never looks out)
        P2b --> A2a
        D2([DECIDED scope is asymmetric])
        P2b ==> D2
    end
    subgraph S3["I3: What happens when hierarchy order is violated"]
        I3{{What happens when hierarchy order is violated}}
        P3a[Reattach logically to the nearest legal ancestor]
        P3b[Sever from outer traversal as an Island]
        P3c[Ignore the violation]
        I3 --> P3a
        I3 --> P3b
        I3 --> P3c
        C3a(CON Requires inventing a sort position the subtree does not physically have)
        C3b(CON Destroys the premise that the file tree is the manuscript)
        P3a --> C3a
        P3a --> C3b
        A3a(PRO Notes stay tracked and internally functional)
        A3b(PRO Reported never silently dropped)
        P3b --> A3a
        P3b --> A3b
        C3c(CON Silent structural corruption of narrative order)
        P3c --> C3c
        D3([DECIDED Islands severed outward functional inward always reported])
        P3b ==> D3
    end
```

**Why logical reattachment lost.** It sounds helpful and is quietly fatal. Narrative
order is _derived_ from physical traversal — that is what makes dragging a Book folder
reorder a manuscript. A reattached subtree has no physical position among its new
siblings, so any position assigned to it is invented, and the file tree stops predicting
the manuscript.

---
