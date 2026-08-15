# Companion

Companions are a different kind of notes in [[Narradin#Narradin|Narradin]]. They are support notes for the three main entity types [[Narrative]], [[Player]], and [[Plot]]. Their content tends to be things like scene beats, research, a settings map, planning, and so on.

## Companion MoC

The [[Narradin#Narradin|Narradin]] settings allow configuration of zero or more [[~OLD#Map of content (MoC)|MoCs]] to designate a note as a companion entity by setting the [[Narradin#entity file property|entity file property]] as a link to one of these MoCs.

The companion MoCs the user defines have no inherent order and as such are rendered on the settings in [[Narradin#natural order|natural order]].

If the user wants multiple names for a single companion MoC, then they should add aliases to the companion MoC note. They can then describe how the name and alias(es) differ semantically in the body text of the note. ([[Principles#Vault is truth|Vault is truth]])

All companion MoCs must have a non-empty suffix defined. The suffix may not contain any underscores and must consist of valid file name characters.

Using companions within Narradin is optional.

An example companion MoC mapping:

| Name          | Alias 1              | Suffix    |
| ------------- | -------------------- | --------- |
| a beat sheet  |                      | beat      |
| some research | some world building  | research  |
| a backstory   |                      | backstory |
| an review     | a developmental edit | review    |

## Companion suffix

Companion notes do not exist on their own. They are always tied to a [[Narrative]], [[Player]], or [[Plot]] note. As such a companion note has the same base name as its [[Narradin#Anchor Note|anchor note]] followed by a double underscore (`__`) and its suffix as defined in the settings. E.g. `scene__beat.md` for a beat sheet.
