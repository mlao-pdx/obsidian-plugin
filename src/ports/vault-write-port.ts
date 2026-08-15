/**
 * `VaultWritePort` — write capability (`write`, `rename`, `delete`) for
 * the execution step of plan-based workers.
 *
 * Workers depend on this port for *execution*. The *plan computation*
 * (what to rewrite, where to write to) stays pure core logic that
 * takes/returns data; the adapter-side orchestration calls this port to
 * execute the plan. The adapter implementation (outside `src/core`/
 * `src/ports`) wraps `vault.modify`/`vault.rename`/`vault.delete`.
 *
 * Shape, not contract: no implementation lives here.
 */
export interface VaultWritePort {
	/** Overwrite `path` with `content`. */
	write(path: string, content: string): Promise<void>;

	/** Rename `oldPath` to `newPath`. */
	rename(oldPath: string, newPath: string): Promise<void>;

	/** Delete `path`. */
	delete(path: string): Promise<void>;
}
