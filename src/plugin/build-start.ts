import type { UnpluginOptions } from 'unplugin'
import type { Options } from '../types.js'
import { cwd } from 'node:process'
import { generateModelTypes } from '../core/generate.js'
import { findAllModelsInDir } from '../core/utils/find-models.js'
import { watch } from './watch.js'

export const createBuildStart: (options?: Options) => UnpluginOptions['buildStart'] = () => async function () {
  const models = await findAllModelsInDir(cwd())

  await Promise.all(
    models.map(async ({ modelFile, referencedFiles }) => {
      await generateModelTypes(modelFile)

      // esbuild does not allow watching in this hook...
      if (this.getNativeBuildContext?.()?.framework !== 'esbuild') {
        watch.call(this, modelFile, referencedFiles)
      }
    }),
  )
}
