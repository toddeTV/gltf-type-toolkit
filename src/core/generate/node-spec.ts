import type { GltfAnalysis, GltfNode } from '../analyze.ts'

export function generateNodeSpecs(
  { scenes }: GltfAnalysis,
  names: {
    pathSymbol: string
  },
): string {
  const lines = scenes.flatMap(scene => [generateSceneNodeSpec(scene, names), ''])

  return lines.join('\n').trim()
}

function generateSceneNodeSpec(
  sceneNode: GltfNode,
  names: {
    pathSymbol: string
  },
): string {
  const lines = [
    `export const ${sceneNode.name} = {`,
    generateSpecContents(sceneNode, [sceneNode.index], 1, names),
    `};`,
  ]

  return lines.join('\n')
}

function generateSpecContents(
  node: GltfNode,
  parentIndices: number[],
  level: number,
  names: {
    pathSymbol: string
  },
): string {
  const indent = '  '.repeat(level)

  const lines = [`${indent}[${names.pathSymbol}]: [${parentIndices.join(', ')}],`]

  for (const child of node.children) {
    lines.push(
      `${indent}${child.name}: {`,
      generateSpecContents(child, [...parentIndices, child.index], level + 1, names),
      `${indent}},`,
    )
  }

  return lines.join('\n')
}
