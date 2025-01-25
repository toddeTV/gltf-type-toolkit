import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

export async function findAllModelsInDir(dir: string): Promise<
  {
    modelFile: string
  }[]
> {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true })

  return await Promise.all(
    entries
      .filter(e => e.name.endsWith('.gltf'))
      .map(async (entry) => {
        const fullPath = join(entry.parentPath, entry.name)

        return {
          modelFile: fullPath,
        }
      }),
  )
}
