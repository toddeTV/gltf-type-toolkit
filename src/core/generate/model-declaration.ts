import type { GltfAnalysis, GltfNode } from '../analyze.js'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { handlebars } from './handlebars.js'

const declaration = await handlebars.compileFile(
  // TODO: Somehow get this to be bundled.
  join(fileURLToPath(import.meta.url), '../templates/declaration.d.ts.hbs'),
)

export function generateModelDeclaration(
  { imports, scenes }: GltfAnalysis,
  identifiers: {
    pathSymbol: string
    nodeGetter: string
  },
): string {
  return declaration({
    flattenedTree: scenes.flatMap(scene => flattenNodes(scene, [])),
    identifiers,
    imports: imports.toTemplateData(true),
    scenes,
  }).trim()
}

function flattenNodes(node: GltfNode, prefixPath: string[]): { names: string[], type: string }[] {
  prefixPath = [...prefixPath, node.name]

  return [
    { names: prefixPath, type: node.type },
    ...node.children.flatMap(child => flattenNodes(child, prefixPath)),
  ]
}
