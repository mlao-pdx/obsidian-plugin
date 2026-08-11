/**
 * Minimal hand-rolled stand-ins for the pieces of the `obsidian` package
 * that `src/main.ts` and `src/settings.ts` import as runtime values.
 *
 * `obsidian` ships types only (`node_modules/obsidian/package.json` has
 * `"main": ""`) — there is no real implementation to load in tests. Tests
 * substitute this module for the real one via:
 *
 * `vi.mock('obsidian', () => import('../support/mock-obsidian-app'));`
 *
 * Keep this intentionally small: cover only what `main.ts`/`settings.ts`
 * currently touch (`addRibbonIcon`, `addStatusBarItem`, `addCommand`,
 * `addSettingTab`, `registerDomEvent`, `loadData`/`saveData`, and the
 * `Modal`/`PluginSettingTab`/`Setting` constructors they call, plus
 * `normalizePath` for the logger adapter). Grow it only as those files
 * grow — do not pre-build mock surface for unused Obsidian APIs.
 */

export class Component {
	registerDomEvent(..._args: unknown[]): void {}
}

export class Plugin extends Component {
	app: unknown;
	manifest: unknown;

	constructor(app: unknown, manifest: unknown) {
		super();
		this.app = app;
		this.manifest = manifest;
	}

	addRibbonIcon(_icon: string, _title: string, _callback: (evt: MouseEvent) => unknown): unknown {
		return {};
	}

	addStatusBarItem(): { setText: (text: string) => void } {
		return { setText: () => {} };
	}

	addCommand(command: unknown): unknown {
		return command;
	}

	addSettingTab(_settingTab: unknown): void {}

	async loadData(): Promise<unknown> {
		return undefined;
	}

	async saveData(_data: unknown): Promise<void> {}
}

export class Modal {
	app: unknown;
	contentEl = {
		setText: (_text: string) => {},
		empty: () => {},
	};

	constructor(app: unknown) {
		this.app = app;
	}

	open(): void {}
	close(): void {}
}

export class Notice {
	constructor(_message?: string) {}
}

export class PluginSettingTab {
	app: unknown;
	plugin: unknown;
	containerEl = {
		empty: () => {},
		createEl: (_tag: string, _options?: unknown) => ({}),
	};

	constructor(app: unknown, plugin: unknown) {
		this.app = app;
		this.plugin = plugin;
	}
}

export class Setting {
	constructor(_containerEl: unknown) {}

	setName(_name: string): this {
		return this;
	}

	setDesc(_desc: string): this {
		return this;
	}

	addText(_configure: (component: unknown) => unknown): this {
		return this;
	}

	addToggle(configure: (component: MockToggleComponent) => unknown): this {
		configure(new MockToggleComponent());
		return this;
	}

	addDropdown(configure: (component: MockDropdownComponent) => unknown): this {
		configure(new MockDropdownComponent());
		return this;
	}

	addButton(configure: (component: MockButtonComponent) => unknown): this {
		configure(new MockButtonComponent());
		return this;
	}

	setHeading(): this {
		return this;
	}
}

/** Minimal stand-in for Obsidian's `ToggleComponent`. */
export class MockToggleComponent {
	setValue(_value: boolean): this {
		return this;
	}

	onChange(_callback: (value: boolean) => unknown): this {
		return this;
	}
}

/** Minimal stand-in for Obsidian's `DropdownComponent`. */
export class MockDropdownComponent {
	addOption(_value: string, _display: string): this {
		return this;
	}

	setValue(_value: string): this {
		return this;
	}

	setDisabled(_disabled: boolean): this {
		return this;
	}

	onChange(_callback: (value: string) => unknown): this {
		return this;
	}
}

/** Minimal stand-in for Obsidian's `ButtonComponent`. */
export class MockButtonComponent {
	setButtonText(_text: string): this {
		return this;
	}

	setWarning(): this {
		return this;
	}

	onClick(_callback: (evt: MouseEvent) => unknown): this {
		return this;
	}
}

/**
 * Minimal stand-in for Obsidian's `normalizePath`: collapses repeated
 * slashes and strips a trailing slash. Sufficient for the logger
 * adapter's path joins in tests; the real implementation additionally
 * handles Windows separators and `.`/`..` segments, which nothing here
 * exercises.
 */
export function normalizePath(path: string): string {
	return path.replace(/\/+/g, '/').replace(/\/$/, '');
}

export class MarkdownView {}
export class Editor {}
export class App {}

/** A minimal `app` value sufficient for `NarradinPlugin`'s current `onload()`. */
export function createMockApp(): unknown {
	return {
		workspace: {
			getActiveViewOfType: () => null,
		},
	};
}

/** A minimal `manifest` value sufficient to construct `NarradinPlugin`. */
export function createMockManifest(): unknown {
	return {
		id: 'narradin',
		name: 'Narradin',
		version: '0.0.0-test',
		minAppVersion: '0.0.0',
		author: 'test',
		description: 'Test manifest for smoke tests.',
	};
}
