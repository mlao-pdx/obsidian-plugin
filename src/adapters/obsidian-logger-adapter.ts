import { App, Notice, normalizePath } from 'obsidian';
import type { LoggerPort, LogLevel } from '@ports/logger-port';
import { formatLogLine, shouldLog } from './logger-format';

/**
 * Default `_narradin` folder path.
 *
 * @see docs/spec/02-configuration-model.md §2.3
 * @remarks
 * The Configuration Model's full settings (Part 2) are not built yet, so
 * this is a constant rather than a read of a user setting; once that
 * settings surface exists, wire it through here instead of hardcoding.
 */
const DEFAULT_NARRADIN_FOLDER = '_narradin';
const LOGS_SUBFOLDER = 'logs';
const LOG_FILE_NAME = 'narradin.log';
const BACKUP_FILE_NAME = 'narradin.log.1';

/** Rotation cap, per the Developer Logging & Metrics plan Decision 3. */
const ROTATION_CAP_BYTES = 5 * 1024 * 1024;

export interface ObsidianLoggerSettings {
	readonly loggingEnabled: boolean;
	readonly logLevel: LogLevel;
}

/**
 * Obsidian-backed `LoggerPort` adapter. Owns the enabled/level checks,
 * formatting, single-backup rotation, and the vault file writes — via
 * `Vault.adapter` (`DataAdapter`), not `Vault.create`/`Vault.modify`.
 *
 * Redaction of vault-derived content is the *caller's* responsibility (see
 * `LoggerPort`); this adapter never inspects `message`/`meta` for vault
 * content.
 *
 * @see docs/spec/appendix-b-notation-and-cross-cutting.md §B.16
 * @remarks
 * Writing via `Vault.adapter` instead of `Vault.create`/`Vault.modify`
 * means the plain-text log file never triggers a `vault.on('modify')`
 * event or gets treated as an indexed note.
 */
export class ObsidianLoggerAdapter implements LoggerPort {
	private readonly logsFolderPath: string;
	private readonly logPath: string;
	private readonly backupPath: string;

	/**
	 * Serializes `writeLine()` calls so concurrent `log()` calls can never
	 * race on rotation.
	 *
	 * @remarks
	 * E.g. two calls both seeing the file at/over the cap and both calling
	 * `rotate()`, where the second `rename()` targets a file the first
	 * already moved away.
	 */
	private writeQueue: Promise<void> = Promise.resolve();

	constructor(
		private readonly app: App,
		/**
		 * Live settings accessor.
		 *
		 * @remarks
		 * Read so that settings changes take effect on the next call
		 * without needing to re-wire this adapter.
		 */
		private readonly getSettings: () => ObsidianLoggerSettings,
		narradinFolder: string = DEFAULT_NARRADIN_FOLDER,
	) {
		this.logsFolderPath = normalizePath(`${narradinFolder}/${LOGS_SUBFOLDER}`);
		this.logPath = normalizePath(`${this.logsFolderPath}/${LOG_FILE_NAME}`);
		this.backupPath = normalizePath(`${this.logsFolderPath}/${BACKUP_FILE_NAME}`);
	}

	log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
		const settings = this.getSettings();
		// No I/O at all below the configured threshold or while disabled —
		// this check must happen before any file access, not after.
		if (!settings.loggingEnabled || !shouldLog(settings.logLevel, level)) {
			return;
		}
		const line = formatLogLine(new Date().toISOString(), level, message, meta);
		// log() is synchronous by LoggerPort's contract; the write itself is
		// fire-and-forget. A logging failure must never throw into the
		// caller or surface to the user — that would make diagnostics
		// riskier to call than not logging at all. Chaining onto writeQueue
		// (rather than calling writeLine directly) serializes writes so two
		// near-simultaneous calls can never both observe the rotation cap
		// and race on rotate().
		this.writeQueue = this.writeQueue.then(() => this.writeLine(line)).catch(() => {});
	}

	private async writeLine(line: string): Promise<void> {
		const adapter = this.app.vault.adapter;
		if (!(await adapter.exists(this.logsFolderPath))) {
			await adapter.mkdir(this.logsFolderPath);
		}
		if (await adapter.exists(this.logPath)) {
			const stat = await adapter.stat(this.logPath);
			if (stat && stat.size >= ROTATION_CAP_BYTES) {
				await this.rotate();
			}
		}
		if (await adapter.exists(this.logPath)) {
			await adapter.append(this.logPath, line);
		} else {
			await adapter.write(this.logPath, line);
		}
	}

	/** Rotates `narradin.log` to `narradin.log.1`, overwriting any prior backup. */
	private async rotate(): Promise<void> {
		const adapter = this.app.vault.adapter;
		if (await adapter.exists(this.backupPath)) {
			await adapter.remove(this.backupPath);
		}
		await adapter.rename(this.logPath, this.backupPath);
	}

	/** Deletes `narradin.log` and `narradin.log.1`, if present. */
	async clearLogs(): Promise<void> {
		const adapter = this.app.vault.adapter;
		if (await adapter.exists(this.logPath)) {
			await adapter.remove(this.logPath);
		}
		if (await adapter.exists(this.backupPath)) {
			await adapter.remove(this.backupPath);
		}
	}

	/**
	 * Reveals `<_narradin>/logs/` in Obsidian's file explorer. Falls back to
	 * a `Notice` stating the path when the folder does not exist yet (no
	 * log has been written) or when the file-explorer view is unavailable.
	 */
	async revealLogFolder(): Promise<void> {
		const folder = this.app.vault.getAbstractFileByPath(this.logsFolderPath);
		if (!folder) {
			new Notice(
				'No log folder yet — enable logging in settings and trigger an action first.',
			);
			return;
		}
		const fileExplorerLeaf = this.app.workspace.getLeavesOfType('file-explorer')[0];
		const view = fileExplorerLeaf?.view as unknown as
			{ revealInFolder?: (file: typeof folder) => void } | undefined;
		if (fileExplorerLeaf && view?.revealInFolder) {
			await this.app.workspace.revealLeaf(fileExplorerLeaf);
			view.revealInFolder(folder);
		} else {
			new Notice(`Log folder: ${this.logsFolderPath}`);
		}
	}
}
