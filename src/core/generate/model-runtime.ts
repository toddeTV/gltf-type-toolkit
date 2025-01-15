import type { GltfAnalysis } from '../analyze.ts'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { handlebars } from './handlebars.js'

const runtime = await handlebars.compileFile(
  // TODO: Somehow get this to be bundled.
  join(fileURLToPath(import.meta.url), '../templates/runtime.js.hbs'),
)

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
