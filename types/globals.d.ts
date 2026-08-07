/**
 * Build-time constant injected by esbuild's `define`.
 *
 * @remarks
 * Dev-only code is wrapped in `if (__DEV__)` so the production build
 * tree-shakes it away entirely. Invariant assertions, timing
 * instrumentation, and the test harness handle all live behind it.
 */
declare const __DEV__: boolean;
