#!/usr/bin/env node
const execa = require("execa");

const args = [...process.argv];
while (args.length) {
  const arg = args.shift();
  if (arg.includes(".bin") || arg === __filename) {
    break;
  }
}
if (!args.length) {
  console.log("Please specify a child command to run");
  process.exit(1);
}

const childProcess = execa(args.shift(), args);
childProcess.stdout.pipe(process.stdout);
childProcess.stderr.pipe(process.stderr);
childProcess.catch(e => {
  // non-zero exit code is a noop
});
