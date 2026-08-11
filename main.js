#!/usr/bin/env node

import { fileURLToPath } from "node:url";

import { execa } from "execa";

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

const childProcess = execa(
  // @ts-expect-error -- args[0] cannot be undefined here due to the prior check
  args.shift(),
  args,
  { stdio: "inherit" },
);
childProcess.catch(() => {
  // noop for a non-zero exit code is the whole purpose of this library
});
