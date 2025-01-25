import { writeFile } from 'node:fs/promises'
import { basename, dirname, relative, resolve } from 'node:path'
import consola from 'consola'
import { DRACOLoader, GLTFLoader } from 'three-stdlib'
import { name } from '../../package.json'
import { analyzeGltfModel } from '../core/analyze.js'
import { parseGltfModel } from '../core/parse.js'
import { generateModelDeclaration } from './generate/model-declaration.js'
import { generateModelRuntime } from './generate/model-runtime.js'

const gltfLoader = new GLTFLoader().setDRACOLoader(new DRACOLoader())

// TODO: Make variable.
const identifiers = {
  nodeGetter: 'getNode',
}

export async function generateModelTypes(
  modelFile: string,
  options?: {
    gltfLoaderPath?: string
    verbose?: boolean
  },
): Promise<void> {
  if (options?.verbose) {
    consola.info(`Parsing model ${modelFile}`)
  }

  const parsedGltf = await parseGltfModel(gltfLoader, modelFile)
  const analysis = analyzeGltfModel(parsedGltf)

  const declarationFile = resolve(dirname(modelFile), `${basename(modelFile)}.d.ts`)
  const runtimeFile = resolve(dirname(modelFile), `${basename(modelFile)}.js`)

  await Promise.all([
    (() => {
      if (options?.verbose) {
        consola.info(`Generating declaration file: ${declarationFile}`)
      }

      return writeFile(declarationFile, `${generateModelDeclaration(analysis, identifiers)}\n`, {
        encoding: 'utf8',
      })
    })(),

    (() => {
      if (options?.verbose) {
        consola.info(`Generating runtime file: ${runtimeFile}`)
      }

      let relativeGltfPath = relative(dirname(runtimeFile), modelFile)
      if (!relativeGltfPath.startsWith('.')) {
        relativeGltfPath = `./${relativeGltfPath}`
      }

      const loaderPath = options?.gltfLoaderPath ?? `${name}/gltf-loader`

      return writeFile(
        runtimeFile,
        `${generateModelRuntime(analysis, relativeGltfPath, loaderPath, identifiers)}\n`,
        { encoding: 'utf8' },
      )
    })(),
  ])
}
