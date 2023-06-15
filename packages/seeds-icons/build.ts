import {writeFileSync, readFileSync, mkdirSync, existsSync, rmSync} from "fs";
import {sync} from "globby";
import {optimize} from "svgo";
import {config} from "./svgo/svgo.config";
import svgstore from "svgstore";
import {basename, extname} from 'path';

const svgFolderPaths = ['external', 'general', 'sprout'];

// Make fresh dist folder first
if (existsSync('./dist')) {
  rmSync('./dist', {recursive: true});
  mkdirSync('./dist');
} else {
  mkdirSync('./dist');
}

const allIconNames = generateSvgSpritesAndSrcFiles(svgFolderPaths);

generateTypes(allIconNames);

function generateSvgSpritesAndSrcFiles(svgFolderPaths: string[]) {
  mkdirSync('./dist/sprites');

  let allIconNames: string[] = [];

  svgFolderPaths.forEach((folderPath) => {
    // Get all svgs in folder
    const svgPaths = sync(`./svgs/${folderPath}/*.svg`);
    const svgAssets = readAndOptimizeSvgs(svgPaths);

    // Add typescript file with viewBoxes, iconNames and sprite
    writeFileSync(
      `./src/${folderPath}.ts`,
      `export const ${toTitleCase(folderPath)}ViewBoxes = ${JSON.stringify(
        svgAssets.viewBoxes
      )} as const;
        export const ${toTitleCase(folderPath)}IconNames = ${JSON.stringify(
        svgAssets.svgNames
      )} as const;
        export const ${toTitleCase(folderPath)}Sprite =  ${JSON.stringify(
        svgAssets.sprite
      )};`
    );

    // Add svg sprite
    writeFileSync(`./dist/sprites/${folderPath}.svg`, svgAssets.sprite);

    // Add icon names to allIconNames
    allIconNames = [...allIconNames, ...svgAssets.svgNames];
  });

  return allIconNames;
}

function generateTypes(allIconNames: string[]) {
  // Racine allows users to pass the icon name to Icon without the variant attached,
  // so we need to add that version of each icon name to the type.
  const iconNamesWithoutVariants = allIconNames
    .filter((icon) => icon.endsWith('-outline'))
    .map((name) => name.replace('-outline', ''));
  const allIconNamesWithVariants = Array.from(
    new Set([...allIconNames, ...iconNamesWithoutVariants])
  ).sort();

  // Add flow types to dist folder
  writeFileSync(
    `./dist/index.js.flow`,
    `// @flow
    export type EnumIconNames = "${allIconNamesWithVariants.join('" | "')}";
    export type EnumIconSvgNames = "${allIconNames.join('" | "')}";
    export type EnumIconNamesWithoutVariants = "${iconNamesWithoutVariants.join(
      '" | "'
    )}";`
  );

  // Add typescript types to src folder
  writeFileSync(
    `./src/types.ts`,
    `
    export type EnumIconNames = "${allIconNamesWithVariants.join('" | "')}";
    export type EnumIconSvgNames = "${allIconNames.join('" | "')}";
    export type EnumIconNamesWithoutVariants = "${iconNamesWithoutVariants.join(
      '" | "'
    )}";`
  );
}

function readAndOptimizeSvgs(paths: string[]): {
  svgNames: string[];
  viewBoxes: {[svgName: string]: string};
  sprite: string;
} {
  // Read and optimize svgs
  const icons = paths.map((svgPath) => {
    const svg = readFileSync(svgPath, 'utf8');
    const svgName = `${basename(svgPath, extname(svgPath))}`;
    const viewBox =
      svg.match(/viewBox="(\d+ \d+ \d+ \d+)"/)?.[1] ?? '0 0 18 18';
    const minified = optimize(svg, {...config, path: svgPath}).data;
    return {svg: minified, svgName, viewBox};
  });

  // Create svg sprite store and add each svg to it
  const store = svgstore({
    svgAttrs: {
      xmlns: 'http://www.w3.org/2000/svg',
      'xmlns:xlink': 'http://www.w3.org/1999/xlink',
      viewBox: '0 0 0 0',
      class: 'seeds-svgsprite',
      'aria-hidden': 'true',
    },
  });

  // Prepare assets
  const svgNames = icons.map((svg) => svg.svgName);
  const viewBoxes: {[svgName: string]: string} = {};
  icons.forEach((svg) => {
    viewBoxes[svg.svgName] = svg.viewBox;
    store.add(`seeds-svgs_${svg.svgName}`, svg.svg);
  });

  const sprite = store.toString({inline: true});

  return {sprite, svgNames, viewBoxes};
}

function toTitleCase(str: string) {
  return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
}