export class Imports {
  // Maps from module name to identifiers to type-only flag.
  #map = new Map<string, Map<string, boolean>>()

  addImport(module: string, identifier: string, typeImport = false): string {
    const identifiers = this.#map.get(module)

    if (!identifiers) {
      this.#map.set(module, new Map([[identifier, typeImport]]))
    }
    else {
      const isTypeOnly = (identifiers.get(identifier) ?? true) && typeImport
      identifiers.set(identifier, isTypeOnly)
    }

    return identifier
  }

  toTemplateData(includeTypeImports: boolean): {
    module: string
    typeOnly: boolean
    identifiers: { name: string, type: boolean }[]
  }[] {
    const imports: {
      module: string
      typeOnly: boolean
      identifiers: { name: string, type: boolean }[]
    }[] = []

    const modules = [...this.#map.entries()].sort((a, b) => a[0].localeCompare(b[0]))

    for (const [module, identifiersMap] of modules) {
      const typeOnly = [...identifiersMap.values()].every(type => type === true)

      if (typeOnly && !includeTypeImports) {
        continue
      }

      const identifiers = [...identifiersMap.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([name, type]) => ({
          name,
          type: type !== typeOnly,
        }))
        .filter(({ type }) => !(type && !includeTypeImports))

      imports.push({
        identifiers,
        module: JSON.stringify(module),
        typeOnly,
      })
    }

    return imports
  }
}
