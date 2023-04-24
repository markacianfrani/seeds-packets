---
"@sproutsocial/seeds-icons": minor
---

Adds raw sprites to package exports
- Previously, sprites were only available when imported in Javascript using syntax like `import {GeneralSprite} from '@sproutsocial/seeds-icons';`
- Now, they are also available in their raw SVG form in the dist/sprites directory for use with scripts that cannot import from modules. (e.g., `const spriteSrc = 'node_modules/@sproutsocial/seeds-icons/dist/sprites/*.svg';`)