/**
 * `VaultWritePort` — batched write capability (`write`, `rename`,
 * `delete`) for the Workers (Alias Application Engine, Compiler; §12.7).
 *
 * The pending-write-set registration from §12.1 (self-write suppression)
 * is folded into the port contract itself: suppression bookkeeping must
 * happen atomically with the write, so callers never register separately
 * and then write.
 *
 * Workers depend on this port for *execution*. The *plan computation*
 * (what to rewrite, where to compile to) stays pure core logic that
 * takes/returns data; the adapter-side orchestration calls this port to
 * execute the plan. The adapter implementation (outside `src/core`/
 * `src/ports`) wraps `vault.modify`/`vault.rename`/`vault.delete` plus the
 * in-memory pending-write set — Appendix B §B.7 D1 ("pending write set
 * with a short expiry") is unchanged; only the seam is new.
 *
 * Shape, not contract: no implementation lives here.
 */
export interface PendingWrite {
	readonly op: 'write' | 'rename' | 'delete';
	readonly path: string;
	/** Present only for `op: 'rename'`. */
	readonly newPath?: string;
	/** Optional expected content hash, used for staleness checks. */
	readonly expectedHash?: string;
	/** Milliseconds until this pending-write entry expires. */
	readonly expiryMs: number;
}

/** Optional per-call overrides forwarded into the `PendingWrite` entry. */
export interface PendingWriteOptions {
	/** Forwarded to `PendingWrite.expectedHash`; see there for use. */
	readonly expectedHash?: string;
	/** Forwarded to `PendingWrite.expiryMs`; see there for use. */
	readonly expiryMs?: number;
}

export interface VaultWritePort {
	/**
	 * Overwrite `path` with `content`, registering the write in the
	 * pending-write set atomically so the resulting `vault.on('modify')`
	 * event is suppressed by Layer 1.
	 */
	write(path: string, content: string, options?: PendingWriteOptions): Promise<void>;

	/**
	 * Rename `oldPath` to `newPath`, registering the `old → new` pair
	 * atomically. This is the one case where suppression is a correctness
	 * requirement, not an optimisation (§12.1).
	 */
	rename(oldPath: string, newPath: string, options?: PendingWriteOptions): Promise<void>;

	/** Delete `path`, registering the deletion atomically. */
	delete(path: string, options?: PendingWriteOptions): Promise<void>;
}
