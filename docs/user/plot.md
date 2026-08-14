# Plot

Plots are the threads that weave throughout your stories, like plot lines, themes, character arcs, and other threads like long running gags.

## Plot MoC

The [Narradin](./narradin.md#narradin) settings allow configuration of zero or more [MoCs](./narradin.md#map-of-content-moc) to designate a note as a plot entity by setting the [entity file property](./narradin.md#entity-file-property) as a link to one of these MoCs.

The plot MoCs the user defines have no inherent order and as such are rendered on the settings in [natural order](./narradin.md#natural-order).

If the user wants multiple names for a single plot MoC, then they should add aliases to the plot MoC note. They can then describe how the name and alias(es) differ semantically in the body text of the note. ([Vault is truth](./principles.md#vault-is-truth))

Using plots within Narradin is optional.

An example plot MoC mapping:

| Name     | Alias 1         |    Alias 2    |
| -------- | --------------- | :-----------: |
| a plot   | a subplot       | a throughline |
| an arc   | a character arc |               |
| a theme  |                 |               |
| a thread |                 |               |

## Plot scope

Plot scope are all notes with the [entity file property](./narradin.md#entity-file-property) set to link to a [plot MoC](#plot-moc). This is the classification set — distinct from a specific Plot note's own resolved [scope](./narradin.md#scope), which is that one note's individual boundary (see [Containment and inheritance](./narradin.md#containment-and-inheritance)).
