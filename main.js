#!/usr/bin/env node

import { fileURLToPath } from "node:url";

import spawn from "cross-spawn";

const filePath = fileURLToPath(import.meta.url);

const args = [...process.argv];
while (args.length > 0) {
  const arg = /** @type {string} */ (args.shift());
  if (
    arg.includes(".bin") ||
    arg.endsWith("suppress-exit-code") ||
    arg.endsWith("suppress-exit-code/main.js") ||
    arg.endsWith(String.raw`suppress-exit-code\main.js`) ||
    arg === filePath
  ) {
    break;
  }
}
if (args.length === 0) {
  // eslint-disable-next-line no-console -- Writing to stderr is how a CLI reports a usage error
  console.error("Please specify a child command to run");
  process.exit(1);
}

// `cross-spawn` is used instead of `node:child_process.spawn` because on Windows
// the latter cannot run `node_modules/.bin` shims: its PATH lookup never consults
// `PATHEXT`, and passing a `.cmd` or `.bat` path to it without `shell: true` throws
// (CVE-2024-27980). Turning `shell: true` on is not an option either, as Node does
// not escape arguments in that mode (DEP0190)
const childProcess = spawn(
  // @ts-expect-error -- args[0] cannot be undefined here due to the prior check
  args.shift(),
  args,
  { stdio: "inherit" },
);
childProcess.on("error", () => {
  // noop for a failed spawn is the whole purpose of this library, just like for
  // a non-zero exit code, which does not affect the exit code of this process
});
