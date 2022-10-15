#!/usr/bin/env node
const execa = require("execa");

const args = [...process.argv];
while (args.length) {
  const arg = args.shift();
  if (
    // @ts-ignore arg cannot be undefined here due to the prior check
    arg.includes(".bin") ||
    arg === __filename
  ) {
    break;
  }
}
if (!args.length) {
  console.error("Please specify a child command to run");
  process.exit(1);
}

const childProcess = execa(
  // @ts-ignore args[0] cannot be undefined here due to the prior check
  args.shift(),
  args,
  { stdio: ['inherit', 'inherit', 'inherit'] },
);
childProcess.catch(() => {
  // noop for a non-zero exit code is the whole purpose of this library
});
