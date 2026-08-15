---
name: dexie-persistence-adapter
description: Dexie/IndexedDB schema and transaction patterns scoped to the PersistencePort adapter (src/adapters, never src/core or src/ports). Load when implementing or reviewing the Dexie-backed PersistencePort adapter — schema declaration, atomic multi-table transactions, TypeScript Table typing, or schema versioning/migration.
---

# Dexie persistence adapter

Scope: this skill is **only** for the `PersistencePort` Dexie adapter
implementation (outside `src/core/**` and `src/ports/**`). It is not a
general Dexie tutorial — for anything beyond schema/transactions/typing/
versioning, consult the linked docs directly.

`dexie@^4.4.4` (see `package.json`). Type reference (link, don't embed):
`https://unpkg.com/dexie@4.4.4/dist/dexie.d.ts`. Full index for future ad-hoc
lookups: `https://dexie.org/llms.txt`.

## Architecture boundary — read this first

`eslint.config.mts` enforces `no-restricted-imports` on `src/core/**` and
`src/ports/**`: neither may import `dexie` (or `obsidian`) at runtime. Core
algorithms depend only on `PersistencePort` (`src/ports/persistence-port.ts`);
this skill's patterns belong in the adapter module that implements that
interface, never inside `src/core` or `src/ports` themselves.

## Schema declaration matching `PersistencePort`'s row shapes

Table schemas below mirror the row shapes declared in
`src/ports/persistence-port.ts` — keep the adapter's persisted shape and
the port's row interfaces in sync when either changes. The port ships with
one illustrative `ExampleRecord` shape; real projects will have several
tables, so this example is written with two to show how a multi-table
schema and a multi-table transaction fit together.

```ts
import { Dexie, type Table } from 'dexie';
import type { ExampleRecord } from '@ports/persistence-port';

/** A second illustrative row shape, referencing `ExampleRecord` by id. */
export interface ExampleTagRow {
	readonly recordId: number;
	readonly tag: string;
}

export class AppDb extends Dexie {
	records!: Table<ExampleRecord, number>;
	tags!: Table<ExampleTagRow, number>;

	constructor(vaultId: string) {
		// One database per vault — the vault-scoped name is what makes
		// this a per-vault, not per-plugin, database.
		super(`my-plugin/${vaultId}`);

		this.version(1).stores({
			records: 'id, value',
			tags: '[recordId+tag], recordId, tag',
		});
	}
}
```

- Only list _indexed_ properties in `.stores()` — not every field on the row.
  Non-indexed fields still round-trip through `add`/`put`/`get` normally.
- IndexedDB (and therefore Dexie) can only index `number`, `string`, `Date`,
  arrays of indexable keys, and typed arrays/`ArrayBuffer` — never `boolean`,
  `null`, `undefined`, or a plain object. A field typed `T | undefined` is
  simply unindexed for rows where it's absent (sparse index), not an error.
- Dexie 4 auto-detects schema changes on load; incrementing `version()` on a
  pure additive change is optional but still best practice (saves ~1ms on
  open). Only a genuine schema edit needs the version bump below.

## Atomic multi-table transaction pattern

When a write spans multiple tables and any in-memory value must be
resolved before the write is durable (e.g. a computed id or derived
field), resolve it **in memory first**, then commit the full write in a
single atomic Dexie transaction — `PersistencePort` must never receive a
write before that value is known, and a partially-written row must never
be observable to a reader.

```ts
async function putRecordWithTag(
	db: AppDb,
	record: ExampleRecord,
	tag: ExampleTagRow,
): Promise<void> {
	await db.transaction('rw', db.records, db.tags, async () => {
		await db.records.put(record);
		await db.tags.put(tag);
	});
}
```

- List every table the callback touches as an argument — a table used inside
  the callback but not declared in the transaction call fails with "Table
  ... not included in parent transaction".
- IndexedDB auto-commits a transaction as soon as it goes a tick without use;
  never `await` an unrelated async API (network, `setTimeout`, a non-Dexie
  promise library) inside the transaction scope, or you'll get
  `TransactionInactiveError`. Stay on native/Dexie promises throughout.
- A bulk rewrite across many rows (e.g. moving many records between
  parents) is deliberately an _ordinary_ transaction across the affected
  rows, not a special-cased background job — don't build separate
  migration machinery for that case.

## TypeScript typing conventions

- Subclass `Dexie`, declare each table as `Table<RowType, KeyType>`, and
  assign it in the constructor via `.stores()` — see the schema example
  above. Table names on the class must exactly match the keys passed to
  `.stores()`.
- Prefer a plain `Table<T, K>` here over `EntityTable`: `PersistencePort`'s
  rows are plain data (see `persistence-port.ts`'s "shape, not contract" /
  "no implementation lives here" doc comment), not class instances with
  methods, so `EntityTable`'s model-binding features aren't needed.
- Do not reach for `dexie-cloud-addon` syntax (`@id` primary keys, realms as
  a _sync_ concept). Dexie Cloud is an unrelated optional add-on — don't
  confuse an app-domain column (e.g. an owner/grouping id specific to your
  domain model) with one of Dexie Cloud's own reserved columns.

## One-database-per-vault schema note & versioning

One Dexie database per vault is the expected topology for a vault-scoped
plugin; `PersistencePort` is only an interface in front of that database,
not a new storage topology.

```ts
// Adding a column/table: edit the *existing* version block and bump the
// number. Do NOT stack version blocks (that's a legacy Dexie 1/2 pattern).
this.version(2).stores({
	records: 'id, value, lastSeenMs', // added column
	// ...unchanged tables can be omitted only if their definition truly
	// didn't change AND you're not using an upgrade() migrator — when in
	// doubt, repeat the full table list for clarity.
});

// Changing a column's meaning (not just adding one) needs an upgrade():
this.version(3)
	.stores({ records: 'id, value, lastSeenAtMs' })
	.upgrade((tx) =>
		tx.table('records').toCollection().modify((row) => {
			row.lastSeenAtMs = row.lastSeenMs; // migrate old -> new field
			delete row.lastSeenMs;
		}),
	);
```

- `upgrade()` callbacks only ever migrate _forward_; Dexie 4 supports schema
  downgrade detection, but there's no downgrade counterpart to `upgrade()` —
  a downgraded schema version triggers a clear/rebuild path instead.
- Sources for schema/versioning/transaction detail beyond this skill:
  `https://dexie.org/docs/Dexie/Dexie.version()`,
  `https://dexie.org/docs/Dexie/Dexie.transaction()`, and the index at
  `https://dexie.org/llms.txt`.
