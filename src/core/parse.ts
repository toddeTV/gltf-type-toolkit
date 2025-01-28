import type { Stats } from 'node:fs'
import type { GLTF, GLTFLoader } from 'three-stdlib'
import { readFile, stat } from 'node:fs/promises'
import { dirname } from 'node:path'

export async function parseGltfModel(gltfLoader: GLTFLoader, modelFile: string): Promise<GLTF> {
  let stats: Stats
  try {
    stats = await stat(modelFile)
  }
  catch {
    throw new Error(`Model file "${modelFile}" does not exist!`)
  }

  if (!stats.isFile()) {
    throw new Error(`"${modelFile}" is not a file!`)
  }

  const gltf = (await readFile(modelFile)).buffer as ArrayBuffer

  const model = await gltfLoader.parseAsync(gltf, dirname(modelFile))

  return model
}
