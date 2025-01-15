import type { Group, Object3D } from 'three'
import type { GLTF } from 'three-stdlib'

const PATH_SYMBOL_NAME = 'path'

export function generateNodeSpecs({ scenes }: Pick<GLTF, 'scenes'>): string {
  const lines = [`const ${PATH_SYMBOL_NAME} = Symbol();`, '', ...scenes.map(generateSceneNodeSpec)]

  return lines.join('\n')
}

function generateSceneNodeSpec(scene: Group, index: number): string {
  const lines = [
    `export const ${scene.name}Scene = {`,
    generateSpecContents(scene.children, [index], 1),
    `};`,
  ]

  return lines.join('\n')
}

function generateSpecContents(children: Object3D[], indices: number[], level: number): string {
  const indent = '  '.repeat(level)

  const lines = [`${indent}[${PATH_SYMBOL_NAME}]: [${indices.join(', ')}],`]

  for (let idx = 0; idx < children.length; idx++) {
    const child = children[idx]
    if (child.name) {
      lines.push(
        `${indent}${child.name}: {`,
        generateSpecContents(child.children, [...indices, idx], level + 1),
        `${indent}},`,
      )
    }
  }

  return lines.join('\n')
}
