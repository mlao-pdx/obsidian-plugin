/**
 * `PersistencePort` — repository interface for the Indexer's cached state:
 * paths, ids, hierarchy, scope map, content sequence, and mention index
 * rows (§12.3).
 *
 * Layer 3's boundary-resolution (§4.2), Content Sequence traversal (§7.5),
 * and scope-map algorithms depend on this interface, never on Dexie
 * directly. This is what makes those algorithms unit-testable with an
 * in-memory fake and swappable later. The adapter implementation (outside
 * `src/core`/`src/ports`) is the Dexie/IndexedDB schema — Appendix B §B.7
 * D4 ("one database per vault") is unchanged; only the seam is new.
 *
 * Shape, not contract: row shapes will grow as Layers 1–4 are built. No
 * implementation lives here. Method names/signatures intentionally mirror
 * the Indexer's public synchronous API listed in §12.3 (`getPath`,
 * `getId`, `getContentSequence(scopeId?)`, `getScopeOwner(entityId)`,
 * `getEntitiesInScope(narrativeId, category?)`, `getPreChangeScope(id)`)
 * so the Indexer can delegate to this port directly instead of the two
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
	 * a single entity category (Player, Plot, Companion). Mirrors the
	 * Indexer's public `getEntitiesInScope(narrativeId, category?)` shape
	 * (§12.3) so the Indexer can delegate directly to this port.
	 */
	getEntitiesInScope(narrativeId: number, category?: string): readonly ScopeMapRow[];
	putScopeMap(row: ScopeMapRow): Promise<void>;
	/**
	 * The scope an entity resolved to immediately before its most recent
	 * update, used to compute `ScopeUpdated` deltas. Mirrors the Indexer's
	 * public `getPreChangeScope(id)` shape (§12.3).
	 */
	getPreChangeScope(entityId: number): ScopeMapRow | undefined;

	/**
	 * Content Sequence for `scopeId`, or for the vault-wide root sequence
	 * when omitted. Mirrors the Indexer's public
	 * `getContentSequence(scopeId?)` shape (§12.3).
	 */
	getContentSequence(scopeId?: number): ContentSequenceRow | undefined;
	putContentSequence(row: ContentSequenceRow): Promise<void>;

	getMentions(entityId: number): readonly MentionIndexRow[];
	putMention(row: MentionIndexRow): Promise<void>;
}
