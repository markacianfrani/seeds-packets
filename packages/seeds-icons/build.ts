import {writeFileSync, readFileSync, mkdirSync, existsSync, rmSync} from "fs";
import {sync} from "globby";
import {optimize} from "svgo";
import {config} from "./svgo/svgo.config";
import svgstore from "svgstore";
import {basename, extname} from 'path';

const generalPaths = sync('./svgs/general/*.svg');
const generalAssets = readAndOptimizeSvgs(generalPaths);
const sproutPaths = sync('./svgs/sprout/*.svg');
const sproutAssets = readAndOptimizeSvgs(sproutPaths);
const externalPaths = sync('./svgs/external/*.svg');
const externalAssets = readAndOptimizeSvgs(externalPaths);

writeFileSync(`./src/general.ts`,
    `export const GeneralViewBoxes = ${JSON.stringify(generalAssets.viewBoxes)};
export const GeneralIconNames = ${JSON.stringify(generalAssets.svgNames)};
export const GeneralSprite =  ${JSON.stringify(generalAssets.sprite)};`);

writeFileSync(`./src/external.ts`,
    `export const ExternalViewBoxes = ${JSON.stringify(externalAssets.viewBoxes)};
export const ExternalIconNames = ${JSON.stringify(externalAssets.svgNames)};
export const ExternalSprite =  ${JSON.stringify(externalAssets.sprite)};`);

writeFileSync(`./src/sprout.ts`,
    `export const SproutViewBoxes = ${JSON.stringify(sproutAssets.viewBoxes)};
export const SproutIconNames = ${JSON.stringify(sproutAssets.svgNames)};
export const SproutSprite =  ${JSON.stringify(sproutAssets.sprite)};`);

generateFlowTypes();

mkdirSync('./dist/sprites');
writeFileSync(`./dist/sprites/general.svg`, generalAssets.sprite)
writeFileSync(`./dist/sprites/external.svg`, externalAssets.sprite)
writeFileSync(`./dist/sprites/sprout.svg`, sproutAssets.sprite)

function readAndOptimizeSvgs(paths: string[]): { svgNames: string[]; viewBoxes: { [svgName: string]: string }; sprite: string; } {
    // Read and optimize svgs
    const icons = paths.map(svgPath => {
        const svg = readFileSync(svgPath, 'utf8');
        const svgName = `${basename(svgPath, extname(svgPath))}`;
        const viewBox = svg.match(/viewBox="(\d+ \d+ \d+ \d+)"/)?.[1] ?? '0 0 18 18';
        const minified = optimize(svg, {...config, path: svgPath}).data;
        return {svg: minified, svgName, viewBox};
    })

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
    const viewBoxes: { [svgName: string]: string } = {};
    icons.forEach(svg => {
        viewBoxes[svg.svgName] = svg.viewBox;
        store.add(`seeds-svgs_${svg.svgName}`, svg.svg);
    });

    const sprite = store.toString({inline: true});

    return {sprite, svgNames, viewBoxes};
}

function generateFlowTypes() {
    // Make fresh dist folder before generating flow types directly into it
    if (existsSync('./dist')) {
        rmSync('./dist', {recursive: true});
        mkdirSync('./dist');
    } else {
        mkdirSync('./dist');
    }

    const allIconNames = [
        ...generalAssets.svgNames,
        ...externalAssets.svgNames,
        ...sproutAssets.svgNames,
    ];
    // Racine allows users to pass the icon name to Icon without the variant attached,
    // so we need to add that version of each icon name to the type.
    const iconNamesWithoutVariants = allIconNames
        .filter((icon) => icon.endsWith('-outline'))
        .map((name) => name.replace('-outline', ''));
    const allIconNamesWithVariants = Array.from(
        new Set([...allIconNames, ...iconNamesWithoutVariants])
    ).sort();
    writeFileSync(
        `./dist/types.flow.js`,
        `// @flow
    export type EnumIconNames = "${allIconNamesWithVariants.join('" | "')}";`
    );
}