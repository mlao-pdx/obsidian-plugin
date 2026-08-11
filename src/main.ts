import { Editor, MarkdownView, type MarkdownFileInfo, Modal, Notice, Plugin } from 'obsidian';
import { ObsidianLoggerAdapter } from './adapters/obsidian-logger-adapter';
import { DEFAULT_SETTINGS, type NarradinPluginSettings, NarradinSettingTab } from './settings';

export default class NarradinPlugin extends Plugin {
	settings!: NarradinPluginSettings;
	loggerAdapter!: ObsidianLoggerAdapter;

	override async onload() {
		await this.loadSettings();

		// Wired here so it exists before any future core/service constructor
		// needs it injected; reads settings live, so no re-wiring is needed
		// when the user flips the Diagnostics toggle. See LoggerPort
		// (docs/spec/12-architecture.md §12.9).
		this.loggerAdapter = new ObsidianLoggerAdapter(this.app, () => this.settings);
		this.loggerAdapter.log('info', 'Narradin loaded', { version: this.manifest.version });

		// This creates an icon in the left ribbon.
		this.addRibbonIcon('dice', 'Sample', (_evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status bar text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-modal-simple',
			name: 'Open modal (simple)',
			callback: () => {
				new ExampleModal(this.app).open();
			},
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'replace-selected',
			name: 'Replace selected content',
			editorCallback: (editor: Editor, _ctx: MarkdownView | MarkdownFileInfo) => {
				editor.replaceSelection('Sample editor command');
			},
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-modal-complex',
			name: 'Open modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new ExampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
				return false;
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new NarradinSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(activeDocument, 'click', (_evt: MouseEvent) => {
			new Notice('Click');
		});
	}

	override onunload() {
		this.loggerAdapter.log('info', 'Narradin unloaded');
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<NarradinPluginSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class ExampleModal extends Modal {
	override onOpen() {
		const { contentEl } = this;
		contentEl.setText('Woah!');
	}

	override onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
