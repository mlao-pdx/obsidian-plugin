---
completion: 0%
---

# Principles

These are the core principles considered when making choices whether and how to implement features in Narradin. While these are not absolute, any deviation from them should be well-reasoned.

## Idiomatic whenever possible

Narradin is idiomatic to Obsidian's way of doing things, in particular using Obsidian preferred access and change patterns, and the official APIs. This includes using notes and their frontmatter as a user interface.

## Judge, don't sentence

Narradin cannot distinguish a craft weakness from a deliberate technique. It does not stop and wait for the user to fix or explain it. It simply communicates what is found in the vault through logging, notification, dashboard, or a combination thereof, and moves on.

## Vault is truth

All input into Narradin comes either from the vault or from the user. If Narradin is uninstalled then the only content lost are its settings.

## Embrace chaos

Narradin makes sense of the vault as-is; it does not prevent the chaos the user desires. But, the structure Narradin needs, it enforces rigidly, so that everything else can be chaotic. Like any sewage procesing plant, what comes out of Narradin depends on what is put into it.

## Opt-in first

Narradin does not read minds, nor anticipates, it only touches what it has been asked to touch.

## Read forgivingly, write critically

Narradin will match liberally when trying to gain insights from the vault. But, it is pedantic and cautious when changing the vault.

## Never Worse Than Manual

No automated write may leave the vault in a state worse than an honest manual effort would have. I.e. if a valuable process cannot be reliably rolled back, then that process is allowed to fail midway. The criteria is that the process must leave the vault in a state from which the user can finish the job themselves.
