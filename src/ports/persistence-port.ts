/**
 * `PersistencePort` — repository interface for the Indexer's cached state:
 * paths, ids, hierarchy, scope map, content sequence, and mention index
 * rows.
 *
 * Layer 3's boundary-resolution, Content Sequence traversal, and scope-map
 * algorithms depend on this interface, never on Dexie directly. The adapter
 * implementation (outside `src/core`/`src/ports`) is the Dexie/IndexedDB
 * schema.
 *
 * Shape, not contract: row shapes will grow as Layers 1–4 are built. No
 * implementation lives here. Method names/signatures intentionally mirror
 * the Indexer's public synchronous API (`getPath`, `getId`,
 * `getContentSequence(scopeId?)`, `getScopeOwner(entityId)`,
 * `getEntitiesInScope(narrativeId, category?)`, `getPreChangeScope(id)`).
 *
 * @see docs/spec/04-structural-boundaries.md §4.2
 * @see docs/spec/07-hierarchy-and-narrative-order.md §7.5
 * @see docs/spec/12-architecture.md §12.3
 * @remarks
 * This interface is what makes those algorithms unit-testable with an
 * in-memory fake and swappable later. Appendix B §B.7 D4 ("one database
 * per vault") is unchanged; only the seam is new.
 *
 * Method names/signatures mirror the Indexer's public API on purpose so
 * the Indexer can delegate to this port directly instead of the two
 * shapes drifting apart.
 */
export interface TrackedFileRow {
	readonly id: number;
	readonly path: string;
	readonly realmId: number;
}

export interface HierarchyRow {
	readonly id: number;
	readonly parentId: number | undefined;
	readonly realmId: number;
}

export interface ScopeMapRow {
	readonly entityId: number;
	readonly narrativeId: number;
	readonly realmId: number;
}

export interface ContentSequenceRow {
	readonly scopeId: number;
	readonly order: readonly number[];
}

export interface MentionIndexRow {
	readonly entityId: number;
	readonly sourceId: number;
	readonly kind: string;
}

export interface PersistencePort {
	getPath(id: number): string | undefined;
	getId(path: string): number | undefined;
	putTrackedFile(row: TrackedFileRow): Promise<void>;
	deleteTrackedFile(id: number): Promise<void>;

	getHierarchy(id: number): HierarchyRow | undefined;
	putHierarchy(row: HierarchyRow): Promise<void>;

	getScopeOwner(entityId: number): ScopeMapRow | undefined;
	/**
	 * Entities resolving into `narrativeId`'s scope, optionally filtered to
	 * a single entity category (Player, Plot, Companion).
	 *
	 * @see docs/spec/12-architecture.md §12.3
	 * @remarks
	 * Mirrors the Indexer's public
	 * `getEntitiesInScope(narrativeId, category?)` shape so the Indexer
	 * can delegate directly to this port.
	 */
	getEntitiesInScope(narrativeId: number, category?: string): readonly ScopeMapRow[];
	putScopeMap(row: ScopeMapRow): Promise<void>;
	/**
	 * The scope an entity resolved to immediately before its most recent
	 * update, used to compute `ScopeUpdated` deltas. Mirrors the Indexer's
	 * public `getPreChangeScope(id)` shape.
	 *
	 * @see docs/spec/12-architecture.md §12.3
	 */
	getPreChangeScope(entityId: number): ScopeMapRow | undefined;

	/**
	 * Content Sequence for `scopeId`, or for the vault-wide root sequence
	 * when omitted. Mirrors the Indexer's public
	 * `getContentSequence(scopeId?)` shape.
	 *
	 * @see docs/spec/12-architecture.md §12.3
	 */
	getContentSequence(scopeId?: number): ContentSequenceRow | undefined;
	putContentSequence(row: ContentSequenceRow): Promise<void>;

	getMentions(entityId: number): readonly MentionIndexRow[];
	putMention(row: MentionIndexRow): Promise<void>;
}
