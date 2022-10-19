## v3.1.0 (2022-10-19)

- Support global install

  ```sh
  npm install --global suppress-exit-code
  ## or
  yarn global add suppress-exit-code
  ## or
  pnpm add --global suppress-exit-code
  ```

## v3.0.0 (2022-10-19)

- **[breaking]** Drop Node 12 support

- **[potentially breaking]** Switch to ESM ([#5](https://github.com/kachkaev/suppress-exit-code/pull/5), [context](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c))

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
