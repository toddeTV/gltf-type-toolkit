export interface Options {
  /**
   * Module that provides an instance of a three.js GLTFLoader as the default export.
   */
  customGltfLoaderModule?: string

  /**
   * Print extra information.
   */
  verbose?: boolean
}
