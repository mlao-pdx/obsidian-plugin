# Narradin — Obsidian Plugin

## Project overview

- Target: Obsidian Community Plugin (TypeScript → bundled JavaScript).
- Entry point: `src/main.ts`, compiled to `main.js`, loaded by Obsidian.
- Setup, build, manual install, testing, versioning/release process, and
  troubleshooting: see `README.md`.

## Coding conventions

- TypeScript with `"strict": true`.
- Keep `main.ts` minimal: only plugin lifecycle (`onload`, `onunload`,
  `addCommand` registration). Delegate feature logic to separate modules
  under `src/`.
- Split large files: if a file exceeds ~200-300 lines, break it into
  smaller, focused modules with a single, well-defined responsibility.
- Bundle everything into `main.js` (no unbundled runtime deps).
- Avoid Node/Electron APIs unless `isDesktopOnly` is intentionally `true`.
- Prefer `async/await` over promise chains; handle errors gracefully.
- Never commit build artifacts: `node_modules/`, `main.js`, and other
  generated output must never be tracked in Git.
- For example file structure and common task code patterns (adding a
  command, persisting settings, registering listeners), and UI copy/UX
  guidelines, load the `obsidian-plugin-patterns` skill.

## Security, privacy, and compliance

Follow Obsidian's Developer Policies and Plugin Guidelines. In particular:

- Default to local/offline operation. Only make network requests when
  essential to the feature.
- No hidden telemetry. Optional analytics or third-party calls require
  explicit opt-in, documented in `README.md` and in settings.
- Never execute remote code, fetch-and-eval scripts, or auto-update plugin
  code outside normal releases.
- Minimize scope: read/write only what's necessary inside the vault. Do not
  access files outside the vault.
- Clearly disclose any external services used, data sent, and risks.
- Do not collect vault contents, filenames, or personal information unless
  absolutely necessary and explicitly consented.
- Avoid deceptive patterns, ads, or spammy notifications.
- Register and clean up all DOM, app, and interval listeners using the
  provided `register*` helpers so the plugin unloads safely.

## Performance

- Keep startup light. Defer heavy work until needed.
- Avoid long-running tasks during `onload`; use lazy initialization.
- Batch disk access and avoid excessive vault scans.
- Debounce/throttle expensive operations in response to file system events.

## Mobile

- Don't assume desktop-only behavior unless `isDesktopOnly` is `true`.
- Avoid large in-memory structures; be mindful of memory and storage
  constraints.

## Agent do/don't

**Do**

- Add commands with stable IDs (don't rename once released).
- Provide defaults and validation in settings.
- Write idempotent code paths so reload/unload doesn't leak listeners or
  intervals.
- Use `this.register*` helpers for everything that needs cleanup.
- Never change `manifest.json`'s `id` after release; treat it as a stable
  API.

**Don't**

- Introduce network calls without an obvious user-facing reason and
  documentation.
- Ship features that require cloud services without clear disclosure and
  explicit opt-in.
- Store or transmit vault contents unless essential and consented.

## Git workflow

- Work directly on `main`. Do not create or switch to feature branches.
- All commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/)
  (`type(scope): subject`, e.g. `fix: correct macOS gitignore patterns`).
- Do not commit, push, amend commits, or otherwise alter Git history
  without explicit user approval for that specific change.
- Never use shell commit-message commands or `git commit -m "..."`. Compose
  commit messages through the normal interactive commit flow so they can
  be reviewed before finalizing.

## Where to look next

- Setup, build, manual install, testing, versioning/release process,
  troubleshooting, reference links: `README.md`.
- Example file structure, common task code snippets, UI copy/UX
  guidelines: `obsidian-plugin-patterns` skill.
