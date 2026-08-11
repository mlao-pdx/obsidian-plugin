/**
 * `MetadataPort` — resolved frontmatter/backlinks/tags for a given path.
 *
 * Layer 3's boundary-resolution and Note-Property reading depend on this
 * interface, never on Obsidian's `metadataCache` directly. The adapter
 * implementation (outside `src/core`/`src/ports`) wraps `metadataCache`.
 *
 * Shape, not contract: fields will grow as Layers 1–4 are built. No
 * implementation lives here.
 *
 * @see docs/spec/04-structural-boundaries.md §4.2
 * @see docs/spec/12-architecture.md §12.3
 * @remarks
 * This decision is unchanged from Appendix B §B.7 D2 ("Note Properties are
 * frontmatter only") — only the seam (a port interface instead of a direct
 * `metadataCache` read) is new.
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
	 *
	 * @see docs/spec/12-architecture.md §12.1
	 */
	onMetadataChanged(listener: (path: string) => void): () => void;
}
