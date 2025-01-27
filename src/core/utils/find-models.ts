import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { GLTF_MODEL_EXTENSIONS } from '../constants.js'

export async function findAllModelsInDir(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true })

  return entries
    .filter(e => GLTF_MODEL_EXTENSIONS.some(ext => e.name.endsWith(ext)))
    .map(entry => join(entry.parentPath, entry.name))
}
