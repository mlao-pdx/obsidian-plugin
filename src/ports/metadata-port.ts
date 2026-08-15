/**
 * `MetadataPort` — resolved frontmatter/backlinks/tags for a given path.
 *
 * Domain logic that resolves note metadata depends on this interface,
 * never on Obsidian's `metadataCache` directly. The adapter
 * implementation (outside `src/core`/`src/ports`) wraps `metadataCache`.
 *
 * Shape, not contract: fields will grow as more of this interface's
 * consumers are built. No implementation lives here.
 */
export interface NoteMetadata {
	/** Vault-relative path this metadata describes. */
	readonly path: string;
	/** Raw frontmatter object as Obsidian's cache resolves it, if any. */
	readonly frontmatter: Record<string, unknown> | undefined;
	/** Tags present on the note, normalised without a leading `#`. */
	readonly tags: readonly string[];
	/** Paths this note resolved-links to, per Obsidian's link resolution. */
	readonly resolvedLinks: readonly string[];
	/** Paths that link to this note, per Obsidian's backlink resolution. */
	readonly backlinks: readonly string[];
}

export interface MetadataPort {
	/**
	 * Resolved metadata for `path`, or `undefined` if the path is untracked
	 * or has no cache entry yet.
	 */
	getMetadata(path: string): NoteMetadata | undefined;

	/**
	 * Subscribe to metadata changes for any tracked path. Mirrors
	 * `metadataCache.on('changed' | 'resolved')` without exposing the
	 * Obsidian event object to core.
	 */
	onMetadataChanged(listener: (path: string) => void): () => void;
}
