import type { UnpluginOptions } from 'unplugin'
import type { Options } from '../types.js'
import { dirname, resolve } from 'node:path'
import { SEPARATE_GLTF_MODEL_EXTENSION } from '../core/constants.js'
import { getReferencedModelFiles } from '../core/utils/find-models.js'
import { watch } from './watch.js'

export const createResolveId: (options?: Options) => UnpluginOptions['resolveId'] = () => async function (id, importer) {
  // esbuild does allow watching in this hook.
  if (id.endsWith(SEPARATE_GLTF_MODEL_EXTENSION) && this.getNativeBuildContext?.().framework === 'esbuild') {
    if (importer) {
      id = resolve(dirname(importer), id)
    }

    watch.call(this, id, await getReferencedModelFiles(id))
  }

  return undefined
}
