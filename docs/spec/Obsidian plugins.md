---
completion: 0%
---

# Obsidian Plugins

Aside from Obsidian's own (core) plugins, there is a marketplace with third-party plugins, some of which have overlkapping functionality with Narradin.

## Integration plugins

These plugins have functionality that is desired for Narradin, and the decision was made that it was better to lean on these plugins than developing the functionality within Narradin.

### Notebook Navigator

[Notebook Navigator](https://community.obsidian.md/plugins/notebook-navigator) (NN) is a third-party Obsidian plugin that provides a better file browser and calendar, inspired by Apple Notes, Bear, Evernote and Day One. It turns Obsidian into a fast, customizable notes browser with folders, tags, properties and shortcuts in one view. Visual previews. Full keyboard navigation. Dual-pane layout.

Narradin leans on NN for its custom file sorting UI and for adding icon and color visualizations for its notes and folders.

#### Rationale

Creating a note drag-'n-drop and keyboard supported custom sorting, including slot icons and coloring, within the native Obsidian file explorer `Files` would have been duplicative work.

### Note Toolbar

[Note Toolbar](https://community.obsidian.md/plugins/note-toolbar) (NT) is a third-party Obsidian plugin that provides context-aware toolbars to run commands, open files or URLs, show menus, or execute Templater/JavaScript snippets. Position toolbars at the top/bottom, tab bar, floating buttons or callouts; show on text selection; includes an API for showing UI components.

Narradin leans on NT to provide topical toolbars and menus for its notes.

#### Rationale

Creatingg a floating, context-aware toolbar, including allowing a user to customize said toolbar would have been duplicative work.

### Templater

[Templater](https://community.obsidian.md/plugins/templater-obsidian) is a third-party Obsidian plugin that provides dynamic templates that insert variables and function results into your notes. Run JavaScript and system commands to compute, transform, or auto-generate content inside your vault.

Narradin leans on Templater to provide templates for creating its notes, and that the user can customize.

#### Rationale

Creating a templating solution, including allowing a user to customize said templates would have been too much work. The Caution score on Review is due to its use of `eval`. This is understadable and ties in to the UserScript functionality it offers. Given that Narradin does not intent to use this, and Templater is such a venerable, and ubiquitous plugin, leaning on its established track record makes more sense than developing our templating.

## Dismissed plugins

These third-party plugins were considered for functionality overlaps, but have been dismissed.

### DataView

While extremely popular, the [Dataview](https://community.obsidian.md/plugins/dataview) plugin was dismissed as an alternative for the inline property feature.

#### Rationale

DataView is no longer actively maintained, has a Review score of Risk, a burdensome refresh flicker, and provides insufficient inline property rendering options to meet Narradin's needs.
