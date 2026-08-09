import type { App, PluginManifest } from 'obsidian';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('obsidian', () => import('../support/mock-obsidian-app'));

import NarradinPlugin from '../../src/main';
import { createMockApp, createMockManifest } from '../support/mock-obsidian-app';

function createPlugin(): NarradinPlugin {
	const app = createMockApp() as App;
	const manifest = createMockManifest() as PluginManifest;
	return new NarradinPlugin(app, manifest);
}

describe('NarradinPlugin lifecycle (smoke)', () => {
	beforeEach(() => {
		// obsidian.d.ts declares `activeDocument` as an ambient global that
		// the real Obsidian host provides at runtime; `onload()` reads it
		// directly for `registerDomEvent`, and Node's test environment does
		// not define it. `window`/`activeWindow` (the usual Obsidian-safe
		// alternative) don't exist in this Node test environment either, so
		// `globalThis` is unavoidable here (test-only Node env shim, not
		// plugin runtime code).
		(globalThis as { activeDocument?: unknown }).activeDocument = {};
	});

	it('onload() does not throw', async () => {
		const plugin = createPlugin();
		await plugin.onload();
	});

	it('onunload() does not throw', async () => {
		const plugin = createPlugin();
		await plugin.onload();
		expect(() => plugin.onunload()).not.toThrow();
	});

	it('settings load with defaults when loadData() resolves undefined', async () => {
		const plugin = createPlugin();
		await plugin.onload();
		expect(plugin.settings.exampleSetting).toBe('default');
	});
});
