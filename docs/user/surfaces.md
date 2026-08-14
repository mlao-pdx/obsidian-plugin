# Surfaces

## Commands

| Command                        | Effect                                                                                                                                                                     |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Insert Element/Entity          | See [Element insertion](./narradin.md#element-insertion).                                                                                                                  |
| Compile                        | Opens a confirmation naming the resolved scope, then writes a [Generated Companion](./companion.md#generated-companions) in the background. See [Compiler](./compiler.md). |
| Insert POV Shift               | Inserts a POV positional override at the cursor.                                                                                                                           |
| Insert Setting Shift           | Inserts a setting positional override at the cursor.                                                                                                                       |
| Cut to Outtake                 | Moves the selected prose to an outtake collection note, leaving a marker behind.                                                                                           |
| Open Alias Manager             | Opens the alias editor for the active tracked note. See [Alias Manager](./alias-manager.md#tracked-notes).                                                                 |
| Run Alias Pass                 | Forces an immediate alias pass, instead of waiting for the background schedule.                                                                                            |
| Claim Alias Engine Ownership   | Transfers the single-device lease to this device. See [Multi-device](./alias-manager.md#multi-device).                                                                     |
| Initialise/Rebuild Alias Index | Rebuilds the Alias Manager's own working index from the vault.                                                                                                             |
| Rebuild Narradin Index         | Fully reindexes the vault: every note's [scope](./narradin.md#scope), [Narrative Order](./narrative.md#narrative-order), and mentions.                                     |
| Report Structure Issues        | Regenerates the structure issues report (see [The Narradin system folder](#the-narradin-system-folder), below).                                                            |
| Show Status Stack              | Available whenever the active note carries a status alert; opens the full stack of alerts for that note.                                                                   |
| Enable/Disable Git Versioning  | Toggles whole-vault version control. Disabling while the Alias Manager is on prompts a confirmation first.                                                                 |
| Tag Release                    | Records a hand-off to an audience. See [Version control](./version-control.md#author-triggered-tags).                                                                      |
| Tag Progress                   | Records a self-declared unit of completed work. See [Version control](./version-control.md#author-triggered-tags).                                                         |
| Restore From Tag               | Restores content from a prior tag, with a preview before committing. See [Restore semantics](./version-control.md#restore-semantics).                                      |
| Compare Companions             | Shows a side-by-side diff between any two Companions of the same [anchor note](./narradin.md#anchor-note).                                                                 |

## Codeblocks

Narradin registers a single reserved codeblock. Its body configures which view or views it should render there — a cast list, a Progressions report, and so on. One block may render more than one view.

## The Narradin system folder

Narradin keeps a visible, ordinary, Obsidian-indexed folder (`_narradin` by default) for its own bookkeeping:

| Path                            | Purpose                                                                             |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| `_narradin/`                    | Map of content notes created automatically when a new concept is configured.        |
| `_narradin/log.md`              | Every notice Narradin has issued, plus a record of every compile.                   |
| `_narradin/structure-issues.md` | Orphans, plus folded-in [order advisory](./narradin.md#order-advisories) summaries. |
| `_narradin/conflicts.md`        | Alias ambiguities, blocked assignments, failed flushes, replacement reports.        |
| `_narradin/settings-history/`   | Configuration snapshots, kept before any wide-reaching settings change.             |
