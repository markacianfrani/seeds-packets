# @sproutsocial/seeds-icons

## 0.9.0

### Minor Changes

- 06f1cd6: Update all icons to use 24px frame

## 0.8.0

### Minor Changes

- c760696: Fix flow type declarations and icon svgs

## 0.7.0

### Minor Changes

- 949aee5: Add `quotes-solid` and `quotes-outline` icons

## 0.6.0

### Minor Changes

- 714f0cf: Update build to include Typescript types

## 0.5.0

### Minor Changes

- 26659f4: Adds raw sprites to package exports
  - Previously, sprites were only available when imported in Javascript using syntax like `import {GeneralSprite} from '@sproutsocial/seeds-icons';`
  - Now, they are also available in their raw SVG form in the dist/sprites directory for use with scripts that cannot import from modules. (e.g., `const spriteSrc = 'node_modules/@sproutsocial/seeds-icons/dist/sprites/*.svg';`)
- 26659f4: Adds flow types to generated files
  - Exported as EnumIconNames from dist/types.flow.js

## 0.4.0

### Minor Changes

- c9e0c40: Removed "All" category exports
  - The "All" category exports, which bundled the Sprout and General category icons together, have been removed. Please import all the assets you need and combine them manually.
  - Note: This is a breaking change but the package will get a minor version bump only, to avoid promoting the package to v1/stable.
- c9e0c40: Added "external" icon category
  - 14 new icons were added
  - This category is for icons owned by their respective companies, not Sprout Social
  - Added ExternalSprite, ExternalViewBoxes, and ExternalIconNames to the package exports

## 0.3.1

### Patch Changes

- 8a07e70: Fixed seeds-color import syntax/typing

## 0.3.0

### Minor Changes

- 85c22ff: Replaced SVGs with versions that fill the viewBox
  - Previously, all SVGs in the package had a 24x24 viewBox despite the graphic usually being about 18x18, leading to unintended margins
  - New versions have been added that include accurate viewBoxes that hug the content on each side

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
