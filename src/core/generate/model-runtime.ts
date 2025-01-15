import type { GltfAnalysis } from '../analyze.js'
import runtime from './templates/runtime.hbs.js'
import './handlebars.js'

export function generateModelRuntime(
  { imports, scenes }: GltfAnalysis,
  identifiers: {
    pathSymbol: string
    nodeGetter: string
    modelVariable: string
  },
): string {
  let nodeName = 'node'

  while (Object.values(identifiers).includes(nodeName)) {
    nodeName += '_'
  }

  return runtime({
    identifiers: { ...identifiers, nodeName },
    imports: imports.toTemplateData(false),
    scenes,
  }).trim()
}
