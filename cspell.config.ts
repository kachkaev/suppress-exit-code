import { defineConfig } from "cspell";

export default defineConfig({
  dictionaries: ["cspell-words.txt"],
  dictionaryDefinitions: [
    {
      name: "cspell-words.txt",
      path: "./cspell-words.txt",
      addWords: true,
    },
  ],
  /**
   * Stop looking for `.gitignore` files above this config file.
   *
   * Without this, CSpell picks its own root by searching upwards for `.git`, preferring a directory
   * over a file. In a git worktree, `.git` is a file, so the search continues into the parent clone
   * and its `.gitignore` is applied to our files. When the worktree lives inside the clone (as with
   * `.claude/worktrees/*`), an ignore rule covering that folder marks every file as ignored, and
   * `pnpm lint:cspell` checks nothing while CI still checks everything.
   *
   * Upstream issue: https://github.com/streetsidesoftware/cspell/issues/8975
   * Upstream fix: https://github.com/streetsidesoftware/cspell/pull/8976
   */
  gitignoreRoot: ".",
  ignorePaths: [".git/**", ".husky/_/**", "node_modules/**", "pnpm-lock.yaml"],
  language: "en",
  minWordLength: 3,
  useGitignore: true,
});
