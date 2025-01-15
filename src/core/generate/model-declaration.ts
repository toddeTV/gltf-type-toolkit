import type { GltfAnalysis, GltfNode } from '../analyze.js'
import declaration from './templates/declaration.hbs.js'
import './handlebars.js'

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
