import type { Options } from './types'
import { name } from '../package.json'
import unplugin from './index.js'

export default (options: Options): any => ({
  hooks: {
    'astro:config:setup': async (astro: any) => {
      astro.config.vite.plugins ||= []
      astro.config.vite.plugins.push(unplugin.vite(options))
    },
  },
  name,
})
