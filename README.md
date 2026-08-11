# suppress-exit-code

_Cross-platform CLI wrapper that runs any command and exits with zero_ <!-- markdownlint-disable-line MD036 -- a tagline, not a heading -->

[![npm version](https://img.shields.io/npm/v/suppress-exit-code?logo=npm&color=3c7ef6&labelColor=333)](https://www.npmjs.com/package/suppress-exit-code)
[![npm downloads](https://img.shields.io/npm/dw/suppress-exit-code?logo=npm&color=3c7ef6&labelColor=333)](https://www.npmjs.com/package/suppress-exit-code)
[![License](https://img.shields.io/badge/license-MIT-3c7ef6?logo=opensourceinitiative&logoColor=white&labelColor=333)](LICENSE.md)

```sh
## exits with non-zero
crazy-broken-command --some-arg=42

## exits with zero, stdout and stderr are kept as is
suppress-exit-code crazy-broken-command --some-arg=42
```

Motivation: <https://github.com/lint-staged/lint-staged/issues/616>

## Installation

Requires Node 22.13 or newer.
If you are on an older Node, stay on v3.

### Local

```sh
npm install --save-dev suppress-exit-code
## or
yarn add --dev suppress-exit-code
## or
pnpm add --dev suppress-exit-code
```

### Global

```sh
npm install --global suppress-exit-code
## or
pnpm add --global suppress-exit-code
```

## Behavior

The child command inherits the standard streams, so its output reaches the terminal as is.
Whatever the child does, the wrapper exits with zero – a non-zero exit code, a signal and even a command that does not exist are all suppressed:

```sh
## exits with zero, prints nothing on macOS and Linux
## (on Windows cmd.exe prints its own “is not recognized” message)
suppress-exit-code definitely-not-a-real-command
```

The only non-zero exit comes from the wrapper itself: with no arguments it writes `Please specify a child command to run` to stderr and exits with one.

## Possible improvements

Not implemented yet – a PR is welcome if you need them:

```sh
## keep the exit code unless it matches a given allowlist
suppress-exit-code --only=1,2,3 crazy-broken-command --some-arg=42
```

```sh
## make sure nothing is ever printed to stderr
## (helps when running a subcommand in sensitive environments)
suppress-exit-code --stderr=pipe-to-stdout crazy-broken-command --some-arg=42
suppress-exit-code --stderr=suppress crazy-broken-command --some-arg=42
```

## Development

The package is a single JavaScript file, type-checked via JSDoc.

```sh
pnpm install
pnpm test
pnpm lint
pnpm fix
```

Tests run the real binary, so they cover the `node_modules/.bin` shims too.
CI repeats them on Linux, macOS and Windows across the supported Node versions.

## License

[MIT](LICENSE.md)
