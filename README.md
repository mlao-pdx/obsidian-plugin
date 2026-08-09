# Narradin

Flexible organization and visualization of long form fiction: Show the brilliance you know lies underneath all your madness and chaos.

> **Status: pre-alpha.** Not in the community plugin catalogue. Expect breakage.

## Support policy

- A desktop-only plugin. No mobile support, on any OS.
- Primarily tested against macOS, but should work on Windows and Linux just fine.
- [Bug reports welcome](https://github.com/mlao-pdx/obsidian-narradin).
- This is an opinionated plugin, feature requests are considered only when a good fit.
- PRs for Windows or Linux bug-fixes are considered if they include a clean
  reproduction test, match coding practices, and do not change existing behavior.

This is a personal tool, made available in case others find it useful.

## Testing

Unit tests run on [Vitest](https://vitest.dev/); exploratory property tests
run on [fast-check](https://fast-check.dev/).

```sh
npm test               # run unit tests once
npm run test:watch     # run unit tests in watch mode
npm run test:coverage  # unit tests with a local coverage report (./coverage/)
```

There are two tiers of test files:

- `*.test.ts` — fast, deterministic unit/regression tests. CI-enforced (runs
  in `lint.yml`) and required by the `pre-push` git hook.
- `*.properties.test.ts` — [fast-check](https://fast-check.dev/) property
  tests. **Local-only**: never run in CI or by any git hook. This is a
  solo, low-budget project, so CI is kept fast and deterministic; property
  tests are exploratory and can be slow or (rarely) flaky by nature.

Run property tests locally with:

```sh
npm run test:properties
npm run test:properties:watch
```

### Promoting a fast-check finding to a permanent regression

When a property test fails, it writes a JSON "finding" describing the
failing counterexample to `.fast-check-findings/<id>.json` (git-ignored,
local debugging artifact only) instead of only printing to the console.

1. Run `npm run test:properties` locally.
2. A failing property writes `.fast-check-findings/<id>.json`.
3. Run `npm run test:promote`, and pick the finding from the list.
4. Copy the printed regression template into the matching `*.test.ts` file,
   fill in the assertion, and confirm it fails against the current code.
5. Fix the implementation until the new regression test (and the original
   property test) pass.
6. Delete the finding via the promote script's prompt (or manually).

Conventions:

- `assertProperty(id, property)`'s `id` is a stable, unique slug:
  `<module-path>__<short-description>`, e.g.
  `smoke/clamp__result-within-bounds`.
- Once real `src/core` modules exist, colocate their shared fast-check
  arbitraries in a `<module>.arbitraries.ts` file next to the module,
  imported from both its `.test.ts` and `.properties.test.ts`.

## Funding

If you want to buy me a coffee, please consider donating to the [Signal Foundation](https://signal.org/donate/) instead. Or support the third-party plugins this one leans on. You can find them in the credits.

## Licence

0BSD — see [LICENSE](LICENSE) and [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

## Credits

Scaffolded from [obsidian-sample-plugin](https://github.com/obsidianmd/obsidian-sample-plugin) (0BSD).

Designed to work along side Linter, Notebook Navigator, Note Toobar, Style Settings, and Templater.
