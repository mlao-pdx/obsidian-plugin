# System

System notes hold Narradin's own concepts — information that must survive even if Narradin itself goes away. The System entity type is addressed only through the lozenge namespace: a System concept's name is always `◊`-prefixed (e.g. `◊outtake`), never typed by the author.

## System MoC

The only System concept Narradin ships today is Outtake — the concept a note declares when Narradin cuts content out of the narrative flow but keeps it in the vault. Unlike [Narrative](./narrative.md), [Player](./player.md), [Plot](./plot.md), and [Companion](./companion.md) MoCs, System concepts are not user-configurable: an author never adds, renames, or removes one — Narradin owns the lozenge namespace outright ([Vault is truth](./principles.md#vault-is-truth)).

A hand-typed lozenge property is still honoured if it happens to match a configured System concept ([Read forgivingly, write critically](./principles.md#read-forgivingly-write-critically)), but Narradin itself only ever writes these values as a side effect of a command (e.g. Cut to Outtake) or an explicit author decision it is already recording.

## System Scope

Narradin Scope notes with a valid System-category [entity file property](./narradin.md#entity-file-property) value form the System Scope. This is a classification only: System notes are not subject to [scope](./narradin.md#scope) containment or inheritance the way [Player](./player.md) and [Plot](./plot.md) notes are.
