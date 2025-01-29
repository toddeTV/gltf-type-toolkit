export interface Options {
  /**
   * Module that provides an instance of a three.js GLTFLoader as the default export.
   */
  customGltfLoaderModule?: string

  /**
   * Print extra information.
   */
  verbose?: boolean

  /**
   * This string is prefixed to all model file references. If missing it will be guessed from your build tool.
   */
  forceBasePath?: string
}
