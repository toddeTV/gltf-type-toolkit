import type { Options } from './types'
import { addVitePlugin, addWebpackPlugin, defineNuxtModule } from '@nuxt/kit'
import { name } from '../package.json'
import vite from './vite.js'
import webpack from './webpack.js'
import '@nuxt/schema'

export interface ModuleOptions extends Options {
}

export default defineNuxtModule<ModuleOptions>({
  defaults: {
  },
  meta: {
    configKey: 'gltfTypeToolkit',
    name,
  },
  setup(options, _nuxt) {
    addVitePlugin(() => vite(options))
    addWebpackPlugin(() => webpack(options))
  },
})
