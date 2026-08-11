# suppress-exit-code

## 4.0.0

### Major Changes

- [#17](https://github.com/kachkaev/suppress-exit-code/pull/17) [`0f5e882`](https://github.com/kachkaev/suppress-exit-code/commit/0f5e882fa24340896a705aff59f3b36e57ac55f6) - **[breaking]** Require Node 22.13 or newer

### Patch Changes

- [#17](https://github.com/kachkaev/suppress-exit-code/pull/17) [`0f5e882`](https://github.com/kachkaev/suppress-exit-code/commit/0f5e882fa24340896a705aff59f3b36e57ac55f6) - Replace `execa` with `cross-spawn` – the behavior is the same, but a production install shrinks from 17 packages to 6

## 3.2.0

### Minor Changes

- [#9](https://github.com/kachkaev/suppress-exit-code/pull/9) [`1c64f86`](https://github.com/kachkaev/suppress-exit-code/commit/1c64f86ee22c36921c58d857d567a9939ee712f9) Thanks [@risu729](https://github.com/risu729)! - Support `pnpm`

### Patch Changes

- [`8ec0479`](https://github.com/kachkaev/suppress-exit-code/commit/8ec047994ad4ad086efcff3e0a6b419281fa55ed) - Update `devDependencies` ([#6](https://github.com/kachkaev/suppress-exit-code/pull/6), [#7](https://github.com/kachkaev/suppress-exit-code/pull/7) and [#8](https://github.com/kachkaev/suppress-exit-code/pull/8))

## 3.1.0

### Minor Changes

- Support global install

  ```sh
  npm install --global suppress-exit-code
  ## or
  yarn global add suppress-exit-code
  ## or
  pnpm add --global suppress-exit-code
  ```

## 3.0.0

### Major Changes

- **[breaking]** Drop Node 12 support

- [#5](https://github.com/kachkaev/suppress-exit-code/pull/5) [`c8c0e1c`](https://github.com/kachkaev/suppress-exit-code/commit/c8c0e1cff16a5f3b3132cc1fbedf3f4f24b35dbc) - **[potentially breaking]** Switch to ESM ([context](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c))

## 2.0.1

### Patch Changes

- Remove `.yarn/sdks` from published package

- Fix `CHANGELOG.md`

## 2.0.0

### Major Changes

- [#3](https://github.com/kachkaev/suppress-exit-code/pull/3) [`2409c37`](https://github.com/kachkaev/suppress-exit-code/commit/2409c37c6a496dae787fac0df88e4ee229d6b221) Thanks [@cincodenada](https://github.com/cincodenada)! - **[potentially breaking]** Use `stdio: "inherit"` instead of piping `stdout` and `stderr`

### Patch Changes

- Chores:

  - Update CI config and tests
  - Update `devDependencies`
  - Configure `husky` and `lint-staged`

## 1.0.0

### Major Changes

- [`885f28e`](https://github.com/kachkaev/suppress-exit-code/commit/885f28ebba5675aaab6f85e0a880e00c9b0d442a) - **[breaking]** Replace console.log with console.error when no args are provided

### Patch Changes

- Upgrade `execa` from v1 to v5

- Add tests

- [#1](https://github.com/kachkaev/suppress-exit-code/pull/1) [`892c0bd`](https://github.com/kachkaev/suppress-exit-code/commit/892c0bd921623b239d98dbc8b1bb0d1fe4e06e5f) - Switch to Yarn Berry – this only affects the dev process and does not impact end users
