import type { UnpluginOptions } from 'unplugin'
import type { Options } from '../types.js'
import { cwd } from 'node:process'
import { generateModelTypes } from '../core/generate.js'
import { findAllModelsInDir } from '../core/utils/find-models.js'

export const createBuildStart: (options: Options | undefined) => UnpluginOptions['buildStart'] = options => async function () {
  const models = await findAllModelsInDir(cwd())

  await Promise.all(
    models.map(modelFile => generateModelTypes(modelFile, options)),
  )
}
