# @sproutsocial/seeds-icons

## 0.2.0

### Minor Changes

- 082ebb9: Moved to tsc for copying and transpiling files
  - Before this release, files were manually copied into the `dist` directory and the only typescript types were manually written files.
  - We are now using `tsc` for transpiling, deriving type declaration files, and copying files to `dist`
  - As a result, there are significantly more type declaration files available than before this release.
- 082ebb9: Removed flow type exports
  - EnumIconNames.js exports have been removed
  - Please use the IconNames export for the icons you are using to create your own flow types
- 082ebb9: Removed attachSprite script
  - This script was written for a different environment than the rest of the package, which was causing typescript problems.
  - Please use your own script to attach the sprite to the DOM.

## 0.1.0

### Minor Changes

- cf0aab0: Initialized new package
  - **Please note that, per SemVer, the API of this package is unstable and may change at any time during major version 0.**
  - Added icon SVGs
  - Added v1 scripts for building and attaching icon spritesheets
