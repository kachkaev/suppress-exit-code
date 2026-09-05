import { generateBaseConfigs } from "@kachkaev/eslint-config-base";
import type { Linter } from "eslint";
import { defineConfig } from "eslint/config";

const sharedFileScope = "**/*.{ts,tsx}";
const jsFileScope = "**/*.js";

/**
 * The shared configs are scoped to TS and TSX. The source of this package is JavaScript, so widen
 * that scope to cover it as well (https://github.com/kachkaev/reusable-stuff/issues/348).
 */
function includeJs(config: Linter.Config): Linter.Config {
  return Array.isArray(config.files) &&
    config.files.length === 1 &&
    config.files[0] === sharedFileScope
    ? { ...config, files: [sharedFileScope, jsFileScope] }
    : config;
}

export default defineConfig([
  generateBaseConfigs({ tsconfigRootDir: import.meta.dirname }).map((config) =>
    includeJs(config),
  ),

  {
    ignores: [".husky/**"],
  },

  {
    // Rules added in eslint-plugin-unicorn v65–v74 (via @kachkaev/eslint-config-base v2) that this
    // codebase does not adopt yet; reviewed collectively in https://github.com/kachkaev/repo-dive/issues/212.
    files: [sharedFileScope, jsFileScope],
    rules: {
      "unicorn/single-line-block-comment-style": "off", // Single-line `/** … */` doc comments are the norm here; rewriting them into three-line blocks is churn without benefit.
    },
  },

  {
    // The base config grants test files access to devDependencies, but its
    // glob only covers TypeScript. The source of this package is JavaScript.
    files: ["**/*.test.js"],
    rules: {
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: true,
          optionalDependencies: false,
          peerDependencies: false,
        },
      ],
    },
  },
]);
