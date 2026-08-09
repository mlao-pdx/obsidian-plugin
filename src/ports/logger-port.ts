/**
 * `LoggerPort` — developer-diagnostics logging, gated by user opt-in
 * (Settings → Diagnostics tab), never telemetry (see
 * `docs/spec/appendix-a-rejected-decisions.md`).
 *
 * This is independent of `__DEV__` (`types/globals.d.ts`): `__DEV__` strips
 * code from the production bundle entirely, so it cannot help a real user
 * capture a real bug. `LoggerPort` ships in the production bundle and is
 * silent by default; it only writes anything once the user turns logging on.
 *
 * Core code depends on this interface, never on `obsidian`'s `Vault`/
 * `DataAdapter` directly. The adapter implementation (outside
 * `src/core`/`src/ports`) owns the enabled/level checks, formatting,
 * rotation, and the actual vault file write — see Decision Record B.16.
 *
 * **Redaction is the caller's responsibility.** Any `message`/`meta`
 * content built from vault content (note titles, aliases, property
 * values, body excerpts) must already be wrapped in guillemets (`«...»`)
 * by the calling code before it reaches `log()`. Neither this interface
 * nor its adapter inspects arguments for vault content — only the caller
 * knows which arguments are vault-derived. Structural/internal-only
 * information (timings, counts, stack traces, code paths, port/adapter
 * names) is never wrapped.
 *
 * Shape, not contract: no implementation lives here.
 */
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error';

export interface LoggerPort {
	/**
	 * Record a diagnostic line at `level`. No-ops when diagnostic logging
	 * is disabled or `level` is below the configured threshold — callers
	 * do not need to guard calls themselves, and the check happens before
	 * any file I/O.
	 */
	log(level: LogLevel, message: string, meta?: Record<string, unknown>): void;
}
