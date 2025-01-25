import type { UnpluginBuildContext, UnpluginOptions } from 'unplugin'
import type { Options } from '../types.js'
import consola from 'consola'
import { SEPARATE_GLTF_MODEL_EXTENSION } from '../core/constants.js'
import { generateModelTypes } from '../core/generate.js'
import { getReferencedModelFiles } from '../core/utils/find-models.js'

const watchedModelFiles = new Set<string>()
const watchedReferencedFiles = new Map<string, string[]>()

export function watch(this: UnpluginBuildContext, modelFile: string, referencedFiles: string[]): void {
  this.addWatchFile(modelFile)
  watchedModelFiles.add(modelFile)

  for (const file of referencedFiles) {
    this.addWatchFile(file)

    const dependentModelFiles = watchedReferencedFiles.get(file)
    if (dependentModelFiles) {
      dependentModelFiles.push(modelFile)
    }
    else {
      watchedReferencedFiles.set(file, [modelFile])
    }
  }
}

async function generate(modelFile: string, options?: Options): Promise<void> {
  try {
    await generateModelTypes(modelFile, options)
  }
  catch (err) {
    consola.error('Could not generate model types', err)
  }
}

export const createWatchChange: (options?: Options) => UnpluginOptions['watchChange'] = options => async function (id, change) {
  if (change.event === 'create') {
    if (id.endsWith(SEPARATE_GLTF_MODEL_EXTENSION)) {
      await generate(id, options)

      watch.call(this, id, await getReferencedModelFiles(id))
    }
  }
  else if (watchedModelFiles.has(id)) {
    if (change.event === 'delete') {
      watchedModelFiles.delete(id)

      for (const [file, modelFiles] of [...watchedReferencedFiles.entries()]) {
        if (modelFiles.includes(id)) {
          watchedReferencedFiles.set(
            file,
            modelFiles.filter(f => f !== id),
          )
        }
      }
    }
    else {
      await generate(id)
    }
  }
  else {
    if (change.event === 'delete') {
      watchedReferencedFiles.delete(id)
    }
    else {
      const dependentModelFiles = watchedReferencedFiles.get(id)
      for (const modelFile of dependentModelFiles ?? []) {
        await generate(modelFile)
      }
    }
  }
}
