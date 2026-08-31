# OLD NEEDS TO BE CLEANED UP

## Narradin scope

Narradin works only on folders and notes that are assigned a [[Roles|Narradin entity]].

Narradin scope are all notes that have a valid [[OLD#Entity file property|entity file property]] value. There are several entity types that together form the Narradin scope.

| Entity type                            | Description                                                            |
| -------------------------------------- | ---------------------------------------------------------------------- |
| [[Narrative#Narrative MoC\|Narrative]] | These notes are the building blocks of your stories, your narrative.   |
| [[OLDPlayer#Player MoC\|Player]]       | These notes are the components that propel your stories.               |
| [[OLDPlot#Plot MoC\|Plot]]             | These notes are the threads that weave throughout your stories.        |
| [[Companion#Companion MoC\|Companion]] | These notes are supplements tied to a Narrative, Player, or Plot note. |
| [[System#System Moc\|System]]          | These notes store information that must survive if Narradin goes away. |

[[Entity|entity]]

[[Roles|entity]]

# Map of content (MoC)

Map of contents are a generic term in the Obsidian world. [[OLD#Narradin]] classifies its notes with a link to an MoC as the value of its [[OLD#Entity file property|entity file property]].

# Natural order

This specification defines a **strict weak order** for Unicode text strings that matches Apple HFS+ file system collation, except that embedded decimal digit sequences are compared by integer value. Input strings are Unicode, normalized before comparison. **Only ASCII decimal digits** (`U+0030`–`U+0039`) are treated as numeric. The sort is **stable**: strings equal under all passes retain their original relative order.

## Tokenization

Each string is split into a maximal alternating sequence of **text tokens** (any characters containing no ASCII digit) and **numeric tokens** (maximal runs of ASCII digits), beginning with whichever type the string starts with.

| Input         | Tokens                              |
| ------------- | ----------------------------------- |
| `"file10abc"` | `"file"`, `10`, `"abc"`             |
| `"v1.2.10"`   | `"v"`, `1`, `"."`, `2`, `"."`, `10` |
| `"007"`       | `7` (one numeric token)             |
| `"42songs"`   | `42`, `"songs"`                     |

## Comparison

Tokens are compared left to right. The comparison proceeds through the following passes in strict priority order, advancing only when the current pass yields equality.

| Priority | Condition                    | Rule                                                                                                                                   |
| -------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1        | Token type mismatch          | Numeric token sorts before text token                                                                                                  |
| 2        | Both tokens numeric          | Compare by integer value; on tie, fewer leading zeros sorts first                                                                      |
| 3        | Both tokens text (primary)   | Locale-sensitive, case-insensitive, diacritic-insensitive (`kCFCompareLocalized \| kCFCompareCaseInsensitive \| kCFCompareNonliteral`) |
| 4        | Both tokens text (secondary) | Same as above but case- and diacritic-sensitive — distinguishes characters equal under pass 3                                          |
| 5        | All token pairs equal        | Fewer tokens sorts first                                                                                                               |
| 6        | All else equal               | Preserve original order (stability)                                                                                                    |

## Edge Cases

- **Leading zeros:** `"007"` and `"7"` share integer value 7; `"7"` sorts first (fewer leading zeros).
- **Version strings:** `"v1.2.9"` < `"v1.2.10"` because numeric token 9 < 10.
- **Empty string:** Treated as a single empty text token; sorts before any non-empty string.
- **Case/diacritic ties:** `"file"` vs `"File"`, and `"resume"` vs `"résumé"`, are equal at pass 3 and resolved at pass 4 per locale collation rules.

## Out of Scope

Characters that are not ASCII decimal digits — including non-ASCII digit forms (e.g., ٣ U+0663), negative signs, and decimal points — are not interpreted as numeric. Their Unicode code point values determine tokenization only: specifically, whether a character belongs to a text token or a numeric token. Once tokenized, all text token content is ordered by locale-sensitive collation weights (passes 3 and 4), not by raw code point order. Bidirectional text reordering is not applied; logical character order is used throughout.

# Scope

[[OLDProse#Narrative note|narrative note]]
A scope in [[OLD#Narradin]] is a subset of notes that reside within the vault.

## Scope boundary

A scope boundary is a folder that has a [[OLD#Folder note]] that is a [[Narrative#Narrative note|narrative note]].
