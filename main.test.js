import { execa } from "execa";
import { describe, expect, it } from "vitest";

/** Node script that prints the arguments it was given as a JSON array */
const printArgs = "JSON.stringify(process.argv.slice(1))";

/**
 * Runs the wrapper, never throwing on a non-zero exit code.
 *
 * @param {string[]} args
 * @param {import("execa").Options} [options]
 */
function runWrapper(args, options) {
  return execa("./main.js", args, { reject: false, ...options });
}

describe("suppress-exit-code", () => {
  it("Does not work without arguments", async () => {
    const result = await runWrapper([]);
    expect(result.stderr).toEqual("Please specify a child command to run");
    expect(result.exitCode).toEqual(1);
  });

  it("Forwards args and pipes stdout", async () => {
    const result = await runWrapper(["echo", "hello", "world"]);
    expect(result.stdout).toEqual("hello world");
    expect(result.stderr).toEqual("");
    expect(result.exitCode).toEqual(0);
  });

  it("Pipes stderr", async () => {
    const result = await runWrapper([
      "node",
      "-e",
      "process.stderr.write('some stderr')",
    ]);
    expect(result.stdout).toEqual("");
    expect(result.stderr).toEqual("some stderr");
    expect(result.exitCode).toEqual(0);
  });

  it("Pipes stdin", async () => {
    const result = await runWrapper(
      ["node", "-e", "process.stdin.pipe(process.stdout)"],
      { input: "hello from stdin" },
    );
    expect(result.stdout).toEqual("hello from stdin");
    expect(result.stderr).toEqual("");
    expect(result.exitCode).toEqual(0);
  });

  it("Suppresses a non-zero exit code of a real command", async () => {
    const result = await runWrapper(["node", "-e", "process.exit(42)"]);
    expect(result.stdout).toEqual("");
    expect(result.stderr).toEqual("");
    expect(result.exitCode).toEqual(0);
  });

  it("Pipes both streams of a command that then fails", async () => {
    const result = await runWrapper([
      "node",
      "-e",
      "process.stdout.write('some stdout'); process.stderr.write('some stderr'); process.exit(3)",
    ]);
    expect(result.stdout).toEqual("some stdout");
    expect(result.stderr).toEqual("some stderr");
    expect(result.exitCode).toEqual(0);
  });

  // Windows has no signals: a killed process there is indistinguishable from
  // one that exited with a code
  it.runIf(process.platform !== "win32")(
    "Suppresses a command killed by a signal",
    async () => {
      const result = await runWrapper([
        "node",
        "-e",
        "process.kill(process.pid, 'SIGKILL')",
      ]);
      expect(result.stdout).toEqual("");
      expect(result.stderr).toEqual("");
      expect(result.exitCode).toEqual(0);
    },
  );

  it("Exits with zero when the command does not exist", async () => {
    const result = await runWrapper([
      "definitely-not-a-real-command",
      "--some-arg=42",
    ]);
    expect(result.stdout).toEqual("");
    if (process.platform === "win32") {
      // Anything that is not an `.exe` or a `.com` has to be run via `cmd.exe`,
      // which reports an unknown command itself. The message reaches the user
      // because the child inherits the standard streams
      expect(result.stderr).toMatch(
        /is not recognized as an internal or external command/,
      );
    } else {
      expect(result.stderr).toEqual("");
    }
    expect(result.exitCode).toEqual(0);
  });

  it("Runs a locally installed binary", async () => {
    // `preferLocal` puts `node_modules/.bin` into the PATH of the wrapper, which
    // then passes it on to the child. On Windows the resolved binary is
    // `prettier.cmd`, which `node:child_process.spawn` cannot run
    const result = await runWrapper(["prettier", "--version"], {
      preferLocal: true,
    });
    expect(result.stdout).toMatch(/^\d+\.\d+\.\d+/);
    expect(result.stderr).toEqual("");
    expect(result.exitCode).toEqual(0);
  });

  // Windows-only: passing a `.cmd` path to `node:child_process.spawn` without
  // `shell: true` throws EINVAL since CVE-2024-27980, so this asserts that the
  // shim works when named explicitly, not just when resolved through PATHEXT.
  // There is no `.cmd` shim to point at on other platforms
  it.runIf(process.platform === "win32")(
    "Runs a locally installed binary via its .cmd shim",
    async () => {
      const result = await runWrapper([
        String.raw`.\node_modules\.bin\prettier.cmd`,
        "--version",
      ]);
      expect(result.stdout).toMatch(/^\d+\.\d+\.\d+/);
      expect(result.stderr).toEqual("");
      expect(result.exitCode).toEqual(0);
    },
  );

  describe("Argument fidelity", () => {
    it.for([
      ["a space", "hello world"],
      ["a double quote", 'say "hi"'],
      ["an ampersand", "a&b"],
      ["a double ampersand", "a&&b"],
      ["a variable reference", "%PATH%"],
      ["a percent sign", "100%"],
      ["a caret", "a^b"],
      ["a pipe", "a|b"],
      ["a greater-than sign", "a>b"],
      ["a less-than sign", "a<b"],
      ["parentheses", "(a)"],
      ["an exclamation mark", "a!b"],
      ["a backtick", "a`b"],
      ["a trailing backslash", "a\\"],
      ["an escaped double quote", String.raw`a\"b`],
      ["nothing", ""],
    ])("Passes an argument containing %s as is", async ([, argument]) => {
      // The same round trip without the wrapper. Should this fail on Windows,
      // the culprit is how the test spawns things, not `cross-spawn`
      const control = await execa("node", [
        "-p",
        printArgs,
        /** @type {string} */ (argument),
      ]);
      expect(control.stdout).toEqual(JSON.stringify([argument]));

      const result = await runWrapper([
        "node",
        "-p",
        printArgs,
        /** @type {string} */ (argument),
      ]);
      expect(result.stdout).toEqual(JSON.stringify([argument]));
      expect(result.stderr).toEqual("");
      expect(result.exitCode).toEqual(0);
    });

    it("Passes multiple tricky arguments as is", async () => {
      // Node treats leading dashes as its own options, hence no `--flag=` here
      const args = ["a b", "", '"', "c:\\dir\\", "&& echo oops"];
      const result = await runWrapper(["node", "-p", printArgs, ...args]);
      expect(result.stdout).toEqual(JSON.stringify(args));
      expect(result.stderr).toEqual("");
      expect(result.exitCode).toEqual(0);
    });

    // `cross-spawn` does not escape line breaks when it wraps a command into
    // `cmd.exe /d /s /c` on Windows, so an argument containing CRLF may end up
    // being interpreted as a second command:
    // https://github.com/moxystudio/node-cross-spawn/issues/179
    it("Passes an argument containing CRLF as is, without running it", async () => {
      const argument = "innocent\r\necho PWNED";

      const control = await execa("node", ["-p", printArgs, argument]);
      expect(control.stdout).toEqual(JSON.stringify([argument]));

      const result = await runWrapper(["node", "-p", printArgs, argument]);
      // A single-line JSON array is the entire output, so `echo PWNED` could not
      // have produced anything of its own
      expect(result.stdout).toEqual(JSON.stringify([argument]));
      expect(result.stderr).toEqual("");
      expect(result.exitCode).toEqual(0);
    });
  });
});
