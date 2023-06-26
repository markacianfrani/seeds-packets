import * as dotenv from 'dotenv';
import got from 'got';
import { join, resolve } from 'path';
import { ensureDir, writeFile } from 'fs-extra';
import * as Figma from 'figma-js';
import PQueue from 'p-queue';
dotenv.config();

const { FIGMA_TOKEN, FIGMA_FILE_URL } = process.env;

interface Options {
  format: 'svg' | 'png';
  outputDir: string;
  scale: number;
}

const options: Options = {
  format: 'svg',
  outputDir: './svgs/',
  scale: 1
};

interface ContainerFramesProps {
  [key: string]: {
    name: string;
    nodeId: string;
  };
}

const containerFrames: ContainerFramesProps = {};

interface SliceProps {
  [key: string]: {
    name: string;
    nodeId: string;
    file: string;
    height: number;
    width: number;
    isOutline?: boolean;
    imageUrl?: string;
    containingFrame?: {
      name: string;
      nodeId: string;
    };
  };
}

const sliceData: SliceProps = {};

if (!FIGMA_TOKEN) {
  throw Error('Cannot find FIGMA_TOKEN in process!');
}

const figmaClient = Figma.Client({
  personalAccessToken: FIGMA_TOKEN
});

// Fail if there's no figma file key
let fileId: string | null = null;

// If fileId exist then grab the file key from the url
if (!fileId) {
  try {
    const getFileId = FIGMA_FILE_URL?.match(/file\/([a-z0-9]+)\//i);
    fileId = getFileId ? getFileId[1] : null;
  } catch (e) {
    throw Error('Cannot find FIGMA_FILE_URL key in process!');
  }
}

console.log(`Finding ${FIGMA_FILE_URL} Icon sclices`);

try {
  if (!fileId) {
    throw Error('Cannot find fileId');
  }
  /**
   * Get all the components from file in order to find the containing frame
   */
  console.log('Fetching All Components on page...');
  figmaClient
    .fileComponents(fileId)
    .then(({ data }) => {
      const { components } = data.meta;
      return components;
    })
    .then((component) => {
      /**
       * Iterate through list of components and get the containing frame
       * The containing frame is the frame should get us the "category" we want
       * ie. "Sprout Icons", "General Icons", "Network and Branded Icons", "Device Specific"
       */
      console.log('Getting list of Containing Frames...');

      /**
       * Reduce the components to a list of containing frames and their nodeIds. We'll use this later to grab the slices
       */
      component.reduce((acc, curr) => {
        if (curr.containing_frame) {
          // @ts-ignore the id prop is incorrectly set to node_id. The Figma API returns nodeId. This is a bug in the figma-js package
          const { name, nodeId } = curr.containing_frame;
          if (!acc[nodeId]) {
            acc[nodeId] = {
              name,
              nodeId
            };
          }
        }
        return acc;
      }, containerFrames);

      return containerFrames;
    })
    .then((containerFrames) => {
      console.log('Fetching container frames figma file nodes...');
      if (!fileId) {
        throw Error('Cannot find fileId');
      }
      /**
       * Only fetch the nodes that are in the container frames
       */
      return figmaClient
        .fileNodes(fileId, {
          ids: Object.keys(containerFrames)
        })
        .then(({ data }) => data);
    })
    .then((data) => {
      console.log('Create a list of slices including containing frame ...');

      // TODO: Strong type node. The figma-js package has a node type, but its missing the children property.
      // Recursively check for slices
      function recursivelyCheckForSlices(node: any, componentFrameKey: string, nodeParent?: any) {

        // If the node is a slice then add it to the sliceData object
        if (node.type === 'SLICE') {
          const { name, id } = node;
          const { height, width } = node.absoluteBoundingBox;
          const isOutline = nodeParent.type === 'COMPONENT' && nodeParent.name.toLowerCase().includes('outline');

          sliceData[id] = {
            name,
            nodeId: id,
            file: fileId ? fileId : '',
            height,
            width,
            isOutline,
            containingFrame: {
              name: containerFrames[componentFrameKey].name,
              nodeId: containerFrames[componentFrameKey].nodeId
            }
          };

          // If the node has children then recursively check for slices
        } else if (node.children) {
          node.children.forEach((child: any) => {
            recursivelyCheckForSlices(child, componentFrameKey, node);
          });
        }
      }
      
      // Iterate through nodes and initialize recursive check for slices
      Object.keys(data.nodes).forEach((key) => {
        recursivelyCheckForSlices(data.nodes[key]?.document, key);
      });

      return sliceData;
    })
    .then((sliceData) => {
      console.log("Getting slice's image urls...");

      if (!fileId) {
        throw Error('Cannot find fileId');
      }

      // Fetch the slice image urls from the figma api
      return figmaClient
        .fileImages(fileId, {
          ids: Object.keys(sliceData),
          format: options.format,
          scale: options.scale
        })
        .then(({ data }) => {
          // Add the image urls to the sliceData object
          Object.keys(data.images).forEach((key) => {
            sliceData[key].imageUrl = data.images[key];
          });
          return sliceData;
        });
    })
    .then((sliceData) => {
      console.log('Downloading slice images...');

      // IDK why we need all these. We only use the svg content type
      const contentTypes = {
        svg: 'image/svg+xml',
        png: 'image/png',
        jpg: 'image/jpeg'
      };

      return queueTasks(
        Object.values(sliceData).map((slice) => () => {
          if (!slice.imageUrl) {
            throw Error('Cannot find image url');
          }

          return got
            .get(slice.imageUrl, {
              headers: {
                'Content-Type': contentTypes[options.format]
              },
              encoding: options.format === 'svg' ? 'utf8' : undefined
            })
            .then((response) => {
              if (!slice.containingFrame) {
                return null;
              }

              return ensureDir(
                join(
                  options.outputDir,
                  getSvgDirName(slice.containingFrame.name)
                )
              ).then(() => {
                if (!slice.containingFrame) {
                  return null;
                }

                // If the slice is an outline then append "-outline" to the name. Currently `-outline` is not part of the slice name
                const iconSliceName = slice.isOutline ? `${slice.name}-outline` : slice.name;

                return writeFile(
                  join(
                    options.outputDir,
                    getSvgDirName(slice.containingFrame.name),
                    `${iconSliceName}.${options.format}`
                  ),
                  response.body,
                  options.format === 'svg' ? 'utf8' : 'binary'
                );
              });
            });
        })
      ).then(() => sliceData);
    })
    .then((sliceData) => {
      console.log('Writing data to data.json...');
      return ensureDir(options.outputDir)
        .then(() => {
          writeFile(
            resolve(options.outputDir, 'data.json'),
            JSON.stringify(sliceData, null, 2),
            'utf8'
          );
        })
        .then(() => sliceData);
    })
    .then(() => {
      console.log('Done!');
    });
} catch (e) {
  console.error(e);
}

// Coordinate the download of the slice images
function queueTasks(tasks: (() => Promise<void | null>)[]) {
  const queue = new PQueue({ concurrency: 3 });
  for (const task of tasks) {
    queue.add(task);
  }
  queue.start();
  return queue.onIdle();
}

const svgDirNames = {
  'Sprout Icons': 'sprout',
  'General Icons': 'general',
  'Network and Branded Icons': 'external'
} as const;

type SvgDirName = typeof svgDirNames[keyof typeof svgDirNames];

// Get the directory name for the svg files
function getSvgDirName(sliceContainerFrame: string): SvgDirName {
  // @ts-ignore
  const dirName = svgDirNames[sliceContainerFrame];
  if (!dirName) {
    throw Error(`Cannot find dirName for ${sliceContainerFrame}`);
  }
  return dirName;
}

export {}