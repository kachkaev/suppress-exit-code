# suppress-exit-code

_Cross-platform CLI wrapper that runs any command and exits with zero_

[![npm](https://img.shields.io/npm/v/suppress-exit-code.svg)](https://www.npmjs.com/package/suppress-exit-code)

```sh
## exits with non-zero
crazy-broken-command --some-arg=42

## exits with zero, stdout and stderr streams are kept as is
suppress-exit-code crazy-broken-command --some-arg=42
```

Motivation: <https://github.com/okonet/lint-staged/issues/616>

## Installation

```sh
npm install --dev suppress-exit-code
## or
yarn add --dev suppress-exit-code
```

## Possible improvements

Feel free to contribute with a PR if you need these extra features (they are possible, but are not implemented yet):

```sh
## keep exit code unless it matches a given whitelist
suppress-exit-code --only=1,2,3 crazy-broken-command --some-arg=42
```

```sh
## make sure nothing is ever printed to the standard error stream
## (helps when running a subcommand in sensible environments)
suppress-exit-code --stderr=pipe-to-stdout crazy-broken-command --some-arg=42
suppress-exit-code --stderr=suppress crazy-broken-command --some-arg=42
```
