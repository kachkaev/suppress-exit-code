import { execa } from "execa";

describe("suppress-exit-code", () => {
  it("Does not work without arguments", async () => {
    const result = await execa("./main.js", [], { reject: false });
    expect(result.stderr).toEqual("Please specify a child command to run");
    expect(result.exitCode).toEqual(1);
  });

  it("Forwards args and pipes stdout", async () => {
    const result = await execa("./main.js", ["echo", "hello", "world"], {
      reject: false,
    });
    expect(result.stdout).toEqual("hello world");
    expect(result.stderr).toEqual("");
    expect(result.exitCode).toEqual(0);
  });

  it("Pipes stderr", async () => {
    const result = await execa(
      "./main.js",
      ["sh", "-c", "echo some stderr >&2"],
      { reject: false },
    );
    expect(result.stdout).toEqual("");
    expect(result.stderr).toEqual("some stderr");
    expect(result.exitCode).toEqual(0);
  });

  it("Suppresses exit code", async () => {
    const result = await execa("./main.js", ["exit", "42"], { reject: false });
    expect(result.stdout).toEqual("");
    expect(result.stderr).toEqual("");
    expect(result.exitCode).toEqual(0);
  });
});
