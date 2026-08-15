/**
 * `PersistencePort` — illustrative repository interface for an
 * IndexedDB-backed (Dexie) cache. Replace this with the actual record
 * shapes your project needs; this file exists so `src/ports/` has a
 * concrete example to pair with the `dexie-persistence-adapter` skill.
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
