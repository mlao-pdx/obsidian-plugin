# Part 13: Surfaces

## Part 13: Surfaces

### 13.1 Commands

| Command                          | Effect                                                                    |
| -------------------------------- | ------------------------------------------------------------------------- |
| Insert Element / Entity          | Create a valid note for a chosen concept in the current location.         |
| Compile                          | Modal → background write to a Generated Companion.                        |
| Insert POV Shift                 | Insert `{~pov=…}` at the cursor.                                          |
| Insert Setting Shift             | Insert `{~setting=…}` at the cursor.                                      |
| Cut to Outtake                   | Move selected prose to a collection note; leave a marker. `[OPEN Q-16c]`  |
| Open Alias Manager               | Alias modal for the active Source Note.                                   |
| Run Alias Pass                   | Force an immediate full pass.                                             |
| Claim Alias Engine Ownership     | Transfer the single-writer lease to this device.                          |
| Initialise / Rebuild Alias Index | Rebuild the alias cache from vault state.                                 |
| Rebuild Narradin Index           | Full reindex of the Content Sequence, Local Scope map, and mention index. |
| Report Structure Issues          | Regenerate `_narradin/structure-issues.md`.                               |

### 13.2 Codeblocks

A single reserved fence identifier, `narradin`, whose body is **YAML** — familiar to
Obsidian users, supported by existing tooling, and extensible without inventing new fence
names. One registered processor; directives are easier to extend than fence names.

A single block may invoke several views. Full schema deferred. `[OPEN Q-5]`

### 13.3 `_narradin` Contents

| Path                            | Purpose                                                                      |
| ------------------------------- | ---------------------------------------------------------------------------- |
| `_narradin/`                    | Concept notes created by settings migration (§2.4).                          |
| `_narradin/log.md`              | Every notice Narradin has issued, plus every compile.                        |
| `_narradin/structure-issues.md` | Islands, Two Kings conflicts, orphans.                                       |
| `_narradin/conflicts.md`        | Alias ambiguities, blocked assignments, failed flushes, replacement reports. |
| `_narradin/settings-history/`   | Configuration snapshots.                                                     |

---
