import type { GltfAnalysis, GltfNode } from '../analyze.ts'
import type { Imports } from '../utils/imports.ts'

export function generateNodeGetterFunction(
  { imports, scenes }: GltfAnalysis,
  names: {
    function: string
    pathSymbol: string
    modelVariable: string
  },
): string {
  const flattened = scenes.flatMap(scene => flattenNodes(scene, []))

  const lines = [
    ...flattened.map(([path, type]) => `${generateFunctionOverload(`typeof ${path}`, type, names)};`),
    generateFunctionBody(names, imports),
  ]

  return lines.join('\n')
}

function flattenNodes(node: GltfNode, prefixPath: string[]): [path: string, type: string][] {
  prefixPath = [...prefixPath, node.name]

  return [
    [prefixPath.join('.'), node.type],
    ...node.children.flatMap(child => flattenNodes(child, prefixPath)),
  ]
}

function generateFunctionOverload(
  specType: string,
  returnType: string,
  names: {
    function: string
  },
): string {
  return `export async function ${names.function}(spec: ${specType}): Promise<${returnType}>`
}

function generateFunctionBody(
  names: {
    function: string
    pathSymbol: string
    modelVariable: string
  },
  imports: Imports,
): string {
  let objName = 'obj'

  while (Object.values(names).includes(objName)) {
    objName += '_'
  }

  const lines = [
    `${generateFunctionOverload(
      `{ [${names.pathSymbol}]: number[] }`,
      imports.addImport('three', 'Object3D', true),
      names,
    )} {`,
    // Pretend that the complete model is also a `Object3D` to allow uniform access.
    `  let ${objName} = { children: (await ${names.modelVariable}).scenes } as Object3D;`,
    `  for (const idx of spec[${names.pathSymbol}]) {`,
    `    ${objName} = ${objName}.children[idx];`,
    `  }`,
    '',
    `  return ${objName};`,
    `}`,
  ]

  return lines.join('\n')
}
