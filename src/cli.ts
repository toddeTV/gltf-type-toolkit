#!/usr/bin/env node

import { resolve } from 'node:path'
import { cwd } from 'node:process'
import { defineCommand, runMain } from 'citty'
import { consola } from 'consola'
import { version } from '../package.json'
import { generateModelTypes } from './core/generate.js'
import { findAllModelsInDir } from './core/utils/find-models.js'

const main = defineCommand({
  args: {
    dir: {
      default: cwd(),
      description: 'Directory to scan for *.gltf files',
      type: 'positional',
    },

    loader: {
      description: 'Path to a module providing an GLTFLoader instance as default export.',
      type: 'string',
    },

    verbose: {
      default: false,
      description: 'Print more info',
      type: 'boolean',
    },
  },

  meta: {
    description: '',
    name: 'generate-gltf-types',
    version,
  },

  async run(context) {
    const dir = resolve(context.args.dir)

    consola.start(`Looking for models in ${dir}`)

    const models = await findAllModelsInDir(dir)

    await Promise.all(
      models.map(modelFile => generateModelTypes(modelFile, {
        customGltfLoaderModule: context.args.loader,
        verbose: context.args.verbose,
      })),
    )

    consola.success(`Generated types for ${models.length} model file${models.length === 1 ? '' : 's'}.`)
  },
})

runMain(main)
