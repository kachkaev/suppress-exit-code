## v2.0.1 (2022-10-18)

- Remove `.yarn/sdks` from published package

- Fix `CHANGELOG.md`

## v2.0.0 (2022-10-18)

- **[potentially breaking]** Use `stdio: "inherit"` instead of piping `stdout` and `stderr` ([#3](https://github.com/kachkaev/suppress-exit-code/pull/3))

- Chores:

  - Update CI config and tests
  - Update `devDependencies`
  - Configure `husky` and `lint-staged`

## v1.0.0 (2020-12-20)

- Upgrade `execa` from v1 to v5

- Add tests

- Switch to Yarn Berry – this only affects the dev process and does not impact end users ([#1](https://github.com/kachkaev/suppress-exit-code/pull/1))

- **[breaking]** Replace console.log with console.error when no args are provided ([885f28eb](https://github.com/kachkaev/suppress-exit-code/commit/885f28eb))
