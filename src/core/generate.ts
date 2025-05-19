import type { Options } from '../types.js'
import { writeFile } from 'node:fs/promises'
import { basename, dirname, relative, resolve } from 'node:path'
import consola from 'consola'
import { DRACOLoader, GLTFLoader } from 'three-stdlib'
import { name } from '../../package.json'
import { analyzeGltfModel, type GltfAnalysis } from '../core/analyze.js'
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
  options: Options,
): Promise<void> {
  if (options.verbose) {
    consola.info(`Parsing model ${modelFile}`)
  }

  const parsedGltf = await parseGltfModel(gltfLoader, modelFile)
  const analysis = analyzeGltfModel(parsedGltf)

  const declarationFile = resolve(dirname(modelFile), `${basename(modelFile)}.d.ts`)
  const runtimeFile = resolve(dirname(modelFile), `${basename(modelFile)}.js`)

  await Promise.all([
    generateDeclarationFile(options, declarationFile, analysis),
    generateRuntimeFile(options, runtimeFile, analysis, modelFile),
  ])
}

async function generateDeclarationFile(options: Options, targetFile: string, analysis: GltfAnalysis): Promise<void> {
  if (options.verbose) {
    consola.info(`Generating declaration file: ${targetFile}`)
  }

  await writeFile(targetFile, `${generateModelDeclaration(analysis, identifiers)}\n`, {
    encoding: 'utf8',
  })
}

async function generateRuntimeFile(options: Options, targetFile: string, analysis: GltfAnalysis, modelFile: string): Promise<void> {
  if (options.verbose) {
    consola.info(`Generating runtime file: ${targetFile}`)
  }

  let relativeGltfPath = relative(dirname(targetFile), modelFile)
  if (!relativeGltfPath.startsWith('.')) {
    relativeGltfPath = `./${relativeGltfPath}`
  }

  const loaderPath = options.customGltfLoaderModule ?? `${name}/gltf-loader`

  await writeFile(
    targetFile,
    `${generateModelRuntime(analysis, relativeGltfPath, loaderPath, identifiers)}\n`,
    { encoding: 'utf8' },
  )
}
