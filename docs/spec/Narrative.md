# Narrative

Narrative is the text that conveys the story to the reader/listener.

## Narrative MoC

The [[Narradin#Narradin|Narradin]] settings allow configuration of one or more [[~OLD#Map of content (MoC)|MoCs]] to designate a note as a narrative entity by setting the [[Narradin#entity file property|entity file property]] as a link to one of these MoCs.

The narrative MoCs the user defines are ordered, and the user can change that order. The first narrative MoC is deemed the root level for Narradin, using zero-based indexing which identifies a narrative MoC's level.

If the user wants multiple names for a single level, then they should add aliases to the MoC note. They can then describe how the name and alias(es) differ semantically in the body text of the note. ([[Principles#Vault is truth|Vault is truth]])

There must always be at least one narrative MoC configured.

An example narrative MoC mapping:

| Index         | Name                | Alias      | Default |
| ------------- | ------------------- | ---------- | ------- |
| 0 (mandatory) | a story realm       | a world    | a realm |
| 1             | a series            | a season   |         |
| 2             | a book              | an episode |         |
| 3             | an act / a chapter  |            |         |
| 4             | a heading / a scene |            |         |

## Narrative note

A narrative note is a note that has the [[Narradin#entity file property|entity file property]] set to link to a [[#Narrative MoC|narrative MoC]]. These notes are the building blocks that tell your stories, your narrative.

## Narrative scope

A narrative [[Narradin#scope|scope]] are all the notes and subfolders that reside with the folder, identified by a [[#narrative note]] that is its [[Narradin#folder note|folder note]].
