/**
 * `LoggerPort` — developer-diagnostics logging, gated by user opt-in
 * (Settings → Diagnostics tab), never telemetry.
 *
 * `LoggerPort` ships in the production bundle and is silent by default; it
 * only writes anything once the user turns logging on.
 *
 * Core code depends on this interface, never on `obsidian`'s `Vault`/
 * `DataAdapter` directly. The adapter implementation (outside
 * `src/core`/`src/ports`) owns the enabled/level checks, formatting,
 * rotation, and the actual vault file write.
 *
 * **Redaction is the caller's responsibility.** Any `message`/`meta`
 * content built from vault content (note titles, aliases, property
 * values, body excerpts) must already be wrapped in guillemets (`«...»`)
 * by the calling code before it reaches `log()`. Structural/internal-only
 * information (timings, counts, stack traces, code paths, port/adapter
 * names) is never wrapped.
 *
 * Shape, not contract: no implementation lives here.
 *
 * @see docs/spec/appendix-a-rejected-decisions.md
 * @see docs/spec/appendix-b-notation-and-cross-cutting.md §B.16
 * @remarks
 * This is independent of `__DEV__` (`types/globals.d.ts`): `__DEV__`
 * strips code from the production bundle entirely, so it cannot help a
 * real user capture a real bug.
 *
 * Neither this interface nor its adapter inspects arguments for vault
 * content — only the caller knows which arguments are vault-derived.
 */
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error';

export interface LoggerPort {
	/**
	 * Record a diagnostic line at `level`. No-ops when diagnostic logging
	 * is disabled or `level` is below the configured threshold.
	 *
	 * @remarks
	 * Callers do not need to guard calls themselves — the check happens
	 * before any file I/O.
	 */
	log(level: LogLevel, message: string, meta?: Record<string, unknown>): void;
}
