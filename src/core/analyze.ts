import type { Object3D } from 'three'
import type { GLTF } from 'three-stdlib'
import { Imports } from './utils/imports.js'

export interface GltfNode {
  name: string
  type: string
  index: number
  children: GltfNode[]
}

export type GltfAnalysis = ReturnType<typeof analyzeGltfModel>

export function analyzeGltfModel({ scenes }: Pick<GLTF, 'scenes'>): { imports: Imports, scenes: GltfNode[] } {
  const imports = new Imports()

  const sceneNodes: GltfNode[] = []

  for (let index = 0; index < scenes.length; index++) {
    const scene = scenes[index]

    const node: GltfNode = {
      children: [],
      index,
      name: `${scene.name}Scene`,
      type: imports.addImport('three', scene.type, true),
    }

    collectNamedChildren(imports, scene, node)

    sceneNodes.push(node)
  }

  return {
    imports,
    scenes: sceneNodes,
  }
}

function collectNamedChildren(imports: Imports, obj: Object3D, parentNode: GltfNode): void {
  for (let index = 0; index < obj.children.length; index++) {
    const child = obj.children[index]

    if (child.name) {
      const node: GltfNode = {
        children: [],
        index,
        name: child.name,
        type: imports.addImport('three', child.type, true),
      }

      parentNode.children.push(node)

      collectNamedChildren(imports, child, node)
    }
  }
}
