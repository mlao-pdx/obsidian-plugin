# Third-party plugins

[Narradin](./narradin.md#narradin) uses third-party plugins primarily for UI integrations. It tries to leverage the Obsidian eco-system where it can and offers value. This reliance adds brittleness to Narradin so justification should be provided to warrant such dependencies.

## Notebook Navigator (NN)

[Notebook Navigator](https://github.com/johansan/notebook-navigator) (NN) is a third-party Obsidian plugin that provides a better file browser and calendar, inspired by Apple Notes, Bear, Evernote and Day One. It turns Obsidian into a fast, customizable notes browser with folders, tags, properties and shortcuts in one view. Visual previews. Full keyboard navigation. Dual-pane layout.

Narradin leans on NN for its custom file sorting UI and for adding icon and color visualizations to notes and folders that fall within the [Narradin scope](./narradin.md#narradin-scope).

Avoiding integrating of note drag-'n-drop and keyboard supported custom sorting, including slot icons and coloring within the native Obsidian file explorer `Files` warrants this integration.

## Note Toolbar (NT)

[Note Toolbar](<>) (NT) is a third-party Obsidian plugin that provides context-aware toolbars to run commands, open files or URLs, show menus, or execute Templater/JavaScript snippets. Position toolbars at the top/bottom, tab bar, floating buttons or callouts; show on text selection; includes an API for showing UI components.

Narradin leans on NT to provide topical toolbars and menus on notes that reside within the [Narradin scope](./narradin.md#narradin-scope).

Avoiding integrating a floating, context-aware toolbar, including allowing a user to customize said toolbar warrants this integration.

## Templater

[Templater](<>) is a third-party Obsidian plugin that provides dynamic templates that insert variables and function results into your notes. Run JavaScript and system commands to compute, transform, or auto-generate content inside your vault.

Narradin leans on Templater to provide templates for creating notes within the [Narradin scope](./narradin.md#narradin-scope) that the user can customize.

Avoiding creating a templating solution, including allowing a user to customize, alone might not warrant this integration. But as it is such a venerable, and ubiquitous plugin, leaning on its established track record makes more sense than developing our own.

# Dismissed third-party plugins

These third-party plugins were considered and have been dismissed.

## DataView

While extremely popular, the plugin is no longer actively maintained, has a burdensome refresh flicker, and provides insufficient inline property options.

Document Comments
