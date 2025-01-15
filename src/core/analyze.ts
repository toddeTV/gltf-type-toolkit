import type { Object3D } from 'three'
import type { GLTF } from 'three-stdlib'

export interface GltfNode {
  name: string
  index: number
  children: GltfNode[]
}

export type GltfAnalysis = ReturnType<typeof analyzeGltfModel>

export function analyzeGltfModel({ scenes }: Pick<GLTF, 'scenes'>): { scenes: GltfNode[] } {
  const sceneNodes: GltfNode[] = []

  for (let index = 0; index < scenes.length; index++) {
    const scene = scenes[index]

    const node: GltfNode = {
      children: [],
      index,
      name: `${scene.name}Scene`,
    }

    collectNamedChildren(scene, node)

    sceneNodes.push(node)
  }

  return {
    scenes: sceneNodes,
  }
}

function collectNamedChildren(obj: Object3D, parentNode: GltfNode): void {
  for (let index = 0; index < obj.children.length; index++) {
    const child = obj.children[index]

    if (child.name) {
      const node: GltfNode = {
        children: [],
        index,
        name: child.name,
      }

      parentNode.children.push(node)

      collectNamedChildren(child, node)
    }
  }
}
