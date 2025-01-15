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
}
