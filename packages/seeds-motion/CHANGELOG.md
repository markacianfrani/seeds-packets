# Change Log

## 1.4.0

### Minor Changes

- 0f6d5e8: Tokens now include more accurate typescript types and js modules

## 1.3.3

### Patch Changes

- cf0aab0: Added default export to typescript types

## 1.3.2

### Patch Changes

- 4a05281: Updating build system by removing lerna and adding turborepo and changesets

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.3.1](https://github.com/sproutsocial/seeds-packets/compare/@sproutsocial/seeds-motion@1.3.0...@sproutsocial/seeds-motion@1.3.1) (2022-09-30)

**Note:** Version bump only for package @sproutsocial/seeds-motion

# [1.3.0](https://github.com/sproutsocial/seeds-packets/compare/@sproutsocial/seeds-motion@1.2.3...@sproutsocial/seeds-motion@1.3.0) (2022-09-27)

### Features

- add typescript support ([24e718a](https://github.com/sproutsocial/seeds-packets/commit/24e718a26955f40b5645ba86600ff8aa8ba941fa))

## [1.2.3](https://github.com/sproutsocial/seeds-packets/compare/@sproutsocial/seeds-motion@1.2.2...@sproutsocial/seeds-motion@1.2.3) (2022-06-13)

**Note:** Version bump only for package @sproutsocial/seeds-motion

## [1.2.2](https://github.com/sproutsocial/seeds-packets/compare/@sproutsocial/seeds-motion@1.2.1...@sproutsocial/seeds-motion@1.2.2) (2021-05-12)

**Note:** Version bump only for package @sproutsocial/seeds-motion

## [1.2.1](https://github.com/sproutsocial/seeds-packets/compare/@sproutsocial/seeds-motion@1.2.0...@sproutsocial/seeds-motion@1.2.1) (2020-11-13)

**Note:** Version bump only for package @sproutsocial/seeds-motion

# [1.2.0](https://github.com/sproutsocial/seeds/compare/@sproutsocial/seeds-motion@0.4.3...@sproutsocial/seeds-motion@1.2.0) (2019-06-19)

### Features

- extend color palettes and update motion package ([#98](https://github.com/sproutsocial/seeds/issues/98)) ([303a76d](https://github.com/sproutsocial/seeds/commit/303a76d))
- **motion:** add unitless js export ([#104](https://github.com/sproutsocial/seeds/issues/104)) ([7a6c1ac](https://github.com/sproutsocial/seeds/commit/7a6c1ac))

## 1.1.0 (2018-12-11)

⭐️ **Added:**

- Unitless JavaScript export: the package now offers a JavaScript export file that provides unitless numbers for the duration values. These numbers are in seconds.

## 1.0.0 (2018-12-04)

- Easing: The `ease in` token value has changed from `cubic-bezier(.4, 0, 1, 1)` to `cubic-bezier(.4, 0, .7, .2)`

🚨 **Breaking Changes:**

- Easing: The `linear` token has been removed in favor if the `linear` CSS keyword.
- Duration: The `immediately` token has been removed
- Duration: The following duration token values have changed
  - `quickly` is now `fast` with a value change from `0.1s` to `0.15s`
  - `promptly` is now `medium` with a value change from `0.2s` to `0.3s`
  - `slowly` is now `slow` with a value change from `0.4s` to `0.6s`

## 0.4.4 (2018-11-19)

Remove metadata comment from output files.

## 0.4.3 (2018-11-13)

Refactored build system to use [Style Dictionary](https://amzn.github.io/style-dictionary). No impactful changes.

<a name="0.4.2"></a>

## [0.4.2](https://github.com/sproutsocial/seeds/compare/@sproutsocial/seeds-motion@0.4.1...@sproutsocial/seeds-motion@0.4.2) (2018-07-11)

**Note:** Version bump only for package @sproutsocial/seeds-motion
