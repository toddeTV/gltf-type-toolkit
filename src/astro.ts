import type { Options } from './types'

import unplugin from './index.js'

export default (options: Options): any => ({
  hooks: {
    'astro:config:setup': async (astro: any) => {
      astro.config.vite.plugins ||= []
      astro.config.vite.plugins.push(unplugin.vite(options))
    },
  },
  name: 'gltf-type-toolkit',
})
