# Part 15: Open Questions

## Part 15: Open Questions

| Ref   | Question                                                                              | Blocks          |
| ----- | ------------------------------------------------------------------------------------- | --------------- |
| Q-2   | Compiler content transform: frontmatter, heading remapping, separators, CMOS toggles. | Compiler build  |
| Q-3   | Cast-list ordering detail and first-appearance linking.                               | Reporting layer |
| Q-5   | `narradin` codeblock YAML schema.                                                     | Every view      |
| Q-16c | Outtake lifecycle.                                                                    | Outtakes        |
| Q-16d | Chrome ownership when one codeblock invokes several views.                            | Rendering       |

All five are scoped inside features not yet designed. None reaches back into ingest,
indexing, traversal, scope resolution, the alias engine, or the property grammar.

---

## Decision Record

## B.11 Open Issues

Unresolved. Each is scoped inside a feature not yet designed.

```mermaid
flowchart TD
    Q2{{Compiler content transform}}
    Q3{{Cast list ordering and first appearance links}}
    Q5{{narradin codeblock YAML schema}}
    Q16c{{Outtake lifecycle}}
    Q16d{{Chrome ownership for multi view blocks}}
    B1[Blocks the compiler build]
    B2[Blocks the reporting layer]
    B3[Blocks every view]
    B4[Blocks outtakes]
    B5[Rendering choice only]
    Q2 --> B1
    Q3 --> B2
    Q5 --> B3
    Q16c --> B4
    Q16d --> B5
```

`Q-5` is the pressing one: no view in Part 16 is reachable without it.

---
