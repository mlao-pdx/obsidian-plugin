# Appendix B: Decision Record

IBIS graphs for every non-trivial decision in the Narradin design. Appendix A lists
_what_ was rejected; this appendix records _why_, and — more importantly — _what else
depends on it_.

## Numbering registry

Check here before assigning a new `B.N`. Every number currently in use, its title, and
the file that holds it:

| B.N  | Title                                   | File                                       |
| ---- | --------------------------------------- | ------------------------------------------ |
| B.1  | Boundary Identity                       | `04-structural-boundaries.md`              |
| B.2  | Scope, Islands, and the Membrane        | `05-scope.md`                              |
| B.3  | Narrative Ordering                      | `07-hierarchy-and-narrative-order.md`      |
| B.4  | Where the Alias Ledger Lives            | `10-the-alias-manager.md`                  |
| B.5  | Alias Replacement Safety                | `10-the-alias-manager.md`                  |
| B.6  | Inline Property Grammar                 | `09-entity-properties.md`                  |
| B.7  | Architecture                            | `12-architecture.md`                       |
| B.8  | Compiler Output                         | `08-the-compiler.md`                       |
| B.9  | POV as a Positional Value               | `16-views.md`                              |
| B.10 | Load-Bearing Chains                     | `appendix-b-notation-and-cross-cutting.md` |
| B.11 | Open Issues                             | `15-open-questions.md`                     |
| B.12 | Maintaining This Appendix               | `appendix-b-notation-and-cross-cutting.md` |
| B.13 | Editorial Property Grammar              | `09-entity-properties.md`                  |
| B.14 | RealmId Synchronization                 | `12-architecture.md`                       |
| B.15 | In-Memory Cache Ownership and Lifecycle | `12-architecture.md`                       |

**Next available number: B.16**

## Reading the graphs

| Shape           | IBIS role                                                   |
| --------------- | ----------------------------------------------------------- |
| `{{ hexagon }}` | **Issue** — a question that had to be answered              |
| `[ rectangle ]` | **Position** — a candidate answer                           |
| `( rounded )`   | **Argument** — PRO or CON, attached to a position           |
| `([ stadium ])` | **Decision** — the position taken. Reached by a thick arrow |

A dotted arrow means _this decision forced that issue to be reopened_.

**Before overturning any decision, check §B.10.** Several are load-bearing for
decisions taken later, and reversing one in isolation reintroduces a problem that was
solved elsewhere.

---

## B.10 Load-Bearing Chains

Which decisions cannot be reversed alone.

```mermaid
flowchart LR
    A1[Alias blast radius is the Source Note scope]
    A2[Global watermark is incoherent]
    A3[Watermark must be per note]
    A4[fka lives in the vault]
    A5[IndexedDB is a disposable cache]
    A6[Rebuild Index is cheap]
    A7[Multi device lease is affordable]
    A1 --> A2 --> A3 --> A4 --> A5 --> A6 --> A7
```

```mermaid
flowchart LR
    G1[Segment zero is the subject entity]
    G2[Setups and payoffs is a view not a subsystem]
    G3[No SetupPayoffProvider]
    G4[Context vocabulary carries the opens and closes roles]
    G5[Pairing is discriminator intersection]
    G6[Wikilink pointers and anchor dispatch all deleted]
    G1 --> G2 --> G3
    G1 --> G4 --> G5
    G1 --> G6
```

```mermaid
flowchart LR
    I1[is is Truth]
    I2[Boundary defined by is alone]
    I3[Name sync is cosmetic]
    I4[Folder position ignores sort index]
    I5[Narrative order is immune to name drift]
    I1 --> I2 --> I3
    I2 --> I4 --> I5
```

```mermaid
flowchart LR
    M1[Cast lists need appearance evidence not just scope]
    M2[Mention Index required]
    M3[Alias target discovery uses it too]
    M4[Minimum length guard becomes total invisibility]
    M5[Guard dropped replaced by reports]
    M1 --> M2 --> M3 --> M4 --> M5
```

```mermaid
flowchart LR
    R1[Realm is the universe of discourse]
    R2[No global scope for players]
    R3[Orphans must be reported]
    R4[Cross Realm setup payoff pairing is impossible]
    R5[That status indicator was deleted]
    R1 --> R2 --> R3
    R1 --> R4 --> R5
```

---

## B.12 Maintaining This Appendix

When a decision is revisited, **do not edit the graph in place.** Add a new Issue node
whose incoming dotted arrow comes from the decision that forced the reopening, and mark the superseded Decision node as such. The value here is the trail, not the current state — the current state is the spec.

Every entry in Appendix A should resolve to a CON node somewhere in this appendix. If it does not, the rejection was never argued and is worth re-examining.
