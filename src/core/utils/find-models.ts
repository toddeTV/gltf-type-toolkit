import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { GLTF_MODEL_EXTENSIONS } from '../constants.js'

export async function findAllModelsInDir(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { recursive: true })

  return entries
    .filter(isGltfModelFile)
    .map(file => join(dir, file))
}

export function isGltfModelFile(file: string): boolean {
  return GLTF_MODEL_EXTENSIONS.some(ext => file.endsWith(ext))
}

export async function handleReferencedModelFiles(
  rawGltf: object,
  fn: (input: {
    uri: string
    kind: 'buffer' | 'image'
    index: number
    setUri: (newUri: string) => void
  }) => void | Promise<void>,
): Promise<void> {
  const { buffers, images } = rawGltf as {
    buffers?: { uri: string }[]
    images?: { uri: string }[]
  }

  for (const [kind, objs] of [
    ['buffer', buffers ?? []],
    ['image', images ?? []],
  ] as const) {
    for (let index = 0; index < objs.length; index++) {
      const uri = objs[index].uri

      if (uri.startsWith('data:')) {
        continue
      }

      await fn({
        index,
        kind,
        setUri(newUri) {
          objs[index].uri = newUri
        },
        uri,
      })
    }
  }
}
