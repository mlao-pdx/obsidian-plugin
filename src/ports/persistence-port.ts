/**
 * `PersistencePort` — repository interface for the template's
 * IndexedDB-backed persistence. Dexie is the template's chosen API layer
 * over IndexedDB: core code depends on this port, the Dexie-backed
 * adapter lives in `src/adapters`, and nothing talks to raw IndexedDB
 * directly. Replace `ExampleRecord` with the record shapes your plugin
 * actually persists — see the `dexie-persistence-adapter` skill for the
 * adapter-side schema and transaction patterns. A plugin that persists
 * nothing can delete this port together with the `dexie` dependency.
 *
 * @remarks
 * Shape, not contract: no implementation lives here. See
 * `src/ports/README.md` for why this interface has no `dexie` import.
 */
export interface ExampleRecord {
	readonly id: number;
	readonly value: string;
}

export interface PersistencePort {
	get(id: number): Promise<ExampleRecord | undefined>;
	put(record: ExampleRecord): Promise<void>;
	delete(id: number): Promise<void>;
}
