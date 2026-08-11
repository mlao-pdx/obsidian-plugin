/**
 * `FileContentPort` — read the current raw body text for a given path.
 *
 * Layer 1/2's Entity Property parser depends on this interface, never on
 * Obsidian's `vault` directly. The adapter implementation (outside
 * `src/core`/`src/ports`) wraps `vault.read`/`vault.cachedRead`.
 *
 * Shape, not contract: no implementation lives here.
 *
 * @see docs/spec/12-architecture.md §12.1
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
