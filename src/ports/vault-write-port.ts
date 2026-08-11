/**
 * `VaultWritePort` — batched write capability (`write`, `rename`,
 * `delete`) for the Workers (Alias Application Engine, Compiler).
 *
 * Workers depend on this port for *execution*. The *plan computation*
 * (what to rewrite, where to compile to) stays pure core logic that
 * takes/returns data; the adapter-side orchestration calls this port to
 * execute the plan. The adapter implementation (outside `src/core`/
 * `src/ports`) wraps `vault.modify`/`vault.rename`/`vault.delete` plus the
 * in-memory pending-write set described by `PendingWrite` below.
 *
 * Shape, not contract: no implementation lives here.
 *
 * @see docs/spec/12-architecture.md §12.7
 * @remarks
 * (spec-change, 2026-08-10) FLAGGED: this interface's `PendingWrite`/
 * `PendingWriteOptions` shapes still describe the pending-write-set
 * suppression design that Decision Record B.18 retired in full. Needs a
 * follow-up pass to reconcile the port shape with the idempotent
 * check-then-act model (§12.1) — not fixed here, this file was touched
 * only to add TSDoc structure to its existing prose.
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
	 *
	 * @remarks
	 * See the FLAGGED entry on this file's top-level `@remarks` — this
	 * suppression-based behavior is not being presented here as
	 * spec-current.
	 */
	write(path: string, content: string, options?: PendingWriteOptions): Promise<void>;

	/**
	 * Rename `oldPath` to `newPath`, registering the `old → new` pair
	 * atomically.
	 *
	 * @remarks
	 * See the FLAGGED entry on this file's top-level `@remarks` — this
	 * suppression-based behavior is not being presented here as
	 * spec-current.
	 */
	rename(oldPath: string, newPath: string, options?: PendingWriteOptions): Promise<void>;

	/** Delete `path`, registering the deletion atomically. */
	delete(path: string, options?: PendingWriteOptions): Promise<void>;
}
