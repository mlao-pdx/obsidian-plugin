---
completion: 0%
---

# Natural order

This specification defines a **strict weak order** for Unicode text strings that matches Apple HFS+ file system collation, except that embedded decimal digit sequences are compared by integer value. Input strings are Unicode, normalized before comparison. **Only ASCII decimal digits** (`U+0030`–`U+0039`) are treated as numeric. The sort is **stable**: strings equal under all passes retain their original relative order.

## Pre-processing

Each input string is prepared in two steps before tokenization and comparison.

### Normalization

Each string is normalized to **NFC** (Unicode Canonical Decomposition followed by Canonical Composition, per UAX #15). This NFC form is the string used for all subsequent steps, including tokenization.

### Case Folding

For the purpose of pass 3 (primary text comparison), each text token is additionally processed by **Unicode full case folding** (as defined in `CaseFolding.txt`, using the default `F` mappings). This mapping is applied only for the purpose of weight derivation in pass 3; it does not alter the stored or displayed strings, and it does not affect tokenization boundaries. Full case folding handles one-to-many expansions such as `ß` → `ss`, `ﬁ` → `fi`, and `K` (Kelvin sign, U+212A) → `k`. Case folding is applied **after** tokenization and only within text tokens; ASCII digits (`U+0030`–`U+0039`) are not subject to case folding.

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

| Priority | Condition                    | Rule                                                                                                                                                                                                                                                                                                |
| -------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1        | Token type mismatch          | Numeric token sorts before text token                                                                                                                                                                                                                                                               |
| 2        | Both tokens numeric          | Compare by integer value; on tie, fewer leading zeros sorts first                                                                                                                                                                                                                                   |
| 3        | Both tokens text (primary)   | Locale-sensitive, case-insensitive, diacritic-insensitive (`kCFCompareLocalized \| kCFCompareCaseInsensitive \| kCFCompareNonliteral`). Unicode full case folding is applied before weight computation, so one-to-many expansions (e.g. `ß` = `ss`, `ﬁ` = `fi`) are treated as primary equivalents. |
| 4        | Both tokens text (secondary) | Same as above but case- and diacritic-sensitive — distinguishes characters equal under pass 3                                                                                                                                                                                                       |
| 5        | All token pairs equal        | Fewer tokens sorts first                                                                                                                                                                                                                                                                            |
| 6        | All else equal               | Preserve original order (stability)                                                                                                                                                                                                                                                                 |

## Edge Cases

- **Leading zeros:** `"007"` and `"7"` share integer value 7; `"7"` sorts first (fewer leading zeros).
- **Version strings:** `"v1.2.9"` < `"v1.2.10"` because numeric token 9 < 10.
- **Empty string:** Treated as a single empty text token; sorts before any non-empty string.
- **Case/diacritic ties:** `"file"` vs `"File"`, and `"resume"` vs `"résumé"`, are equal at pass 3 and resolved at pass 4 per locale collation rules.
- **Case folding expansions:** Characters that case-fold to multiple code points under Unicode full case folding — such as `ß` (U+00DF) → `ss`, `ﬁ` (U+FB01) → `fi`, or `ẞ` (U+1E9E) → `ss` — are treated as primary equivalents at pass 3. They are resolved at pass 4 by locale-sensitive case- and diacritic-sensitive collation. For example, `"Straße"` and `"Strasse"` are equal at pass 3 and distinguished (if at all) only at pass 4.

## Out of Scope

Characters that are not ASCII decimal digits — including non-ASCII digit forms (e.g., ٣ U+0663), negative signs, and decimal points — are not interpreted as numeric. Their Unicode code point values determine tokenization only: specifically, whether a character belongs to a text token or a numeric token. Once tokenized, all text token content is ordered by locale-sensitive collation weights (passes 3 and 4), not by raw code point order. Bidirectional text reordering is not applied; logical character order is used throughout.
