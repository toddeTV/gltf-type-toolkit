import type { GltfAnalysis } from '../analyze.js'
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
    gltfLoaderPath: JSON.stringify(gltfLoaderPath),
    identifiers: { ...identifiers, nodeName },
    imports: imports.toTemplateData(false),
    relativeGltfPath: JSON.stringify(relativeGltfPath),
    scenes,
  }).trim()
}
