# Player

Players are the story elements that propel the story forward, like characters, locations, objects, lore, and so on.

## Player MoC

The [Narradin](./narradin.md#narradin) settings allow configuration of zero or more [MoCs](./narradin.md#map-of-content-moc) to designate a note as a player entity by setting the [entity file property](./narradin.md#entity-file-property) as a link to one of these MoCs.

The player MoCs the user defines have no inherent order and as such are rendered on the settings in [natural order](./narradin.md#natural-order).

If the user wants multiple names for a single player MoC, then they should add aliases to the player MoC note. They can then describe how the name and alias(es) differ semantically in the body text of the note. ([Vault is truth](./principles.md#vault-is-truth))

Using players within Narradin is optional.

An example player MoC mapping:

| Name                  | Alias 1       |    Alias 2    | Alias 3  |
| --------------------- | ------------- | :-----------: | -------- |
| a primary character   | a protagonist | an antagonist | a mentor |
| a secondary charcater | a sidekick    |               |          |
| a bit player          |               |               |          |
| a location            | a room        |    a city     | a planet |
| some lore             | a religion    |    a magic    |          |

## Player scope

Player scope are all notes with the [entity file property](./narradin.md#entity-file-property) set to link to a [player MoC](#player-moc). This is the classification set — distinct from a specific Player note's own resolved [scope](./narradin.md#scope), which is that one note's individual boundary (see [Containment and inheritance](./narradin.md#containment-and-inheritance)).
