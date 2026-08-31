---
completion: 0%
---

# Properties

Narradin makes extensive use of properties to receive input from the user and to communicate with [[Obsidian Plugins#Notebook Navigator (NN)]].

These properties have plain keys that could easily have been used in the user's vault before Narradin was installed. As such each of these interface properties is configurable in the Narradin settings.

The user is responsible for resolving breaking name clashes and for aligning those property names that are used to share information with NN. The rationale is that Narradin cannot possibly know which name value should win within the semantics of the user's vault.

This is the current list of interface properties that Narradin exposes:

| Property name  | Use                                                                                    | Obsidian Plugin | Optional |
| -------------- | -------------------------------------------------------------------------------------- | --------------- | -------- |
| `background`   | Defines the background color of the folder or file slot in NN.                         | NN              | Yes      |
| `folder_index` | Defines the sort order of the folder a folder note is associated with.                 | -               | Yes      |
| `icon`         | Defines the icon of the folder or file in NN.                                          | NN              | Yes      |
| `is`           | Defines which Narradin entity the note embodies.                                       | -               | No       |
| `sort_index`   | Defines the sort order of the note among the other notes in the same folder.           | NN              | Yes      |
| `title`        | Defines alternative name for folder or file if it must deviate from the physical name. | NN              | No       |

## Role property

An entity is a type of note. There are four entities in Narradin:

1. Narrative: The notes containing prose. E.g. book, series, chapter, or scene.
2. Element: The notes describing elements that occur in prose. E.g. character, location, lore, plot, or theme.
3. Companion: The notes providing supporting documentation and work items for narrative and element entities. E.g. research, beat map, tasks, etc.
4. System: The notes that are reserved for Narradin to report things. E.g. log, health report, etc.

The entity file property of a note is the property whose value links to a valid Narradin [[Narradin#Map of content (MoC)]]. The file property's name is configured in Narradin's settings, with a default value of `is`.
