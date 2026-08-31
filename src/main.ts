import { Plugin } from 'obsidian';
import { ObsidianLoggerAdapter } from './adapters/obsidian-logger-adapter';
import { DEFAULT_SETTINGS, type MyPluginSettings, SampleSettingTab } from './settings';

export default class MyPlugin extends Plugin {
	settings!: MyPluginSettings;
	loggerAdapter!: ObsidianLoggerAdapter;

	override async onload() {
		await this.loadSettings();

		// Wired here so it exists before any future core/service constructor
		// needs it injected; reads settings live, so no re-wiring is needed
		// when the user flips the Diagnostics toggle.
		this.loggerAdapter = new ObsidianLoggerAdapter(
			this.app,
			() => this.settings,
			this.manifest.id,
		);
		this.loggerAdapter.log('info', `${this.manifest.name} loaded`, {
			version: this.manifest.version,
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	override onunload() {
		this.loggerAdapter.log('info', `${this.manifest.name} unloaded`);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<MyPluginSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
