import { App, PluginSettingTab, Setting } from 'obsidian';
import NarradinPlugin from './main';

export interface NarradinPluginSettings {
	exampleSetting: string;
}

export const DEFAULT_SETTINGS: NarradinPluginSettings = {
	exampleSetting: 'default',
};

export class NarradinSettingTab extends PluginSettingTab {
	plugin: NarradinPlugin;

	constructor(app: App, plugin: NarradinPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Settings #1')
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder('Enter your secret')
					.setValue(this.plugin.settings.exampleSetting)
					.onChange(async (value) => {
						this.plugin.settings.exampleSetting = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
