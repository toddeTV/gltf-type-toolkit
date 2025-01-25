import type { Options } from './types'
import { addVitePlugin, addWebpackPlugin, defineNuxtModule } from '@nuxt/kit'
import vite from './vite.js'
import webpack from './webpack.js'
import '@nuxt/schema'

export interface ModuleOptions extends Options {

}

export default defineNuxtModule<ModuleOptions>({
  defaults: {
    // ...default options
  },
  meta: {
    configKey: 'gltfTypeToolkit',
    name: '@todde.tv/gltf-type-toolkit',
  },
  setup(options, _nuxt) {
    addVitePlugin(() => vite(options))
    addWebpackPlugin(() => webpack(options))

    // ...
  },
})
