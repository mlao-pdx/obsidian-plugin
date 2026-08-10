---
name: obsidian-plugin-patterns
description: Common Obsidian plugin code patterns (file organization, adding commands, persisting settings, registering listeners safely) and UI copy/UX guidelines for this project. Load when writing or reviewing plugin source code or user-facing strings.
---

# Obsidian plugin patterns

## Example file structure

    src/
      main.ts           # Plugin entry point, lifecycle management
      settings.ts        # Settings interface and defaults
      commands/           # Command implementations
        command1.ts
        command2.ts
      ui/                 # UI components, modals, views
        modal.ts
        view.ts
      utils/              # Utility functions, helpers
        helpers.ts
        constants.ts
      types.ts             # TypeScript interfaces and types

## Organize code across multiple files

**main.ts** (minimal, lifecycle only):

```ts
import { Plugin } from 'obsidian';
import { MySettings, DEFAULT_SETTINGS } from './settings';
import { registerCommands } from './commands';

export default class MyPlugin extends Plugin {
	settings!: MySettings;

	async onload() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<MySettings>,
		);
		registerCommands(this);
	}
}
```

**settings.ts**:

```ts
export interface MySettings {
	enabled: boolean;
	apiKey: string;
}

export const DEFAULT_SETTINGS: MySettings = {
	enabled: true,
	apiKey: '',
};
```

**commands/index.ts**:

```ts
import { Plugin } from 'obsidian';
import { doSomething } from './my-command';

export function registerCommands(plugin: Plugin) {
	plugin.addCommand({
		id: 'do-something',
		name: 'Do something',
		callback: () => doSomething(plugin),
	});
}
```

## Add a command

```ts
this.addCommand({
	id: 'your-command-id',
	name: 'Do the thing',
	callback: () => this.doTheThing(),
});
```

## Persist settings

```ts
interface MySettings { enabled: boolean }
const DEFAULT_SETTINGS: MySettings = { enabled: true };

async onload() {
  this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<MySettings>);
  await this.saveData(this.settings);
}
```

## Register listeners safely

```ts
this.registerEvent(
	this.app.workspace.on('file-open', (f) => {
		/* ... */
	}),
);
this.registerDomEvent(activeWindow, 'resize', () => {
	/* ... */
});
this.registerInterval(
	window.setInterval(() => {
		/* ... */
	}, 1000),
);
```

## Vault read/write & frontmatter API

Source: `https://docs.obsidian.md/Plugins/Vault`,
`https://docs.obsidian.md/Reference/TypeScript+API/FileManager/processFrontMatter`.

```ts
// Read: cachedRead() for display-only, read() before a write-back.
const text = await vault.cachedRead(file);

// Modify: prefer process() — read+write is atomic, avoids stale overwrites.
await vault.process(file, (data) => data.replace(':)', '🙂'));

// Frontmatter: never touch it via vault.modify(). Always use the
// dedicated frontmatter API (project constraint `frontmatter_write_api_only`).
await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
	frontmatter['key1'] = value;
	delete frontmatter['key2'];
});
```

- `cachedRead()` vs `read()`: identical except when a file changed on disk from
  outside Obsidian moments before the read — `read()` always gets the latest
  bytes, `cachedRead()` may briefly lag.
- `vault.modify()` overwrites unconditionally; `vault.process()` wraps
  read+modify+write and guards against the file changing in between — prefer
  `process()` over manual `read()`/`modify()` pairs.
- `processFrontMatter()` reads, mutates, and saves frontmatter atomically via a
  synchronous callback that mutates the passed object directly; it throws
  `YAMLParseError` on malformed frontmatter — callers must handle it.
- `delete()` removes a file without a trace; `trash()` moves it to the system
  or vault `.trash` — prefer `trash()` when the user should be able to change
  their mind.

## Metadata cache & events

Source: `https://docs.obsidian.md/Plugins/Events`, `https://docs.obsidian.md/Plugins/Vault`.

```ts
this.registerEvent(
	this.app.metadataCache.on('changed', (file) => {
		/* frontmatter/links/tags for `file` were re-resolved */
	}),
);
this.registerEvent(
	this.app.metadataCache.on('resolved', () => {
		/* the initial resolve pass across the vault completed */
	}),
);
this.registerEvent(this.app.vault.on('create', (file) => {}));
this.registerEvent(this.app.vault.on('modify', (file) => {}));
this.registerEvent(this.app.vault.on('delete', (file) => {}));
this.registerEvent(this.app.vault.on('rename', (file, oldPath) => {}));
```

- Every listener above must go through `registerEvent()` (never a bare
  `.on()`), so it is detached automatically on unload — see "Register
  listeners safely" above.
- `vault.on('create')` fires once per file during Obsidian's own vault-scan
  startup — gate any reaction on `workspace.layoutReady`, or register the
  handler inside `onLayoutReady()` (see load-time pitfalls below), or it will
  fire for every pre-existing file in the vault on cold start.
- `metadataCache.getFileCache(file)` is the synchronous read side (frontmatter,
  tags, resolved/unresolved links) that the `changed`/`resolved` events
  signal has updated — this is what a `MetadataPort` adapter wraps.

## Plugin lifecycle / load-time

Source: `https://docs.obsidian.md/plugins/guides/load-time`,
`https://docs.obsidian.md/plugins/guides/lifecycle-management`.

```ts
export default class MyPlugin extends Plugin {
	async onload() {
		// Cheap only: command/view-type registrations, no data fetching.
		this.addCommand({ id: 'x', name: 'X', callback: () => {} });

		this.app.workspace.onLayoutReady(() => {
			// Anything that reacts to vault state (e.g. vault.on('create'))
			// or does real work belongs here, deferred until after startup.
			this.registerEvent(this.app.vault.on('create', this.onCreate, this));
		});
	}
}
```

- Obsidian loads every plugin before the user can interact with the app —
  slow `onload()` directly delays app startup for the user.
- Ship a production/minified build (`main.js`); do not ship a dev build.
- Resources created during `onload()` (or later) must be cleaned up in
  `onunload()` — global/window listeners, intervals, external connections,
  third-party library instances. Anything registered through `this.register*`
  is handled automatically; anything else needs an explicit `onunload()`.
- Prefer composing plugin logic as `Component` subclasses (`addChild()`) over
  ad-hoc fields — child components unload automatically when their parent
  unloads, so ownership and teardown order stay correct without manual wiring.

## Notebook Navigator / Templater compatibility

No new fetch needed here — the contract already lives in spec prose; don't
re-derive it, cross-reference it:

- **`sort_index` / `folder_index`** (Notebook Navigator manual-sort
  compatibility): `docs/spec/02-configuration-model.md` §2.3,
  `docs/spec/04-structural-boundaries.md` §4.3,
  `docs/spec/07-hierarchy-and-narrative-order.md` §7.3.
- **Templater** (template-based element insertion): `docs/spec/11-element-insertion.md` §11.

> ⚠️ **Spec-drift flag, not yet resolved.** The spec's `sort_index` contract
> describes Notebook Navigator writing a `sort_index` frontmatter property per
> file during drag-and-drop manual sort (interpolating/renumbering into the
> ~1000 range, treating `0` as null). Notebook Navigator's _current_ own docs
> (README, FAQ, `docs/storage-architecture.md`, `docs/metadata-pipeline.md`,
> `docs/api-reference.md` as of their "Updated: July 2026" revision) describe
> manual/custom sort as a per-folder **sort-mode override** stored in NN's own
> settings/local-storage (`folderSortOverrides`), not a `sort_index`
> frontmatter key written to individual notes — and none of the fetched pages
> mention `sort_index` at all. This may mean the spec is describing an older
> NN version's behavior. Do not silently resolve this: treat it as an open
> spec question and confirm against a live Notebook Navigator install before
> relying on the exact `sort_index` mechanics in `07-hierarchy-and-narrative-order.md`.

## UX & copy guidelines (for UI text, commands, settings)

- Prefer sentence case for headings, buttons, and titles.
- Use clear, action-oriented imperatives in step-by-step copy.
- Use **bold** to indicate literal UI labels. Prefer "select" for interactions.
- Use arrow notation for navigation: **Settings → Community plugins**.
- Keep in-app strings short, consistent, and free of jargon.
