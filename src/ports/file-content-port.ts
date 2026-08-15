/**
 * `FileContentPort` — read the current raw body text for a given path.
 *
 * Domain logic that parses file content depends on this interface, never
 * on Obsidian's `vault` directly. The adapter implementation (outside
 * `src/core`/`src/ports`) wraps `vault.read`/`vault.cachedRead`.
 *
 * Shape, not contract: no implementation lives here.
 *
 * @remarks
 * `metadataCache` does not guarantee body text readiness, so parsing needs
 * a raw read.
 */
export interface FileContentPort {
	/**
	 * Current raw body text of `path`. Rejects if the path does not exist
	 * or is not readable as text.
	 */
	readContent(path: string): Promise<string>;
}
