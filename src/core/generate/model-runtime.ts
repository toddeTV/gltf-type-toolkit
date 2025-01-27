import type { GltfAnalysis } from '../analyze.js'
import { BINARY_GLTF_MODEL_EXTENSION, SEPARATE_GLTF_MODEL_EXTENSION } from '../constants.js'
import runtime from './templates/runtime.hbs.js'
import './handlebars.js'

export function generateModelRuntime(
  { imports, scenes }: GltfAnalysis,
  relativeGltfPath: string,
  gltfLoaderPath: string,
  identifiers: {
    nodeGetter: string
  },
): string {
  let nodeName = 'node'

  while (Object.values(identifiers).includes(nodeName)) {
    nodeName += '_'
  }

  return runtime({
    gltfIsBinary: relativeGltfPath.endsWith(BINARY_GLTF_MODEL_EXTENSION),
    gltfIsSeparate: relativeGltfPath.endsWith(SEPARATE_GLTF_MODEL_EXTENSION),
    gltfLoaderPath: JSON.stringify(gltfLoaderPath),
    identifiers: { ...identifiers, nodeName },
    imports: imports.toTemplateData(false),
    relativeGltfPath: JSON.stringify(relativeGltfPath),
    scenes,
  }).trim()
}
